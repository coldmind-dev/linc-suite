"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-17
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
exports.sleep = exports.willOccur = void 0;
/**
 * Determines if an event will occur based on a given probability.
 *
 * @param {number} probability The probability of the event occurring, a value between 0 and 1.
 * @returns {boolean} Returns `true` if the event occurs, `false` otherwise, based on the given probability.
 * @throws {Error} Throws an error if the probability is not between 0 and 1.
 */
function willOccur(probability) {
    if (probability < 0 || probability > 1) {
        throw new Error('Probability must be between 0 and 1');
    }
    return Math.random() <= probability;
}
exports.willOccur = willOccur;
/**
 * Delays execution for a specified number of milliseconds.
 *
 * @param {number} ms The number of milliseconds to delay execution.
 * @returns {Promise<void>} A promise that resolves after the specified delay, effectively pausing execution.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
/**
 * Delays execution for a specified number of seconds.
 *
 * @returns {Promise<void>} A promise that resolves after the specified delay, effectively pausing execution.
 * @param seconds
 */
async function sleepSec(seconds) {
    await sleep(seconds * 1000);
}
