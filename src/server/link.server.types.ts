/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Server as HttpServer }       from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { ClientInfo }                 from "@classes/client-info";

export type TId = string | number | symbol;

export interface ILincServer {
	onLoad?(server: HttpServer): void;
	onUnload?(server: HttpServer): void;
	onConnection?(ws: WebSocket, clientInfo: ClientInfo, wss: WebSocketServer): void;
	onMessage?(ws: WebSocket, message: string, clientInfo: ClientInfo, wss: WebSocketServer): void;
	onClose?(ws: WebSocket, clientInfo: ClientInfo, wss: WebSocketServer): void;
	onError?(ws: WebSocket, error: Error, clientInfo: ClientInfo, wss: WebSocketServer): void;
}
