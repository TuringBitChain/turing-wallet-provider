"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuringProvider = exports.TuringContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
exports.TuringContext = (0, react_1.createContext)(undefined);
var TuringProvider = function (props) {
    var children = props.children;
    // It takes a moment for the Turing wallet to get injected into the DOM. To use context we need an initial state;
    var _a = (0, react_1.useState)({ isReady: false }), TuringWallet = _a[0], setTuringWallet = _a[1];
    (0, react_1.useEffect)(function () {
        var checkTuringWallet = function () {
            var _a;
            if ("Turing" in window && ((_a = window.Turing) === null || _a === void 0 ? void 0 : _a.isReady)) {
                setTuringWallet(window.Turing);
            }
        };
        checkTuringWallet();
        var intervalId = setInterval(checkTuringWallet, 1000);
        return function () { return clearInterval(intervalId); };
    }, []);
    return ((0, jsx_runtime_1.jsx)(exports.TuringContext.Provider, { value: TuringWallet, children: children }));
};
exports.TuringProvider = TuringProvider;
