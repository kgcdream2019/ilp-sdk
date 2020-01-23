import { AssetUnit } from '@kava-labs/crypto-rate-utils'
import { SettlementEngineType } from './engine'

// TODO If this is imported from '.', it causes a runtime TypeError that I think is caused by circular dependency resolution
enum LedgerEnv {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Local = 'local'
}

export const ethAsset: AssetUnit = {
  symbol: 'ETH',
  exchangeScale: 18,
  accountScale: 9,
  scale: 0
}

export const daiAsset: AssetUnit = {
  symbol: 'DAI',
  exchangeScale: 18,
  accountScale: 9,
  scale: 0
}

export const xrpAsset: AssetUnit = {
  symbol: 'XRP',
  exchangeScale: 6,
  accountScale: 0,
  scale: 0
}

export const btcAsset: AssetUnit = {
  symbol: 'BTC',
  exchangeScale: 8,
  accountScale: 0,
  scale: 0
}

export const usdAsset: AssetUnit = {
  symbol: 'USD',
  exchangeScale: 2,
  accountScale: 0,
  scale: 0
}
/*newly added code for xmrd*/
export const xmrdAsset: AssetUnit = {
  symbol: 'XMRD',
  exchangeScale: 9,
  accountScale: 0,
  scale: 0
}
/*end*/
export const getAssetScale = (asset: AssetUnit): number =>
  Math.abs(asset.exchangeScale - asset.accountScale)

export const getAsset = (symbol: AssetCode): AssetUnit =>
  ({
    BTC: btcAsset,
    ETH: ethAsset,
    XRP: xrpAsset,
    DAI: daiAsset
    /*newly added code for xmrd*/
    ,XMRD: xmrdAsset
    /*end*/
  }[symbol])
/*newly removed code for xmrd*/
/*export type AssetCode = 'BTC' | 'ETH' | 'DAI' | 'XRP'*/
/*end*/

/*newly added code for xmrd*/
export type AssetCode = 'BTC' | 'ETH' | 'DAI' | 'XRP' | 'XMRD'
/*end*/

export const CONNECTOR_LIST: {
  readonly operatorName: string
  readonly ledgerEnv: LedgerEnv
  readonly assetType: AssetCode
  readonly settlerType: SettlementEngineType
  readonly btp?: (token: string) => string
}[] = [
  /** Mainnet connectors */
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Mainnet,
    assetType: 'BTC',
    settlerType: SettlementEngineType.Lnd,
    btp: token => `btp+wss://:${token}@ilp.kava.io/btc`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Mainnet,
    assetType: 'ETH',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+wss://:${token}@ilp.kava.io/eth`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Mainnet,
    assetType: 'XRP',
    settlerType: SettlementEngineType.XrpPaychan,
    btp: token => `btp+wss://:${token}@ilp.kava.io/xrp`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Mainnet,
    assetType: 'DAI',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+wss://:${token}@ilp.kava.io/dai`
  },
  /*newly added code for xmrd*/
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Mainnet,
    assetType: 'XMRD',
    settlerType: SettlementEngineType.XmrdPaychan,
    btp: token => `btp+wss://:${token}@ilp.kava.io/xmrd`
  },
  /*end*/

  /** Testnet connectors */
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Testnet,
    assetType: 'BTC',
    settlerType: SettlementEngineType.Lnd,
    btp: token => `btp+wss://:${token}@test.ilp.kava.io/btc`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Testnet,
    assetType: 'ETH',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+wss://:${token}@test.ilp.kava.io/eth`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Testnet,
    assetType: 'XRP',
    settlerType: SettlementEngineType.XrpPaychan,
    btp: token => `btp+wss://:${token}@test.ilp.kava.io/xrp`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Testnet,
    assetType: 'DAI',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+wss://:${token}@test.ilp.kava.io/dai`
  },
/*newly added code for xmrd*/
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Testnet,
    assetType: 'XMRD',
    settlerType: SettlementEngineType.XmrdPaychan,
    btp: token => `btp+wss://:${token}@test.ilp.kava.io/xmrd`
  },
/*end*/
  /** Local connectors */
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Local,
    assetType: 'BTC',
    settlerType: SettlementEngineType.Lnd,
    btp: token => `btp+ws://:${token}@localhost:7441`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Local,
    assetType: 'ETH',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+ws://:${token}@localhost:7442`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Local,
    assetType: 'XRP',
    settlerType: SettlementEngineType.XrpPaychan,
    btp: token => `btp+ws://:${token}@localhost:7443`
  },
  {
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Local,
    assetType: 'DAI',
    settlerType: SettlementEngineType.Machinomy,
    btp: token => `btp+ws://:${token}@localhost:7444`
  }
/*newly added code for xmrd*/
  ,{
    operatorName: 'Kava Labs',
    ledgerEnv: LedgerEnv.Local,
    assetType: 'XMRD',
    settlerType: SettlementEngineType.XmrdPaychan,
    btp: token => `btp+ws://:${token}@localhost:7445`
  }
/*end*/
]

// TODO Remove local connectors and provide config option instead
