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
exports.isValidCM64Encoding = exports.cm64Decode = exports.cm64Encode = exports.decode64 = exports.encode64 = void 0;
const BASE_64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const encode64 = (input) => {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
            BASE_64_CHARS.charAt(enc1) +
            BASE_64_CHARS.charAt(enc2) +
            BASE_64_CHARS.charAt(enc3) +
            BASE_64_CHARS.charAt(enc4);
    } while (i < input.length);
    return output;
};
exports.encode64 = encode64;
const decode64 = (input) => {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    let base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        console.error("There were invalid base64 characters in the input text.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        enc1 = BASE_64_CHARS.indexOf(input.charAt(i++));
        enc2 = BASE_64_CHARS.indexOf(input.charAt(i++));
        enc3 = BASE_64_CHARS.indexOf(input.charAt(i++));
        enc4 = BASE_64_CHARS.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
    } while (i < input.length);
    return output;
};
exports.decode64 = decode64;
/**
 * Encodes a string to CM64 format
 *
 * @param {string} input
 * @returns {string}
 */
const cm64Encode = (input) => {
    const result = { "CM64": (0, exports.encode64)(input) };
    return JSON.stringify(result);
};
exports.cm64Encode = cm64Encode;
/**
 * Decodes a CM64 encoded string
 *
 * @param {string} input
 * @returns {string | null}
 */
const cm64Decode = (input) => {
    let result = null;
    try {
        let result = JSON.parse(input);
        result = (0, exports.decode64)(result.CM64);
    }
    catch (ex) {
        console.error("cm64Decode :: Invalid input string", ex);
    }
    return result;
};
exports.cm64Decode = cm64Decode;
/**
 * Checks if a string is a valid CM64 encoding
 *
 * @param {string} input
 * @returns {boolean}
 */
const isValidCM64Encoding = (input) => {
    let result = false;
    try {
        result = (0, exports.cm64Decode)(input) !== null;
    }
    catch (ex) {
        console.error("isValidCM64Encoding :: Invalid input string", ex);
    }
    return result;
};
exports.isValidCM64Encoding = isValidCM64Encoding;
