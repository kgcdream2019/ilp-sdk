import { AssetQuantity } from '@kava-labs/crypto-rate-utils';
import XmrdPlugin, { XmrdAccount } from 'ilp-plugin-xmrd-paychan';
import BigNumber from 'bignumber.js';
import { RippleAPI } from 'ripple-lib';
import { Flavor } from '../types/util';
import { LedgerEnv, State } from '..';
import { SettlementEngine, SettlementEngineType } from '../engine';
import { AuthorizeDeposit, AuthorizeWithdrawal, BaseUplink, BaseUplinkConfig, ReadyUplink } from '../uplink';
/**
 * ------------------------------------
 * SETTLEMENT ENGINE
 * ------------------------------------
 */
export interface XmrdPaychanSettlementEngine extends SettlementEngine {
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly api: RippleAPI;
}
export declare const closeXmrdPaychanEngine: ({ api }: XmrdPaychanSettlementEngine) => Promise<void>;
/**
 * ------------------------------------
 * CREDENTIAL
 * ------------------------------------
 */
export declare type UnvalidatedXmrdSecret = {
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly secret: string;
};
export declare type ValidatedXmrdSecret = Flavor<{
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly secret: string;
    readonly address: string;
}, 'ValidatedXmrdSecret'>;
export declare const configFromXmrdCredential: ({ address, ...cred }: Flavor<{
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly secret: string;
    readonly address: string;
}, "ValidatedXmrdSecret">) => UnvalidatedXmrdSecret;
export declare const getBaseBalance: (settler: XmrdPaychanSettlementEngine, credential: Flavor<{
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly secret: string;
    readonly address: string;
}, "ValidatedXmrdSecret">) => Promise<AssetQuantity>;
/**
 * ------------------------------------
 * UPLINK
 * ------------------------------------
 */
export interface XmrdPaychanBaseUplink extends BaseUplink {
    readonly settlerType: SettlementEngineType.XmrdPaychan;
    readonly credentialId: string;
    readonly plugin: XmrdPlugin;
    readonly pluginAccount: XmrdAccount;
}
export declare type ReadyXmrdPaychanUplink = XmrdPaychanBaseUplink & ReadyUplink;
/**
 * ------------------------------------
 * SETTLEMENT MODULE
 * ------------------------------------
 */
export declare const XmrdPaychan: {
    setupEngine: (ledgerEnv: LedgerEnv) => Promise<XmrdPaychanSettlementEngine>;
    setupCredential: (cred: UnvalidatedXmrdSecret) => (state: State) => Promise<Flavor<{
        readonly settlerType: SettlementEngineType.XmrdPaychan;
        readonly secret: string;
        readonly address: string;
    }, "ValidatedXmrdSecret">>;
    uniqueId: (cred: Flavor<{
        readonly settlerType: SettlementEngineType.XmrdPaychan;
        readonly secret: string;
        readonly address: string;
    }, "ValidatedXmrdSecret">) => string;
    connectUplink: (credential: Flavor<{
        readonly settlerType: SettlementEngineType.XmrdPaychan;
        readonly secret: string;
        readonly address: string;
    }, "ValidatedXmrdSecret">) => (state: State) => (config: BaseUplinkConfig) => Promise<XmrdPaychanBaseUplink>;
    deposit: (uplink: ReadyXmrdPaychanUplink) => (state: State) => ({ amount, authorize }: {
        readonly amount: BigNumber;
        readonly authorize: AuthorizeDeposit;
    }) => Promise<void>;
    withdraw: (uplink: ReadyXmrdPaychanUplink) => (authorize: AuthorizeWithdrawal) => Promise<void>;
    getBaseBalance: (settler: XmrdPaychanSettlementEngine, credential: Flavor<{
        readonly settlerType: SettlementEngineType.XmrdPaychan;
        readonly secret: string;
        readonly address: string;
    }, "ValidatedXmrdSecret">) => Promise<AssetQuantity>;
};
