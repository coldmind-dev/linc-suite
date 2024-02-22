"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-10
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLincServerEvent = exports.TSocketError = exports.TMessageEvent = exports.TReconnectEvent = exports.TCloseEvent = exports.TLincDataType = exports.WebSocketCloseCode = exports.isNode = exports.newMsgId = exports.nonReConnectableCodes = exports.log = void 0;
var linc_logger_1 = require("@shared/linc.logger");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return linc_logger_1.log; } });
var line_socket_close_codes_1 = require("@shared/line.socket-close-codes");
Object.defineProperty(exports, "nonReConnectableCodes", { enumerable: true, get: function () { return line_socket_close_codes_1.nonReConnectableCodes; } });
var linc_message_utils_1 = require("@shared/linc.message.utils");
Object.defineProperty(exports, "newMsgId", { enumerable: true, get: function () { return linc_message_utils_1.newMsgId; } });
var linc_platform_utils_1 = require("@shared/linc.platform-utils");
Object.defineProperty(exports, "isNode", { enumerable: true, get: function () { return linc_platform_utils_1.isNode; } });
var line_socket_close_codes_2 = require("@shared/line.socket-close-codes");
Object.defineProperty(exports, "WebSocketCloseCode", { enumerable: true, get: function () { return line_socket_close_codes_2.WebSocketCloseCode; } });
var linc_event_types_1 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TLincDataType", { enumerable: true, get: function () { return linc_event_types_1.TLincDataType; } });
var linc_event_types_2 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TCloseEvent", { enumerable: true, get: function () { return linc_event_types_2.TCloseEvent; } });
var linc_event_types_3 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TReconnectEvent", { enumerable: true, get: function () { return linc_event_types_3.TReconnectEvent; } });
var linc_event_types_4 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TMessageEvent", { enumerable: true, get: function () { return linc_event_types_4.TMessageEvent; } });
var linc_event_types_5 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TSocketError", { enumerable: true, get: function () { return linc_event_types_5.TSocketError; } });
var linc_event_types_6 = require("@shared/linc.event.types");
Object.defineProperty(exports, "TLincServerEvent", { enumerable: true, get: function () { return linc_event_types_6.TLincServerEvent; } });
// Export all types from helper files
__exportStar(require("./helpers/json-parser.helper"), exports);
