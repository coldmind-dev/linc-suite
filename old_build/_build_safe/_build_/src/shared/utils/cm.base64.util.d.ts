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
export declare const encode64: (input: string) => string;
export declare const decode64: (input: string) => string;
/**
 * Encodes a string to CM64 format
 *
 * @param {string} input
 * @returns {string}
 */
export declare const cm64Encode: (input: string) => string;
/**
 * Decodes a CM64 encoded string
 *
 * @param {string} input
 * @returns {string | null}
 */
export declare const cm64Decode: (input: string) => string | null;
/**
 * Checks if a string is a valid CM64 encoding
 *
 * @param {string} input
 * @returns {boolean}
 */
export declare const isValidCM64Encoding: (input: string) => boolean;
