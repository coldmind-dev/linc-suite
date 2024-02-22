"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-04
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
exports.newMsgId = exports.uuidv4 = void 0;
try {
    exports.uuidv4 = require('uuid').v4;
}
catch (e) {
    console.error('uuid package not found, using a simple message id generator instead');
    exports.uuidv4 = () => {
        return Math.random().toString(36).substring(2);
    };
}
/**
 * Generates a unique message ID using the uuid library.
 * @returns {string} A unique message ID.
 */
function newMsgId() {
    return (0, exports.uuidv4)();
}
exports.newMsgId = newMsgId;
