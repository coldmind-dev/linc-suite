/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ILincMessage } from "@msg/linc.message";
import { ClientInfo }   from "@classes/client-info";
export { WebSocketServer } from 'ws';

/*/ Middleware type for processing messages
export type aaaTMiddleware<T> = (
	data: ILincMessage,
	context: {
		clientInfo: ClientInfo;
		connections: Map<WebSocket, ClientInfo>;
	},
	server: WebSocketServer,
	next: (error?: Error) => void
) => void | Promise<void>;
*/
