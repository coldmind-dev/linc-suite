"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareWrapper = exports.TMiddlewareKind = void 0;
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-07
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
var TMiddlewareKind;
(function (TMiddlewareKind) {
    TMiddlewareKind[TMiddlewareKind["incoming"] = 0] = "incoming";
    TMiddlewareKind[TMiddlewareKind["outgoing"] = 1] = "outgoing";
    TMiddlewareKind[TMiddlewareKind["both"] = 2] = "both";
})(TMiddlewareKind || (exports.TMiddlewareKind = TMiddlewareKind = {}));
// MiddlewareWrapper for managing middleware application context
class MiddlewareWrapper {
    constructor(middleware) {
        this.middleware = middleware;
        this.kind = TMiddlewareKind.both; // Default to both
    }
    onReceive() {
        this.kind = TMiddlewareKind.incoming;
        return this; // Allow chaining
    }
    onSend() {
        this.kind = TMiddlewareKind.outgoing;
        return this; // Allow chaining
    }
    onSendAndReceive() {
        this.kind = TMiddlewareKind.both;
        return this; // Allow chaining
    }
}
exports.MiddlewareWrapper = MiddlewareWrapper;
