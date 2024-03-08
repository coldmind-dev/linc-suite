/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-11
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

import { HttpServer } from "@CmTypes/linc.common.types";
import * as http      from "http";
import { LincServer } from "@server/linc.server";

// Settings are the available settings for the app server
export interface IAppServerSettings {
	port: number;
	localBinding: string;
}

// Config is the values of the settings
export type TAppServerConfig = IAppServerSettings;

/**
 * Create a new HTTP Server
 *
 * @param {number} port
 * @param {string} localBinding
 * @returns {module:http.Server<Request, Response>}
 */
export const createServerCore = (port: number, localBinding: string = "localhost") => {
	return new http.Server();
}

export class LincAppServer {
	httpServer: HttpServer;

	get ServerCore(): HttpServer {
		return this.httpServer;
	}

	constructor(port: number, localBinding: string = "localhost") {
		this.httpServer = createServerCore(port, localBinding);
		const server = LincServer.fromConfiguration(
			{
				httpServer: this.httpServer
			}
		);
	}

	static createServer(port: number, localBinding: string = "localhost"): LincAppServer {
		return new LincAppServer(port, localBinding);
	}
}
