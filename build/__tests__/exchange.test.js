"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const __1 = require("..");
/*newly added code for xmrd*/
/*import { addEth, addXrp, addBtc, createFundedUplink, addDai } from './helpers'*/
/*end*/
/*newly added code for xmrd*/
const helpers_1 = require("./helpers");
/*end*/
const crypto_rate_utils_1 = require("@kava-labs/crypto-rate-utils");
const perf_hooks_1 = require("perf_hooks");
const assets_1 = require("../assets");
require('envkey');
const test = ava_1.default;
// Before & after each test, construct and disconnect the API
test.beforeEach(async (t) => {
    t.context = await __1.connect(process.env.LEDGER_ENV);
});
// TODO Turn this into a generic helper
test.afterEach(async (t) => t.context.disconnect());
exports.testExchange = (createSource, createDest) => async (t) => {
    const api = t.context;
    const { state, streamMoney } = api;
    const [sourceUplink, destUplink] = await Promise.all([
        helpers_1.createFundedUplink(api)(createSource),
        helpers_1.createFundedUplink(api)(createDest)
    ]);
    // TODO Without this pause, Lnd -> Lnd will fail
    await new Promise(r => setTimeout(r, 3000));
    const initialSourceBalance = sourceUplink.balance$.value;
    const initialDestBalance = destUplink.balance$.value;
    const amountToSend = crypto_rate_utils_1.convert(crypto_rate_utils_1.exchangeQuantity(assets_1.usdAsset, 2), crypto_rate_utils_1.exchangeUnit(sourceUplink.asset), state.rateBackend).amount.decimalPlaces(assets_1.getAssetScale(sourceUplink.asset));
    const start = perf_hooks_1.performance.now();
    await t.notThrowsAsync(streamMoney({
        amount: amountToSend,
        source: sourceUplink,
        dest: destUplink
    }));
    t.log(`time: ${perf_hooks_1.performance.now() - start} ms`);
    // TODO Wait up to 2 seconds for the final settlements to come in
    await new Promise(r => setTimeout(r, 2000));
    const finalSourceBalance = sourceUplink.balance$.value;
    t.true(initialSourceBalance.minus(amountToSend).isEqualTo(finalSourceBalance), 'source balance accurately represents the amount that was sent');
    const estimatedReceiveAmount = crypto_rate_utils_1.convert(crypto_rate_utils_1.exchangeQuantity(sourceUplink.asset, amountToSend), crypto_rate_utils_1.exchangeUnit(destUplink.asset), state.rateBackend).amount;
    const estimatedDestFinalBalance = initialDestBalance.plus(estimatedReceiveAmount);
    const finalDestBalance = destUplink.balance$.value;
    t.true(finalDestBalance.isGreaterThan(estimatedDestFinalBalance.times(0.99)) &&
        finalDestBalance.isLessThan(estimatedDestFinalBalance.times(1.01)), 'destination balance accounts for the amount that was sent, with margin for exchange rate fluctuations');
};
test('xrp -> eth', exports.testExchange(helpers_1.addXrp(), helpers_1.addEth()));
test('xrp -> btc', exports.testExchange(helpers_1.addXrp(), helpers_1.addBtc()));
test('xrp -> xrp', exports.testExchange(helpers_1.addXrp(), helpers_1.addXrp(2)));
test('btc -> eth', exports.testExchange(helpers_1.addBtc(), helpers_1.addEth()));
test('btc -> xrp', exports.testExchange(helpers_1.addBtc(), helpers_1.addXrp()));
test('btc -> btc', exports.testExchange(helpers_1.addBtc(), helpers_1.addBtc(2)));
test('eth -> btc', exports.testExchange(helpers_1.addEth(), helpers_1.addBtc()));
test('eth -> xrp', exports.testExchange(helpers_1.addEth(), helpers_1.addXrp()));
test('eth -> eth', exports.testExchange(helpers_1.addEth(), helpers_1.addEth(2)));
// Since DAI and ETH are similar, only perform a subset of pairs for DAI
test('btc -> dai', exports.testExchange(helpers_1.addBtc(), helpers_1.addDai()));
test('dai -> xrp', exports.testExchange(helpers_1.addDai(), helpers_1.addXrp()));
test('dai -> dai', exports.testExchange(helpers_1.addDai(), helpers_1.addDai(2)));
/*newly added code for xmrd*/
test('xmrd -> btc', exports.testExchange(helpers_1.addXmrd(), helpers_1.addBtc()));
test('xmrd -> xrp', exports.testExchange(helpers_1.addXmrd(), helpers_1.addXrp()));
test('xmrd -> eth', exports.testExchange(helpers_1.addXmrd(), helpers_1.addEth()));
test('xmrd -> dai', exports.testExchange(helpers_1.addXmrd(), helpers_1.addDai()));
test('xmrd -> xmrd', exports.testExchange(helpers_1.addXmrd(), helpers_1.addXmrd(2)));
test('btc -> xmrd', exports.testExchange(helpers_1.addBtc(), helpers_1.addXmrd()));
test('xrp -> xmrd', exports.testExchange(helpers_1.addXrp(), helpers_1.addXmrd()));
test('eth -> xmrd', exports.testExchange(helpers_1.addEth(), helpers_1.addXmrd()));
test('dai -> xmrd', exports.testExchange(helpers_1.addDai(), helpers_1.addXmrd()));
/*end*/
//# sourceMappingURL=exchange.test.js.map