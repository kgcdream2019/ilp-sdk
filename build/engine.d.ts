import { LndSettlementEngine } from './settlement/lnd';
import { XrpPaychanSettlementEngine } from './settlement/xrp-paychan';
import { MachinomySettlementEngine } from './settlement/machinomy';
import { XmrdPaychanSettlementEngine } from './settlement/xmrd-paychan';
export declare enum SettlementEngineType {
    /** Lightning daeman */
    Lnd = "lnd",
    /** Machinomy Ethereum unidirectional payment channels */
    Machinomy = "machinomy",
    /** XRP ledger native payment channels */
    XrpPaychan = "xrp-paychan"
    /** XMRD ledger native payment channels */
    ,
    XmrdPaychan = "xmrd-paychan"
}
export interface SettlementEngine {
    readonly settlerType: SettlementEngineType;
}
export declare type SettlementEngines = (LndSettlementEngine | MachinomySettlementEngine | XrpPaychanSettlementEngine | XmrdPaychanSettlementEngine) & SettlementEngine;
export declare const closeEngine: (settler: SettlementEngines) => Promise<void>;
