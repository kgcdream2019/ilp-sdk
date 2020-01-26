"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const crypto_rate_utils_1 = require("@kava-labs/crypto-rate-utils");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const assets_1 = require("../assets");
exports.addEth = (n = 1) => ({ add }) => add({
    settlerType: __1.SettlementEngineType.Machinomy,
    privateKey: process.env[`ETH_PRIVATE_KEY_CLIENT_${n}`]
});
exports.addDai = (n = 1) => ({ add }) => add({
    settlerType: __1.SettlementEngineType.Machinomy,
    assetType: 'DAI',
    privateKey: process.env[`ETH_PRIVATE_KEY_CLIENT_${n}`]
});
exports.addBtc = (n = 1) => ({ add }) => add({
    settlerType: __1.SettlementEngineType.Lnd,
    hostname: process.env[`LIGHTNING_LND_HOST_CLIENT_${n}`],
    tlsCert: process.env[`LIGHTNING_TLS_CERT_PATH_CLIENT_${n}`],
    macaroon: process.env[`LIGHTNING_MACAROON_PATH_CLIENT_${n}`],
    grpcPort: parseInt(process.env[`LIGHTNING_LND_GRPCPORT_CLIENT_${n}`], 10)
});
exports.addXrp = (n = 1) => ({ add }) => add({
    settlerType: __1.SettlementEngineType.XrpPaychan,
    secret: process.env[`XRP_SECRET_CLIENT_${n}`]
});
/*newly added code for xmrd*/
exports.addXmrd = (n = 1) => ({ add }) => add({
    settlerType: __1.SettlementEngineType.XmrdPaychan,
    secret: process.env[`XMRD_SECRET_CLIENT_${n}`]
});
/*end*/
exports.createFundedUplink = (api) => async (createUplink) => {
    const uplink = await createUplink(api);
    const amount = crypto_rate_utils_1.convert(crypto_rate_utils_1.exchangeQuantity(assets_1.usdAsset, 3), crypto_rate_utils_1.exchangeUnit(uplink.asset), api.state.rateBackend).amount.decimalPlaces(assets_1.getAssetScale(uplink.asset), bignumber_js_1.default.ROUND_DOWN);
    await api.deposit({
        uplink,
        amount,
        authorize: () => Promise.resolve()
    });
    return uplink;
};
// Helper that runs deposit/withdraw, capturing and returning the reported tx value and fees.
exports.captureFeesFrom = async (apiMethod) => {
    /* tslint:disable-next-line:no-let */
    let pendingOp = Promise.resolve();
    const reportedFee = new Promise(resolve => {
        pendingOp = apiMethod(async ({ fee }) => resolve(fee));
    });
    await pendingOp;
    return reportedFee;
};
//# sourceMappingURL=helpers.js.map