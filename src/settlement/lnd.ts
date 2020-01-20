import {
  exchangeQuantity,
  baseQuantity,
  AssetQuantity
} from '@kava-labs/crypto-rate-utils'
import BigNumber from 'bignumber.js'
import { Option, tryCatch } from 'fp-ts/lib/Option'
import LightningPlugin, {
  createGrpcClient,
  createInvoiceStream,
  createLnrpc,
  createPaymentStream,
  GrpcClient,
  InvoiceStream,
  LndService,
  lnrpc,
  PaymentStream
} from 'ilp-plugin-lightning'
import { BehaviorSubject, from, fromEvent, interval, merge } from 'rxjs'
import { filter, mergeMap, throttleTime } from 'rxjs/operators'
import { URL } from 'url'
import { promisify } from 'util'
import { State, LedgerEnv } from '..'
import { SettlementEngine, SettlementEngineType } from '../engine'
import { Flavor } from '../types/util'
import { BaseUplink, BaseUplinkConfig, ReadyUplink } from '../uplink'
import createLogger from '../utils/log'
import { MemoryStore } from '../utils/store'
import { btcAsset } from '../assets'

const satToBtc = (amount: BigNumber.Value): AssetQuantity =>
  exchangeQuantity(baseQuantity(btcAsset, amount))

/*
 * ------------------------------------
 * SETTLEMENT ENGINE
 * ------------------------------------
 */

export interface LndSettlementEngine extends SettlementEngine {
  readonly settlerType: SettlementEngineType.Lnd
}

const setupEngine = async (
  ledgerEnv: LedgerEnv
): Promise<LndSettlementEngine> => ({
  settlerType: SettlementEngineType.Lnd
})

/*
 * ------------------------------------
 * CREDENTIAL
 * ------------------------------------
 */

/**
 * Confirm a host is semantically valid (e.g. "localhost:8080")
 * and split into component hostname and port
 */
export const splitHost = (host: string): Option<ValidHost> =>
  tryCatch(() => new URL('https://' + host)).map(({ hostname, port }) => ({
    hostname,
    port: parseInt(port, 10)
  }))

export type ValidHost = {
  readonly hostname: string
  readonly port: number
}

export interface ValidatedLndCredential {
  readonly settlerType: SettlementEngineType.Lnd
  /** LND node hostname that exposes peering and gRPC server on different ports */
  readonly hostname: string
  /** Port for gRPC connections */
  readonly grpcPort?: number
  /** TLS cert as a Base64-encoded string */
  readonly tlsCert: string
  /** LND macaroon as Base64-encoded string */
  readonly macaroon: string
}

export type LndIdentityPublicKey = Flavor<string, 'LndIdentityPublicKey'>

export interface ReadyLndCredential {
  readonly settlerType: SettlementEngineType.Lnd

  /** gRPC client for raw RPC calls */
  readonly grpcClient: GrpcClient

  /** Wrapped gRPC client in a Lightning RPC service with typed methods and messages */
  readonly service: LndService

  /** Bidirectional streaming RPC to send outgoing payments and receive attestations */
  readonly paymentStream: PaymentStream

  /** Streaming RPC of newly added or settled invoices */
  readonly invoiceStream: InvoiceStream

  /** Lightning secp256k1 public key */
  readonly identityPublicKey: LndIdentityPublicKey

  /** Streaming updates of balance in channel */
  readonly channelBalance$: BehaviorSubject<BigNumber>

  /** TODO */
  readonly config: ValidatedLndCredential
}

const fetchChannelBalance = async (
  lightning: LndService
): Promise<BigNumber> => {
  const res = await lightning.channelBalance({})
  return satToBtc(res.balance.toString()).amount
}

const uniqueId = (cred: ReadyLndCredential): LndIdentityPublicKey =>
  cred.identityPublicKey

const setupCredential = (opts: ValidatedLndCredential) => async (): Promise<
  ReadyLndCredential
