"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-03
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincClient = void 0;
const linc_socket_1 = require("@shared/linc.socket");
const cm_url_1 = __importDefault(require("@lib/cm.net/cm.url"));
class LincClient extends linc_socket_1.LincSocket {
    constructor(url) {
        super();
    }
    connectClient(host, port) {
        return Promise.resolve();
    }
    static fromUrl(url) {
        let wsUrl = "";
        try {
            const urlObj = new cm_url_1.default(url);
            let protocol = urlObj?.protocol.toLowerCase();
            if (!protocol)
                protocol = "ws";
            if (!["ws", "wss", "http", "https"].includes(protocol)) {
                throw new Error("Invalid protocol");
            }
            wsUrl = urlObj.toString();
        }
        catch (e) {
            console.error("Invalid URL:: ", e);
            return null;
        }
        return new LincClient(wsUrl);
    }
}
exports.LincClient = LincClient;