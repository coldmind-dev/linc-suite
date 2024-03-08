import { TCloseEvent } from "../../shared";

/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ILincPlugin }      from "../../plugins/linc.plugin.type";
import { LincPlugin }       from "../../decorators/@linc.plugin";
import { ILincServerEvent } from "../../server/linc.server-event";
import { LincServer }       from "../../server";

@LincPlugin({
	name: "ChatPlugin",
	version: "1.0.0"

		})
export class ChatPlugin implements ILincPlugin {
	async initialize(server: LincServer): Promise<void> {

		//server.log.debug("Initializing ChatPlugin");

		console.log("ChatPlugin :: Initializing ChatPlugin ***");

		/*
		server.on((...args:any[]) => {

		});
		*/

		// Example of subscribing to a chat event signal hub
		//const chatEventHub: CMSignalHub<ILincServerEvent> = server.subscribeEvents("chat");
	}
			/*chatEventHub.subscribe({
								   next: (event) => this.onChatEvent(event),
								   error: (error) => console.error("ChatPlugin Error:", error),
								   complete: () => console.log("ChatPlugin: Event stream completed")
							   });
			 */

	private onChatEvent(event: ILincServerEvent): void {
			console.log("ChatPlugin :: New chat event ::", event);
			// Handle the chat event
		}
}
