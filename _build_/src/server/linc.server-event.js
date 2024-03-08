"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincServerEvent = exports.LincEventType = exports.LincEventName = exports.LINC_EVENT = void 0;
exports.LINC_EVENT = {
    4001: {
        msg: 'Closed due to inactivity'
    },
    1008: {
        msg: `Connection Limit Reached`
    },
    1003: {
        msg: `Invalid Message Format`
    }
};
const LincEventName = (code) => {
    return LincEventType[code];
};
exports.LincEventName = LincEventName;
var LincEventType;
(function (LincEventType) {
    LincEventType[LincEventType["Unknown"] = -1] = "Unknown";
    LincEventType[LincEventType["UnhandledException"] = -10] = "UnhandledException";
    LincEventType[LincEventType["NewConnection"] = 10] = "NewConnection";
    LincEventType[LincEventType["Close"] = 20] = "Close";
    LincEventType[LincEventType["ClosedDueToInactivity"] = 4001] = "ClosedDueToInactivity";
    LincEventType[LincEventType["Message"] = 30] = "Message";
    LincEventType[LincEventType["Error"] = 40] = "Error";
    LincEventType[LincEventType["Warning"] = 50] = "Warning";
    LincEventType[LincEventType["Info"] = 60] = "Info";
    LincEventType[LincEventType["ConnectionLimitReached"] = 1008] = "ConnectionLimitReached";
    LincEventType[LincEventType["InvalidMessageFormat"] = 1003] = "InvalidMessageFormat";
})(LincEventType || (exports.LincEventType = LincEventType = {}));
/**
 * Data model for server events
 */
class LincServerEvent {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    static fromCode(event, payload) {
        return new LincServerEvent(event, payload);
    }
    static fromError(error) {
        return new LincServerEvent(LincEventType.UnhandledException, error);
    }
}
exports.LincServerEvent = LincServerEvent;
