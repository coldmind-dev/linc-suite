/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-06
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
/**
 * Converts a string to a Uint8Array, compatible with both Node.js and browsers.
 *
 * @param str The string to convert.
 * @param encoding The character encoding to use for the conversion in Node.js.
 * @returns The string encoded as a Uint8Array.
 */
export declare function stringToUint8Array(str: string, encoding?: string): Uint8Array;
/**
 * Converts a Uint8Array to a string, compatible with both Node.js and browsers.
 *
 * @param data The Uint8Array to convert.
 * @param encoding The character encoding to use for the conversion in Node.js.
 * @returns The Uint8Array decoded as a string.
 */
export declare function uint8ArrayToString(data: Uint8Array, encoding?: string): string;
