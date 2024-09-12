"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTuringWallet = void 0;
var react_1 = require("react");
var TuringWalletContext_1 = require("../context/TuringWalletContext");
var useTuringWallet = function () {
    var context = (0, react_1.useContext)(TuringWalletContext_1.TuringContext);
    if (!context) {
        throw new Error("useTuringWallet must be used within a TuringProvider");
    }
    return context;
};
exports.useTuringWallet = useTuringWallet;
