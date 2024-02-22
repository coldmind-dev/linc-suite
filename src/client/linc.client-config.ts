/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ILincMessage }               from "@msg/linc.message";
import { IReconnectStrategy }         from "@client/linc.reconnect-strategy";
import { DEFAULT_RECONNECT_STRATEGY } from "@client/linc.reconnect-strategy";

export interface ILincConfig {
	url: string;
	protocols?: string | string[];
	jwtSecret?: string;
	reconnectStrategy?: IReconnectStrategy;
}

export class LincClientConfig implements ILincConfig {
	private messageQueue: ILincMessage[] = [];

	constructor(
		public url: string,
		public jwtSecret?: string,
		public reconnectStrategy?: IReconnectStrategy,
		public protocols?: string | string[]
	) {
		this.initReconnectStrategy(reconnectStrategy);

		this.messageQueue = [];
	}

	initReconnectStrategy(strategy?: IReconnectStrategy) {
		this.reconnectStrategy = { ...DEFAULT_RECONNECT_STRATEGY, ...strategy };
	}
}
