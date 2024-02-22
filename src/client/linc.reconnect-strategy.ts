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


export interface IReconnectStrategy {
	reconnectDecay: number;
	jitter: number;
	reconnectAttempts: number;
	shouldReconnect: boolean;
	reconnectInterval: number;
	maxReconnectInterval?: number;
}

export const DEFAULT_RECONNECT_STRATEGY = {
	reconnectDecay: 1.5,
	jitter: 0.5,
	reconnectAttempts: Infinity,
	shouldReconnect: true,
	reconnectInterval: 1000,
	maxReconnectInterval: 30000
};

export class ReconnectStrategy implements IReconnectStrategy {
	constructor(
		public reconnectDecay: number,
		public jitter: number,
		public reconnectAttempts: number,
		public shouldReconnect: boolean,
		public reconnectInterval: number,
		public maxReconnectInterval?: number
	) {
		this.reconnectDecay = reconnectDecay;
		this.jitter = jitter;
		this.reconnectAttempts = reconnectAttempts;
		this.shouldReconnect = shouldReconnect;
		this.reconnectInterval = reconnectInterval;
		this.maxReconnectInterval = maxReconnectInterval;
	}

	public static initReconnectStrategy(value: IReconnectStrategy): IReconnectStrategy {
		return new ReconnectStrategy(
			value.reconnectDecay || DEFAULT_RECONNECT_STRATEGY.reconnectDecay,
			value.jitter || DEFAULT_RECONNECT_STRATEGY.jitter,
			value.reconnectAttempts || DEFAULT_RECONNECT_STRATEGY.reconnectAttempts,
			value.shouldReconnect !== undefined ? value.shouldReconnect : DEFAULT_RECONNECT_STRATEGY.shouldReconnect,
			value.reconnectInterval || DEFAULT_RECONNECT_STRATEGY.reconnectInterval,
			value.maxReconnectInterval || DEFAULT_RECONNECT_STRATEGY.maxReconnectInterval
		);
	}
}