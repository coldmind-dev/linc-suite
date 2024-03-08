"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-20
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
exports.createServer = void 0;
const linc_global_1 = require("../../linc.global");
// ServerFactory.ts
function createServer() {
    if ((0, linc_global_1.getIsNode)()) {
        let http = require("http");
        return new NodeHttpServer(http);
    }
    else {
        return new MockHttpServer();
    }
}
exports.createServer = createServer;
class NodeHttpServer {
    constructor(http) {
        this.server = http.createServer((req, res) => {
            // Placeholder for request handling
        });
    }
    listen(port, callback) {
        this.server.listen(port, callback);
    }
    close(callback) {
        this.server.close(callback);
    }
}
class MockHttpServer {
    listen(port, callback) {
        console.log(`Mock server listening on port ${port}`);
        if (callback)
            callback();
    }
    close(callback) {
        console.log("Mock server closed");
        if (callback)
            callback();
    }
}
