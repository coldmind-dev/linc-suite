/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import "reflect-metadata";
import { container }        from "tsyringe";
import { LincServer }       from "@server/linc.server";
import { ILincPlugin }      from "@plugins/linc.plugin.type";
import { TSocketEvent }     from "@shared/linc.event.types";
import { LincPlugin }       from "@decorators/@linc.plugin";
import { ILincServerEvent } from "@server/linc.server-event";
import { TCloseEvent }      from "@shared/linc.event.types";
import { TSocketError }     from "@shared/linc.event.types";
import { TMessageEvent }    from "@shared/linc.event.types";

const port = process.env.PORT || 8080;

// @ts-ignore
@LincPlugin({})
export class ChatPlugin implements ILincPlugin {
	constructor() {
		console.log("ChatPlugin :: Constructor ***");
	}

	public initialize(server?: LincServer | undefined): Promise<void> {
		return Promise.resolve(undefined);
	}

	public onClose(event: TCloseEvent): void {
		console.log("ChatPlugin :: onClose ***");
	}

	public onError(event: TSocketError): void {
		console.log("ChatPlugin :: onError ***");
	}

	public onMessage(event: TMessageEvent): void {
		console.log("ChatPlugin :: onMessage ***")
	}

	public onOpen(event: TSocketEvent): void {
		console.log("ChatPlugin :: onOpen ***");
	}

	public onServerEvent(event: ILincServerEvent): void {
		console.log("ChatPlugin :: onServerEvent ***");
	}
}

export class ExtLincServer extends LincServer {
	constructor() {
		super();
		run(port);

		console.log("ExtLincServer :: Constructor ***");
	}
}

/**
 * Starts the server.
 *
 * @returns {Promise<void>}
 */
async function run(port: any): Promise<void> {
	const portNum = parseInt(port);

	//const portRes = await attemptToBindPort(portNum, true, { startPort: 9090, endPort: 9120});
	//console.log("Port Result ::", portRes);

	const server = container.resolve<LincServer>(LincServer);

	server.usePlugin(
		{
			initialize: async (server?: LincServer) => {
				console.log("ChatPlugin :: initialize ***");
			},
			onOpen    : (event: TSocketEvent) => {
				console.log("::XREPO_ChatPlugin :: onOpen ***");
			},
			onMessage : (event: TMessageEvent) => {
				console.log("::XREPO_ChatPlugin :: onMessage ***");
			},
			onClose   : (event: TCloseEvent) => {
				console.log("::XREPO_ChatPlugin :: onClose ***");
			},
			onError   : (event: TSocketError) => {
				console.log("::XREPO_ChatPlugin :: onError ***");
			}
		});


	console.log("Plugins ::", server.plugIns);

	//const server = new ExtLincServer();

	await server.start();
}

run(port).catch(error => {
	console.log("Error starting server :::", error);
});
