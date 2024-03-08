"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLincServerEvent = void 0;
//////////////////////////////////////////////////////////////////////////
//
// Event Types
//
//////////////////////////////////////////////////////////////////////////
var TLincServerEvent;
(function (TLincServerEvent) {
    // Enumerations for different WebSocket events
    TLincServerEvent["NONE"] = "none";
    TLincServerEvent["CONNECTING"] = "connecting";
    TLincServerEvent["CONNECTION"] = "connection";
    TLincServerEvent["CLOSE"] = "close";
    TLincServerEvent["ERROR"] = "error";
    TLincServerEvent["HEADERS"] = "headers";
    TLincServerEvent["LISTENING"] = "listening";
    TLincServerEvent["MESSAGE"] = "message";
    TLincServerEvent["OPEN"] = "open";
    TLincServerEvent["UPGRADE"] = "upgrade";
    TLincServerEvent["Ding"] = "ding";
    TLincServerEvent["Dong"] = "dong";
    TLincServerEvent["Ack"] = "ack";
})(TLincServerEvent || (exports.TLincServerEvent = TLincServerEvent = {}));
