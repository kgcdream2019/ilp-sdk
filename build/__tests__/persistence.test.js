"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const __1 = require("..");
/*newly added code for xmrd*/
/*import { addBtc, addEth, addXrp } from './helpers'*/
/*end*/
/*newly added code for xmrd*/
const helpers_1 = require("./helpers");
/*end*/
require('envkey');
ava_1.default('rebuilds sdk from a serialized config', async (t) => {
    const sdk = await __1.connect(process.env.LEDGER_ENV);
    await Promise.all(
    /*newly added code for xmrd*/
    /*[addBtc, addXrp, addEth].map(createUplink => createUplink()(sdk))*/
    /*end*/
    /*newly added code for xmrd*/
    [helpers_1.addBtc, helpers_1.addXrp, helpers_1.addXmrd, helpers_1.addEth].map(createUplink => createUplink()(sdk))
    /*end*/
    );
    await sdk.disconnect();
    const initialSerializedConfig = sdk.serializeConfig();
    // Reconnect the API
    const newSdk = await __1.connect(process.env.LEDGER_ENV, initialSerializedConfig);
    t.is(newSdk.state.credentials.length, 3, 'same number of credentials');
    t.is(newSdk.state.uplinks.length, 3, 'same number of uplink');
    await newSdk.disconnect();
    const rebuiltSerializedConfig = newSdk.serializeConfig();
    t.is(JSON.stringify(rebuiltSerializedConfig), JSON.stringify(initialSerializedConfig), 'config is persisted and can be rebuilt from the persisted version');
});
//# sourceMappingURL=persistence.test.js.map