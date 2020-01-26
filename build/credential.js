"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("./engine");
const lnd_1 = require("./settlement/lnd");
const xrp_paychan_1 = require("./settlement/xrp-paychan");
const machinomy_1 = require("./settlement/machinomy");
/*newly added code for xmrd*/
const xmrd_paychan_1 = require("./settlement/xmrd-paychan");
exports.setupCredential = (credential) => {
    switch (credential.settlerType) {
        case engine_1.SettlementEngineType.Lnd:
            return lnd_1.Lnd.setupCredential(credential);
        case engine_1.SettlementEngineType.Machinomy:
            return machinomy_1.Machinomy.setupCredential(credential);
        case engine_1.SettlementEngineType.XrpPaychan:
            return xrp_paychan_1.XrpPaychan.setupCredential(credential);
        /*newly added code for xmrd*/
        case engine_1.SettlementEngineType.XmrdPaychan:
            return xmrd_paychan_1.XmrdPaychan.setupCredential(credential);
        /*end*/
    }
};
// TODO Should this also check the settlerType of the credential? Or could there be a hash/uniqueId?
exports.getCredential = (state) => (credentialId) => state.credentials.find((someCredential) => exports.getCredentialId(someCredential) === credentialId);
exports.getOrCreateCredential = (state) => async (credentialConfig) => {
    const readyCredential = await exports.setupCredential(credentialConfig)(state);
    const credentialId = exports.getCredentialId(readyCredential);
    const existingCredential = state.credentials.filter(exports.isThatCredentialId(credentialId, credentialConfig.settlerType))[0];
    if (existingCredential) {
        await exports.closeCredential(readyCredential);
        return existingCredential;
    }
    else {
        state.credentials = [...state.credentials, readyCredential];
        return readyCredential;
    }
};
exports.getCredentialId = (credential) => {
    switch (credential.settlerType) {
        case engine_1.SettlementEngineType.Lnd:
            return lnd_1.Lnd.uniqueId(credential);
        case engine_1.SettlementEngineType.Machinomy:
            return machinomy_1.Machinomy.uniqueId(credential);
        case engine_1.SettlementEngineType.XrpPaychan:
            return xrp_paychan_1.XrpPaychan.uniqueId(credential);
        /*newly added code for xmrd*/
        case engine_1.SettlementEngineType.XmrdPaychan:
            return xmrd_paychan_1.XmrdPaychan.uniqueId(credential);
        /*end*/
    }
};
exports.closeCredential = async (credential) => {
    switch (credential.settlerType) {
        case engine_1.SettlementEngineType.Lnd:
            return lnd_1.Lnd.closeCredential(credential);
        case engine_1.SettlementEngineType.Machinomy:
            return;
        case engine_1.SettlementEngineType.XrpPaychan:
            return;
        /*newly added code for xmrd*/
        case engine_1.SettlementEngineType.XmrdPaychan:
            return;
        /*end*/
    }
};
exports.isThatCredentialId = (credentialId, settlerType) => (someCredential) => someCredential.settlerType === settlerType &&
    exports.getCredentialId(someCredential) === credentialId;
exports.isThatCredential = (credential) => (someCredential) => someCredential.settlerType === credential.settlerType &&
    exports.getCredentialId(someCredential) === exports.getCredentialId(credential);
exports.credentialToConfig = (credential) => {
    switch (credential.settlerType) {
        case engine_1.SettlementEngineType.Lnd:
            return lnd_1.configFromLndCredential(credential);
        case engine_1.SettlementEngineType.Machinomy:
            return machinomy_1.configFromEthereumCredential(credential);
        case engine_1.SettlementEngineType.XrpPaychan:
            return xrp_paychan_1.configFromXrpCredential(credential);
        /*newly added code for xmrd*/
        case engine_1.SettlementEngineType.XmrdPaychan:
            return xmrd_paychan_1.configFromXmrdCredential(credential);
        /*end*/
    }
};
//# sourceMappingURL=credential.js.map