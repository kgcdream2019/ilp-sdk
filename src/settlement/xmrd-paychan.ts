import {
  AssetQuantity,
  exchangeQuantity,
  baseQuantity
} from '@kava-labs/crypto-rate-utils'
import XmrdPlugin, {
  ClaimablePaymentChannel,
  PaymentChannel,
  remainingInChannel,
  spentFromChannel,
  XmrdAccount
} from '../../../ilp-plugin-xmrd-paychan'
import BigNumber from 'bignumber.js'
import { deriveAddress, deriveKeypair } from 'ripple-keypairs'
import { RippleAPI } from 'ripple-lib'
/*newly added code for xmrd*/
import { makeUrl, XmrdAPI, /*Atomic, Xmrd,*/ generatePaymentId } from '../../../rx-monerodollar-wallet'
/*end*/
import { BehaviorSubject, fromEvent } from 'rxjs'
import { first, map, timeout, startWith } from 'rxjs/operators'
import { Flavor } from '../types/util'
import { LedgerEnv, State } from '..'
import { isThatCredentialId } from '../credential'
import { SettlementEngine, SettlementEngineType } from '../engine'
import {
  AuthorizeDeposit,
  AuthorizeWithdrawal,
  BaseUplink,
  BaseUplinkConfig,
  ReadyUplink
} from '../uplink'
import createLogger from '../utils/log'
import { MemoryStore } from '../utils/store'
import { xmrdAsset } from '../assets'
import { Wallet } from 'ethers'

const dropsToXmrd = (amount: BigNumber.Value): AssetQuantity =>
  exchangeQuantity(baseQuantity(xmrdAsset, amount))

const xmrdToDrops = (amount: BigNumber.Value): AssetQuantity =>
  baseQuantity(exchangeQuantity(xmrdAsset, amount))

/**
 * ------------------------------------
 * SETTLEMENT ENGINE
 * ------------------------------------
 */

export interface XmrdPaychanSettlementEngine extends SettlementEngine {
  readonly settlerType: SettlementEngineType.XmrdPaychan
  /*newly removed code for xmrd */
  /*readonly api: RippleAPI*/
  /*end*/
  /*newly added code for xmrd */
  readonly api: any
  /*end*/
  
}

const getXmrdServerWebsocketUri = (ledgerEnv: LedgerEnv): string =>
  ledgerEnv === 'mainnet'
    ? 'wss://s1.ripple.com'
    : 'wss://s.altnet.rippletest.net:51233'

const setupEngine = async (
  ledgerEnv: LedgerEnv
): Promise<XmrdPaychanSettlementEngine> => {
  const api = XmrdAPI(getXmrdServerWebsocketUri(ledgerEnv))
  /* newly removed code for xmrd */
  /*await api.connect()*/
  /*end*/
  return {
    settlerType: SettlementEngineType.XmrdPaychan,
    api
  }
}

export const closeXmrdPaychanEngine = ({
  api
}: XmrdPaychanSettlementEngine): Promise<void> => api.disconnect()

/**
 * ------------------------------------
 * CREDENTIAL
 * ------------------------------------
 */

export type UnvalidatedXmrdSecret = {
  readonly settlerType: SettlementEngineType.XmrdPaychan
  readonly secret: string
}

export type ValidatedXmrdSecret = Flavor<
  {
    readonly settlerType: SettlementEngineType.XmrdPaychan
    readonly secret: string
    readonly address: string
  },
  'ValidatedXmrdSecret'
>

const setupCredential = (cred: UnvalidatedXmrdSecret) => async (
  state: State
): Promise<ValidatedXmrdSecret> => {
  // `deriveKeypair` will throw if the secret is invalid
  const address = deriveAddress(deriveKeypair(cred.secret).publicKey)
  const settler = state.settlers[cred.settlerType]

  // Rejects if the XMRD account does not exist
  await settler.api.getAccountInfo(address)

  return {
    ...cred,
    address
  }
}

