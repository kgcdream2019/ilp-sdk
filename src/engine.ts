import { LndSettlementEngine } from './settlement/lnd'
import {
  XrpPaychanSettlementEngine,
  closeXrpPaychanEngine
} from './settlement/xrp-paychan'
import { MachinomySettlementEngine } from './settlement/machinomy'
/*newly added code for xmrd */
import { XmrdPaychanSettlementEngine } from './settlement/xmrd-paychan'
 /*end */
export enum SettlementEngineType {
  /** Lightning daeman */
  Lnd = 'lnd',
  /** Machinomy Ethereum unidirectional payment channels */
  Machinomy = 'machinomy',
  /** XRP ledger native payment channels */
  XrpPaychan = 'xrp-paychan'
  /*newly added code for xmrd */
    /** XMRD ledger native payment channels */
  , XmrdPaychan = 'xmrd-paychan'
  /*end */
}

export interface SettlementEngine {
  readonly settlerType: SettlementEngineType
}

export type SettlementEngines = (
  | LndSettlementEngine
  | MachinomySettlementEngine
  | XrpPaychanSettlementEngine
  /* newly added code for xmrd */
  | XmrdPaychanSettlementEngine
  /* end*/
  ) &
  SettlementEngine

export const closeEngine = async (settler: SettlementEngines) => {
  switch (settler.settlerType) {
    case SettlementEngineType.XrpPaychan:
      return closeXrpPaychanEngine(settler)
  }
}
