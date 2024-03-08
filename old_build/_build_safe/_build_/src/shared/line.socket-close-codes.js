"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The software is provided "as is", without warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a
 * particular purpose and noninfringement. In no event shall the authors or copyright
 * holders be liable for any claim, damages or other liability, whether in an action of
 * contract, tort or otherwise, arising from, out of or in connection with the software
 * or the use or other dealings in the software.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonReConnectableCodes = exports.WebSocketCloseCode = void 0;
var WebSocketCloseCode;
(function (WebSocketCloseCode) {
    WebSocketCloseCode[WebSocketCloseCode["NormalClosure"] = 1000] = "NormalClosure";
    WebSocketCloseCode[WebSocketCloseCode["GoingAway"] = 1001] = "GoingAway";
    WebSocketCloseCode[WebSocketCloseCode["ProtocolError"] = 1002] = "ProtocolError";
    WebSocketCloseCode[WebSocketCloseCode["UnsupportedData"] = 1003] = "UnsupportedData";
    WebSocketCloseCode[WebSocketCloseCode["NoStatusReceived"] = 1005] = "NoStatusReceived";
    WebSocketCloseCode[WebSocketCloseCode["AbnormalClosure"] = 1006] = "AbnormalClosure";
    WebSocketCloseCode[WebSocketCloseCode["InvalidFramePayloadData"] = 1007] = "InvalidFramePayloadData";
    WebSocketCloseCode[WebSocketCloseCode["PolicyViolation"] = 1008] = "PolicyViolation";
    WebSocketCloseCode[WebSocketCloseCode["MessageTooBig"] = 1009] = "MessageTooBig";
    WebSocketCloseCode[WebSocketCloseCode["MissingExtension"] = 1010] = "MissingExtension";
    WebSocketCloseCode[WebSocketCloseCode["InternalServerError"] = 1011] = "InternalServerError";
    WebSocketCloseCode[WebSocketCloseCode["TLSHandshake"] = 1015] = "TLSHandshake";
    // Custom close codes (3000-3999 range is reserved for use by libraries, frameworks, and applications)
    WebSocketCloseCode[WebSocketCloseCode["ConnectionLost"] = 3000] = "ConnectionLost";
    WebSocketCloseCode[WebSocketCloseCode["ReconnectTimedOut"] = 3001] = "ReconnectTimedOut";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode1"] = 3002] = "CustomCode1";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode2"] = 3003] = "CustomCode2";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode3"] = 3004] = "CustomCode3";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode4"] = 3005] = "CustomCode4"; // Reserved for future use
})(WebSocketCloseCode = exports.WebSocketCloseCode || (exports.WebSocketCloseCode = {}));
//
// Add a property to customize non-reconnectable close codes
//
exports.nonReConnectableCodes = new Set([
    WebSocketCloseCode.NormalClosure,
    WebSocketCloseCode.UnsupportedData,
    WebSocketCloseCode.PolicyViolation,
    WebSocketCloseCode.MessageTooBig,
    WebSocketCloseCode.InternalServerError,
    4000, // Example custom code for "Do not reconnect"
]);
