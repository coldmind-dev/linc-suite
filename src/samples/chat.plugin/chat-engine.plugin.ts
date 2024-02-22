import { TCloseEvent } from "../../shared";

23/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ILincPlugin } from "../../plugins/linc.plugin.type";
import { LincPlugin }  from "../../@decorators/@linc.plugin";
import { LincServer }  from "../../server/linc.server";
import { TSocketError }     from "../../shared";
import { TMessageEvent }    from "../../shared";
import { TSocketEvent }     from "../../shared/linc.event.types";
import { ILincServerEvent } from "../../server/linc.server-event";
import { CMSignalHub }      from "../../lib/cm.signal/cm.signal-hub";
import { debug }            from "util";

@LincPlugin({
	name: "ChatPlugin",
	version: "1.0.0"

		})
export class ChatPlugin implements ILincPlugin {
	async initialize(server: LincServer): Promise<void> {
			log.debug("Initializing ChatPlugin");

			// Example of subscribing to a chat event signal hub
			const chatEventHub: CMSignalHub<ILincServerEvent> = server.getChatEventHub();

		chatEventHub.subscribe({
								   next: (event) => this.onChatEvent(event),
								   error: (error) => console.error("ChatPlugin Error:", error),
								   complete: () => console.log("ChatPlugin: Event stream completed")
							   });
	}

	private onChatEvent(event: ILincServerEvent): void {
			console.log("ChatPlugin :: New chat event ::", event);
			// Handle the chat event
		}
}
