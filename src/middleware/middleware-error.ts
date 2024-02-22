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
import { IMiddlewareContext } from "@middleware/middleware-context";
import { MiddlewareStatus }   from "@middleware/middleware.status";

export enum MiddlewareErrorType {
	Client = 'client',
	Server = 'server'
}

/**
 * Middleware error type for handling errors within the middleware chain.
 * @typedef {Object} MiddlewareError
 * @property {'client' | 'server'} type - The type of error (client or server).
 * @property {string} message - The error message.
 * @property {number} [statusCode] - Optional WebSocket close code.
 */
export interface IMiddlewareError {
	type: MiddlewareErrorType,
	ctx?: IMiddlewareContext,
	message?: string;
	statusCode?: number;
	error?: Error | any | undefined;
}

export type TMiddlewareError = IMiddlewareError;

export class MiddlewareError implements IMiddlewareError {
	constructor(
		public type: MiddlewareErrorType,
		public ctx?: IMiddlewareContext,
		public message?: string,
		public statusCode?: number,
		public error?: Error | any | undefined
	) {}

	/**
	 * Constructs a new MiddlewareError instance from an error object
	 */
	public static fromError(
		error: Error | any,
		ctx?: IMiddlewareContext,
		type: MiddlewareErrorType = MiddlewareErrorType.Server
	): IMiddlewareError {
		return new MiddlewareError(
			type,
			ctx,
			error.message,
			MiddlewareStatus.Failure,
			error
		);
	}
}