const uniqueId = (cred: ValidatedXmrdSecret): string => cred.address

export const configFromXmrdCredential = ({
  address,
  ...cred
}: ValidatedXmrdSecret): UnvalidatedXmrdSecret => cred

export const getBaseBalance = async (
  settler: XmrdPaychanSettlementEngine,
  credential: ValidatedXmrdSecret
): Promise<AssetQuantity> => {
  const response = await settler.api.getAccountInfo(credential.address)
  return exchangeQuantity(xmrdAsset, response.xrpBalance)
}

/**
 * ------------------------------------
 * UPLINK
 * ------------------------------------
 */

export interface XmrdPaychanBaseUplink extends BaseUplink {
  readonly settlerType: SettlementEngineType.XmrdPaychan
  readonly credentialId: string
  readonly plugin: XmrdPlugin
  readonly pluginAccount: XmrdAccount
}

export type ReadyXmrdPaychanUplink = XmrdPaychanBaseUplink & ReadyUplink

const connectUplink = (credential: ValidatedXmrdSecret) => (
  state: State
) => async (config: BaseUplinkConfig): Promise<XmrdPaychanBaseUplink> => {
  const server = config.plugin.btp.serverUri
  const store = config.plugin.store

  const { secret } = credential
  const xmrdServer = getXmrdServerWebsocketUri(state.ledgerEnv)

  const plugin = new XmrdPlugin(
    {
      role: 'client',
      server,
      xmrdServer,
      xmrdSecret: secret
    },
    {
      log: createLogger('ilp-plugin-xmrd'),
      store: new MemoryStore(store)
    }
  )

  const pluginAccount = await plugin._loadAccount('peer')

  const toXmrd = map<BigNumber, BigNumber>(amount => dropsToXmrd(amount).amount)

  const totalSent$ = new BehaviorSubject(new BigNumber(0))
  fromEvent<PaymentChannel | undefined>(pluginAccount.account.outgoing, 'data')
    .pipe(
      startWith(pluginAccount.account.outgoing.state),
      map(spentFromChannel),
      toXmrd
    )
    .subscribe(totalSent$)

  const outgoingCapacity$ = new BehaviorSubject(new BigNumber(0))
  fromEvent<PaymentChannel | undefined>(pluginAccount.account.outgoing, 'data')
    .pipe(
      startWith(pluginAccount.account.outgoing.state),
      map(remainingInChannel),
      toXmrd
    )
    .subscribe(outgoingCapacity$)

  const totalReceived$ = new BehaviorSubject(new BigNumber(0))
  fromEvent<ClaimablePaymentChannel | undefined>(
    pluginAccount.account.incoming,
    'data'
  )
    .pipe(
      startWith(pluginAccount.account.incoming.state),
      map(spentFromChannel),
      toXmrd
    )
    .subscribe(totalReceived$)

  const incomingCapacity$ = new BehaviorSubject(new BigNumber(0))
  fromEvent<ClaimablePaymentChannel | undefined>(
    pluginAccount.account.incoming,
    'data'
  )
    .pipe(
      startWith(pluginAccount.account.incoming.state),
      map(remainingInChannel),
      toXmrd
    )
    .subscribe(incomingCapacity$)

  return {
    settlerType: SettlementEngineType.XmrdPaychan,
    asset: xmrdAsset,
    credentialId: uniqueId(credential),
    plugin,
    pluginAccount,
    outgoingCapacity$,
    incomingCapacity$,
    totalSent$,
    totalReceived$
  }
}

