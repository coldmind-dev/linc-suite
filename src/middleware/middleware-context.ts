/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-01-30
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

import { WebSocket } from "ws";
import * as http from "http";

/**
 * Middleware context definition, providing necessary information
 * and utilities to middleware functions.
 *
 * @typedef {Object} MiddlewareContext
 * @property {WebSocket} ws - The WebSocket connection.
 * @property {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
 * @property {any} data - The message data to be processed by the middleware.
 * @property {Record<string, any>} userContext - A user-defined context for passing data through the middleware chain.
 */
export interface IMiddlewareContext<T = any> {
	ws: WebSocket;
	req: http.IncomingMessage;
	data: T | undefined;
	params: Record<string, any>;
}

export class MiddlewareContext<T = any> implements IMiddlewareContext<T> {
	constructor(
		public ws: WebSocket,
		public req: http.IncomingMessage,
		public data: T | undefined,
		public params: Record<string, any>
	) {}
}
