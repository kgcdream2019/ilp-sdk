import { ReadyUplinks } from '..';
import { AssetQuantity } from '@kava-labs/crypto-rate-utils';
import BigNumber from 'bignumber.js';
import { AuthorizeDeposit, AuthorizeWithdrawal } from '../uplink';
export declare const addEth: (n?: number) => ({ add }: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>;
export declare const addDai: (n?: number) => ({ add }: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>;
export declare const addBtc: (n?: number) => ({ add }: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>;
export declare const addXrp: (n?: number) => ({ add }: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>;
export declare const addXmrd: (n?: number) => ({ add }: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>;
export declare const createFundedUplink: (api: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => (createUplink: (api: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: BigNumber;
        readonly authorize?: AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>) => Promise<ReadyUplinks>;
export declare const captureFeesFrom: (apiMethod: (authorize: AuthorizeWithdrawal | AuthorizeDeposit) => Promise<any>) => Promise<AssetQuantity>;
