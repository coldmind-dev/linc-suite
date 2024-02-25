"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-25
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToFile = exports.fileToString = void 0;
const fs = __importStar(require("fs"));
/**
 * Reads the content of the file at the given path and returns it as a string.
 *
 * @param {string} filePath
 * @param {boolean} throws
 * @returns {string}
 */
function fileToString(filePath, throws) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    }
    catch (e) {
        if (throws) {
            throw e ?? new Error(`Could not read file: ${filePath}`);
        }
    }
    return "";
}
exports.fileToString = fileToString;
/**
 * Writes the given content to the file at the given path.
 *
 * @param {string} filePath
 * @param {string} content
 * @param {boolean} throws
 */
function stringToFile(filePath, content, throws = true) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
    }
    catch (e) {
        if (throws) {
            throw e ?? new Error(`Could not write file: ${filePath}`);
        }
    }
}
exports.stringToFile = stringToFile;
