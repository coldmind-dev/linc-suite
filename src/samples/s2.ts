/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import "reflect-metadata";
import { container }     from "tsyringe";
import { TSocketError }  from "../shared";
import { TCloseEvent } from "../shared";
import { TMsgEvent }   from "../shared";
import { ILincPlugin } from "../plugins/linc.plugin.type";
import { singleton }     from "tsyringe";
import { LincServer }    from "../server/linc.server";
import * as http              from "http";

const port = process.env.PORT || 8080;


/**
 * Starts the server.
 *
 * @returns {Promise<void>}
 */
async function run(port: any): Promise<void> {
	const portNum = parseInt(port);


	const hs = http.createServer();

	//const portRes = await attemptToBindPort(portNum, true, { startPort: 9090, endPort: 9120});
	//console.log("Port Result ::", portRes);

	//const server = container.resolve<LincServer>(LincServer);

	//	server.usePlugin(ChatPlugin);

	//console.log("Plugins ::", server.plugIns);

	//const server = new ExtLincServer();

//	await server.start();
}

run(port).catch(error => {
	console.log("Error starting server :::", error);
});