> => {
  // Create and connect the internal LND service (passed to plugins)
  const grpcClient = createGrpcClient(opts)
  await promisify(grpcClient.waitForReady.bind(grpcClient))(Date.now() + 10000)

  const service = createLnrpc(grpcClient)

  // Fetch the public key so the user doesn't have to provide it
  // (necessary as a unique identifier for this LND node)
  const response = await service.getInfo({})
  const identityPublicKey = response.identityPubkey

  const paymentStream = createPaymentStream(service)
  const payments$ = fromEvent<lnrpc.SendResponse>(paymentStream, 'data')
  const invoiceStream = createInvoiceStream(service)
  const invoices$ = fromEvent<lnrpc.IInvoice>(invoiceStream, 'data').pipe(
    // Only refresh when invoices are paid/settled
    filter(invoice => !!invoice.settled)
  )

  // Fetch an updated channel balance every 3s, or whenever an invoice is paid (by us or counterparty)
  const channelBalance$ = new BehaviorSubject(new BigNumber(0))
  merge(invoices$, payments$, interval(3000))
    .pipe(
      // Limit balance requests to 10 per second
      throttleTime(100),
      mergeMap(() => from(fetchChannelBalance(service)))
    )
    .subscribe(channelBalance$)

  return {
    settlerType: SettlementEngineType.Lnd,
    grpcClient,
    service,
    paymentStream,
    invoiceStream,
    identityPublicKey,
    channelBalance$,
    config: opts
  }
}

// TODO Also unsubscribe/end all of the event listeners (confirm there aren't any memory leaks)
export const closeCredential = async ({ grpcClient }: ReadyLndCredential) =>
  grpcClient.close()

export const configFromLndCredential = (
  cred: ReadyLndCredential
): ValidatedLndCredential => cred.config

/*
 * ------------------------------------
 * UPLINK
 * ------------------------------------
 */

export interface LndUplinkConfig extends BaseUplinkConfig {
  readonly settlerType: SettlementEngineType.Lnd
  readonly credentialId: LndIdentityPublicKey
}

export interface LndBaseUplink extends BaseUplink {
  readonly settlerType: SettlementEngineType.Lnd
  readonly credentialId: LndIdentityPublicKey
}

export type ReadyLndUplink = LndBaseUplink & ReadyUplink

// TODO Is the base config fine?
const connectUplink = (credential: ReadyLndCredential) => (
  state: State
) => async (config: BaseUplinkConfig): Promise<LndBaseUplink> => {
  const server = config.plugin.btp.serverUri
  const store = config.plugin.store

  const plugin = new LightningPlugin(
    {
      role: 'client',
      server,
      /**
       * Inject the existing LND service, since it may be shared across multiple uplinks
       * Share the same payment/invoice stream across multiple plugins
       */
      lnd: credential.service,
      paymentStream: credential.paymentStream,
      invoiceStream: credential.invoiceStream
    },
    {
      log: createLogger('ilp-plugin-lightning'),
      store: new MemoryStore(store)
    }
  )

  const outgoingCapacity$ = credential.channelBalance$
  const incomingCapacity$ = new BehaviorSubject(new BigNumber(Infinity))
  const totalReceived$ = new BehaviorSubject(new BigNumber(0))
  const totalSent$ = new BehaviorSubject(new BigNumber(0))

  return {
    settlerType: SettlementEngineType.Lnd,
    asset: btcAsset,
    credentialId: uniqueId(credential),
    plugin,
    outgoingCapacity$,
    incomingCapacity$,
    totalSent$,
    totalReceived$
  }
}

export const getBaseBalance = async (
  credential: ReadyLndCredential
): Promise<AssetQuantity> => {
  const lndService = credential.service
  const baseBalance = await lndService.walletBalance({})
  return satToBtc(baseBalance.confirmedBalance.toString())
}

/**
 * ------------------------------------
 * SETTLEMENT MODULE
 * ------------------------------------
 */

export const Lnd = {
  setupEngine,
  setupCredential,
  uniqueId,
  closeCredential,
  connectUplink,
  getBaseBalance
}
