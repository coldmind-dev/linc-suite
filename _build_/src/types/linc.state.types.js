"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincState = void 0;
var LincState;
(function (LincState) {
    LincState[LincState["None"] = -1000] = "None";
    LincState[LincState["Connecting"] = 0] = "Connecting";
    LincState[LincState["Open"] = 1] = "Open";
    LincState[LincState["Connected"] = 1] = "Connected";
    LincState[LincState["Disconnected"] = -1] = "Disconnected";
    LincState[LincState["Closing"] = 2] = "Closing";
    LincState[LincState["Closed"] = 3] = "Closed";
    LincState[LincState["Terminated"] = 110] = "Terminated";
    LincState[LincState["ReConnecting"] = 120] = "ReConnecting";
    LincState[LincState["Error"] = 130] = "Error";
})(LincState || (exports.LincState = LincState = {}));
