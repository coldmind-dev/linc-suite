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
exports.detectEncoding = exports.uint8ArrayToString = exports.stringToUint8Array = void 0;
/**
 * Converts a string to a Uint8Array, compatible with both Node.js and browsers.
 * @param str The string to convert.
 * @param encoding The character encoding to use for the conversion in Node.js.
 * @returns The string encoded as a Uint8Array.
 */
function stringToUint8Array(str, encoding = 'utf-8') {
    if (typeof TextEncoder !== 'undefined') {
        // Browser
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
    else {
        // Node.js
        return new Uint8Array(Buffer.from(str, encoding));
    }
}
exports.stringToUint8Array = stringToUint8Array;
/**
 * Converts a Uint8Array to a string, compatible with both Node.js and browsers.
 * @param data The Uint8Array to convert.
 * @param encoding The character encoding to use for the conversion in Node.js.
 * @returns The Uint8Array decoded as a string.
 */
function uint8ArrayToString(data, encoding = 'utf-8') {
    if (typeof TextDecoder !== 'undefined') {
        // Browser
        const decoder = new TextDecoder(encoding);
        return decoder.decode(data);
    }
    else {
        // Node.js
        return Buffer.from(data).toString(encoding);
    }
}
exports.uint8ArrayToString = uint8ArrayToString;
/**
 * Attempts to detect the encoding of a given buffer based on common signatures.
 * @param buffer The buffer to analyze.
 * @returns The guessed encoding as a string.
 */
function detectEncoding(buffer) {
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        return 'utf-8';
    }
    else if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        return 'utf-16le';
    }
    else if (buffer.length >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
        return 'utf-16be';
    }
    else {
        // Default fallback or additional checks could be implemented here
        return 'utf-8'; // Fallback to UTF-8 as it is the most common encoding
    }
}
exports.detectEncoding = detectEncoding;
