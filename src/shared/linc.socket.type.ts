/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
 */

import { TMessageEvent } from "@shared/linc.event.types";
import { TCloseEvent }   from "@shared/linc.event.types";
import { TLincDataType } from "@shared/linc.event.types";
import { ILincMessage }  from "@root/messages";

/**
 * Represents a WebSocket connection, abstracting the environment-specific details to provide
 * a consistent interface for opening connections, sending messages, and handling events in both
 * Node.js and browser environments.
 */
export interface ILincSocket {
	onOpen?: () => void;
	onMessage?: (event: TMessageEvent) => void;
	onError?: (event: any) => void;
	onClose?: (event: TCloseEvent) => void;

	connect(): void;
	close(code?: number, reason?: string): void;

	state: number;

	send(data: TLincDataType): void;
	sendMessage(message: ILincMessage): void;
}
