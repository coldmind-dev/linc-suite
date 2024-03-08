"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-19
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
exports.SocketError = exports.CmEventError = exports.ClientInfo = void 0;
var client_info_1 = require("./client-info");
Object.defineProperty(exports, "ClientInfo", { enumerable: true, get: function () { return client_info_1.ClientInfo; } });
var cm_event_error_1 = require("./cm.event-error");
Object.defineProperty(exports, "CmEventError", { enumerable: true, get: function () { return cm_event_error_1.CmEventError; } });
var socket_error_1 = require("./socket-error");
Object.defineProperty(exports, "SocketError", { enumerable: true, get: function () { return socket_error_1.SocketError; } });
