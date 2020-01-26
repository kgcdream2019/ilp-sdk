"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const __1 = require("..");
const helpers_1 = require("./helpers");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
require('envkey');
const test = ava_1.default;
// Before & after each test, construct and disconnect the API
test.beforeEach(async (t) => {
    t.context = await __1.connect(process.env.LEDGER_ENV);
});
test('after connect', async (t) => {
    await t.notThrowsAsync(t.context.disconnect());
});
test('after add eth', async (t) => {
    await helpers_1.addEth()(t.context);
    await t.notThrowsAsync(t.context.disconnect());
});
test('after deposit eth', async (t) => {
    const uplink = await helpers_1.addEth()(t.context);
    const openAmount = new bignumber_js_1.default(0.01);
    await t.context.deposit({
        uplink,
        amount: openAmount,
        authorize: () => Promise.resolve()
    });
    await t.notThrowsAsync(t.context.disconnect());
});
test('after withdraw eth', async (t) => {
    const uplink = await helpers_1.addEth()(t.context);
    const openAmount = new bignumber_js_1.default(0.01);
    await t.context.deposit({
        uplink,
        amount: openAmount,
        authorize: () => Promise.resolve()
    });
    await t.context.withdraw({ uplink, authorize: () => Promise.resolve() });
    await t.notThrowsAsync(t.context.disconnect());
});
// TODO test the other assets
// TODO maybe refactor the helpers to include a generic deposit method
//# sourceMappingURL=disconnect.test.js.map