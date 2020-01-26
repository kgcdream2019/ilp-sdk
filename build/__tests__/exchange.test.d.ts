import { ExecutionContext } from 'ava';
import { ReadyUplinks } from '..';
export declare const testExchange: (createSource: (api: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: import("bignumber.js").BigNumber;
        readonly authorize?: import("../uplink").AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: import("../uplink").AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<import("@kava-labs/crypto-rate-utils").AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>, createDest: (api: {
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: import("bignumber.js").BigNumber;
        readonly authorize?: import("../uplink").AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: import("../uplink").AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<import("@kava-labs/crypto-rate-utils").AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}) => Promise<ReadyUplinks>) => (t: ExecutionContext<{
    state: import("..").State;
    add(uplinkConfig: import("..").UplinkConfigs): Promise<ReadyUplinks>;
    deposit({ uplink, amount, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly amount: import("bignumber.js").BigNumber;
        readonly authorize?: import("../uplink").AuthorizeDeposit | undefined;
    }): Promise<void>;
    withdraw({ uplink, authorize }: {
        readonly uplink: ReadyUplinks;
        readonly authorize?: import("../uplink").AuthorizeWithdrawal | undefined;
    }): Promise<void>;
    remove(uplink: ReadyUplinks): Promise<void>;
    streamMoney: ({ amount, source, dest, slippage }: import("../services/switch").StreamMoneyOpts) => Promise<void>;
    getBaseBalance: (uplink: ReadyUplinks) => Promise<import("@kava-labs/crypto-rate-utils").AssetQuantity>;
    serializeConfig(): import("..").MultiConfigSchema;
    disconnect(): Promise<void>;
}>) => Promise<void>;
