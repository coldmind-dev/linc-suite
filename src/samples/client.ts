/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import "reflect-metadata";
import { LincClient }    from "@client/linc.client";
import { TMessageEvent } from "@shared/linc.event.types";
import { TCloseEvent }   from "@shared/linc.event.types";

const wsUrl = 'ws://localhost:8080';

const wsClient = new LincClient(wsUrl);


wsClient.onOpen = () => {
	console.log('WebSocket connection opened.');

	wsClient.sendNewMessage('chat', "YOYOYOYO");
};

// Listen for messages from the server
wsClient.onMessage = (event: TMessageEvent) => {
	console.log('Message from server:', JSON.stringify(event));
};

// Listen for possible errors
wsClient.onError = (event: any) => {
	console.error('WebSocket error:', event.error);
};

// Connection closed
wsClient.onClose = (event: TCloseEvent) => {
	console.log(`WebSocket connection closed: code=${event.code}, reason=${event.reason}`);
};

/*/ Optionally, close the connection after some time
setTimeout(() => {
	wsClient.close(1000, 'Closing connection after timeout');
}, 10000); // close after 10 seconds
*/


wsClient.connect();
