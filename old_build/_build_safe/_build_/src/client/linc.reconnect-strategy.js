"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectStrategy = exports.DEFAULT_RECONNECT_STRATEGY = void 0;
exports.DEFAULT_RECONNECT_STRATEGY = {
    reconnectDecay: 1.5,
    jitter: 0.5,
    reconnectAttempts: Infinity,
    shouldReconnect: true,
    reconnectInterval: 1000,
    maxReconnectInterval: 30000
};
class ReconnectStrategy {
    constructor(reconnectDecay, jitter, reconnectAttempts, shouldReconnect, reconnectInterval, maxReconnectInterval) {
        this.reconnectDecay = reconnectDecay;
        this.jitter = jitter;
        this.reconnectAttempts = reconnectAttempts;
        this.shouldReconnect = shouldReconnect;
        this.reconnectInterval = reconnectInterval;
        this.maxReconnectInterval = maxReconnectInterval;
        this.reconnectDecay = reconnectDecay;
        this.jitter = jitter;
        this.reconnectAttempts = reconnectAttempts;
        this.shouldReconnect = shouldReconnect;
        this.reconnectInterval = reconnectInterval;
        this.maxReconnectInterval = maxReconnectInterval;
    }
    static initReconnectStrategy(value) {
        return new ReconnectStrategy(value.reconnectDecay || exports.DEFAULT_RECONNECT_STRATEGY.reconnectDecay, value.jitter || exports.DEFAULT_RECONNECT_STRATEGY.jitter, value.reconnectAttempts || exports.DEFAULT_RECONNECT_STRATEGY.reconnectAttempts, value.shouldReconnect !== undefined ? value.shouldReconnect : exports.DEFAULT_RECONNECT_STRATEGY.shouldReconnect, value.reconnectInterval || exports.DEFAULT_RECONNECT_STRATEGY.reconnectInterval, value.maxReconnectInterval || exports.DEFAULT_RECONNECT_STRATEGY.maxReconnectInterval);
    }
}
exports.ReconnectStrategy = ReconnectStrategy;
