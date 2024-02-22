"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-05
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
exports.fromJson = exports.toJson = void 0;
/**
 * Convert an object to its string representation

 * @param {T} obj
 * @returns {string}
 */
function toJson(obj) {
    return JSON.stringify(obj);
}
exports.toJson = toJson;
/**
 * Convert a JSON formatted string into a solid object

 * @param {string} jsonString
 * @returns {T | null}
 */
function fromJson(jsonString) {
    return JSON.parse(jsonString);
}
exports.fromJson = fromJson;
