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
    LincState[LincState["None"] = 0] = "None";
    LincState[LincState["Connecting"] = 1] = "Connecting";
    LincState[LincState["Connected"] = 2] = "Connected";
    LincState[LincState["Disconnected"] = 3] = "Disconnected";
    LincState[LincState["Closed"] = 4] = "Closed";
    LincState[LincState["Terminated"] = 5] = "Terminated";
    LincState[LincState["ReConnecting"] = 6] = "ReConnecting";
    LincState[LincState["Error"] = 7] = "Error";
})(LincState = exports.LincState || (exports.LincState = {}));
