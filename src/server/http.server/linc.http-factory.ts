/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-20
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

import { getIsNode } from "../../linc.global";

interface HttpRequest {
	method?: string;
	url?: string;
	headers: Record<string, string>;
	body?: any;
}

interface HttpResponse {
	statusCode: number;
	setHeader(name: string, value: string): void;
	write(content: string): void;
	end(): void;
}

interface IHttpServer {
	listen(port: number, callback?: () => void): void;
	close(callback?: () => void): void;
}

// ServerFactory.ts
function createServer(): IHttpServer {
	if (getIsNode()) {
		let http = require("http");
		return new NodeHttpServer(http);
	} else {
		return new MockHttpServer();
	}
}

class NodeHttpServer implements IHttpServer {
	private server: any;

	constructor(http: typeof import("http")) {
		this.server = http.createServer((req: any, res: any) => {
			// Placeholder for request handling
		});
	}

	listen(port: number, callback?: () => void): void {
		this.server.listen(port, callback);
	}

	close(callback?: () => void): void {
		this.server.close(callback);
	}
}

class MockHttpServer implements IHttpServer {
	listen(port: number, callback?: () => void): void {
		console.log(`Mock server listening on port ${port}`);
		if (callback) callback();
	}

	close(callback?: () => void): void {
		console.log("Mock server closed");
		if (callback) callback();
	}
}

export { createServer, IHttpServer, HttpRequest, HttpResponse };