const deposit = (uplink: ReadyXmrdPaychanUplink) => (state: State) => async ({
  amount,
  authorize
}: {
  readonly amount: BigNumber
  readonly authorize: AuthorizeDeposit
}) => {
  const { api } = state.settlers[uplink.settlerType]
  const readyCredential = state.credentials.find(
    isThatCredentialId<ValidatedXmrdSecret>(
      uplink.credentialId,
      uplink.settlerType
    )
  )
  if (!readyCredential) {
    return
  }
  const { address } = readyCredential

  const fundAmountDrops = xmrdToDrops(amount).amount
  await uplink.pluginAccount.fundOutgoingChannel(
    fundAmountDrops,
    async feeXmrd => {
      // TODO Check the base layer balance to confirm there's enough $$$ on chain (with fee)!

      // Confirm that the account has sufficient funds to cover the reserve
      // TODO May throw if the account isn't found
      const { ownerCount, xmrdBalance } = await api.getAccountInfo(address)
      const {
        validatedLedger: { reserveBaseXMRD, reserveIncrementXMRD }
      } = await api.getServerInfo()
      const minBalance =
        /* Minimum amount of XMRD for every account to keep in reserve */
        +reserveBaseXMRD +
        /** Current amount reserved in XMRD for each object the account is responsible for */
        +reserveIncrementXMRD * ownerCount +
        /** Additional reserve this channel requires, in units of XMRD */
        +reserveIncrementXMRD +
        /** Amount to fund the channel, in unit sof XMRD */
        +amount +
        /** Assume channel creation fee from plugin, in units of XMRD */
        +feeXmrd
      const currentBalance = +xmrdBalance
      if (currentBalance < minBalance) {
        // TODO Return a specific type of error
        throw new Error('insufficient funds')
      }

      await authorize({
        value: amount,
        fee: exchangeQuantity(xmrdAsset, feeXmrd)
      })
    }
  )

  // Wait up to 1 minute for incoming capacity to be created
  await uplink.incomingCapacity$
    .pipe(
      first(amount => amount.isGreaterThan(0)),
      timeout(60000)
    )
    .toPromise()
}

// TODO Move some of this into generic uplink code?
const withdraw = (uplink: ReadyXmrdPaychanUplink) => async (
  authorize: AuthorizeWithdrawal
) => {
  /* tslint:disable-next-line:no-let */
  let claimChannel: Promise<any>

  const isAuthorized = new Promise<any>((resolve, reject) => {
    /* tslint:disable-next-line:no-let */
    let claimChannelAuthReady = false
    const authorizeOnlyOutgoing = async () =>
      !claimChannelAuthReady &&
      authorize({
        value: uplink.outgoingCapacity$.value,
        fee: dropsToXmrd(0)
      }).then(resolve, reject)

    claimChannel = uplink.pluginAccount
      .claimChannel(false, (channel, feeXmrd) => {
        claimChannelAuthReady = true
        const internalAuthorize = authorize({
          value: uplink.outgoingCapacity$.value.plus(
            dropsToXmrd(channel.spent).amount
          ),
          fee: exchangeQuantity(xmrdAsset, feeXmrd)
        })

        internalAuthorize.then(resolve, reject)

        return internalAuthorize
      })
      // If `authorize` was never called to claim the channel,
      // call `authorize` again, but this time only to request the outgoing channel to be closed
      // (this prevents deadlocks if for some reason the incoming channel was already closed)
      .then(authorizeOnlyOutgoing, authorizeOnlyOutgoing)
  })

  // TODO This won't reject if the withdraw fails!
  // Only request the peer to the close if the withdraw is authorized first
  const requestClose = isAuthorized.then(() =>
    uplink.pluginAccount.requestClose()
  )

  // Simultaneously withdraw and request incoming capacity to be removed
  /* tslint:disable-next-line:no-unnecessary-type-assertion */
  await Promise.all([claimChannel!, requestClose])

  // TODO Confirm the incoming capacity has been closed -- or attempt to dispute it?
}

/**
 * ------------------------------------
 * SETTLEMENT MODULE
 * ------------------------------------
 */

export const XmrdPaychan = {
  setupEngine,
  setupCredential,
  uniqueId,
  connectUplink,
  deposit,
  withdraw,
  getBaseBalance
}
