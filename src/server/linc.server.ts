/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
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

import "reflect-metadata";
import * as http                     from 'http';
import WebSocket                     from 'ws';
import { Server as WebSocketServer } from 'ws';
import { ServerOptions }             from "ws";
import { HttpServer }                from "@CmTypes/linc.common.types";
import { LincMessage }               from "@msg/linc.message";
import { ILincMessage }              from "@msg/linc.message";
import { ClientInfo }                from "@classes/client-info";
import { log }                       from "@shared/linc.logger";
import { toJson }                    from "@shared/helpers/json-parser.helper";
import { fromJson }                  from "@shared/helpers/json-parser.helper";
import { TMiddleware }               from "@middleware/middleware.type";
import { IMiddlewareContext }        from "@middleware/middleware-context";
import { getServerSettings }         from "@server/linc.server-config";
import { IServerConfig }             from "@server/linc.server-config";
import { TServerConfig }             from "@server/linc.server-config";
import { MiddlewareError }           from "@middleware/middleware-error";
import { MiddlewareErrorType }       from "@middleware/middleware-error";
import { TLincServerEvent }          from "@shared/linc.event.types";
import { TCloseEvent }               from "@shared/linc.event.types";
import { TSocketError }      from "@shared/linc.event.types";
import { TSocketEvent }      from "@shared/linc.event.types";
import { TMsgEvent }         from "@shared/linc.event.types";
import { TServerPort }       from "@server/linc.property.types";
import { TLincPlugin }       from "@plugins/linc.plugin.type";
import { LincPluginManager } from "@plugins/linc.plugin-manager";
import { ILincServerEvent }  from "@server/linc.server-event";
import { LincEventType }     from "@server/linc.server-event";
import { LincEventName }     from "@server/linc.server-event";
import { LincServerEvent }   from "@server/linc.server-event";
import { ServerApp }         from "@CmTypes/linc.di.types";
import { CMSignalHub }       from "@lib/cm.signal/cm.signal-hub";
import { Subscription }      from "@lib/cm.signal/cm.signal-hub";

export type ErrorCallback = (error: Error, recover?: boolean) => void;

export const DEFAULT_SETTINGS: IServerConfig = {
	port          : 8080,
	pingIntervalMs: 36000,
	maxMissedPings: 3
}

const serverStartEvent = (port: TServerPort): void => {
	log.info(`Server is listening on port ::`, port);
}

@ServerApp()
export class LincServer {
	private eventHub = new CMSignalHub<ILincServerEvent>();

	private wss: WebSocketServer;
	private middlewares: TMiddleware[];
	private plugins: TLincPlugin[];
	private wssOptions: ServerOptions;
	private connections: Map<WebSocket, ClientInfo>;
	private errorCallback: ErrorCallback | undefined;
	private httpServer: HttpServer;
	private pingIntervalMs: number;
	private maxMissedPings: number;
	private connectionLimits: Map<string, number>;
	private maxConnectionsPerIP: number;

	private serverReady: boolean = false;

	public get isReady(): boolean {
		return this.serverReady;
	}

	public setReady() {
		this.serverReady = true;
	}

	public get plugIns(): TLincPlugin[] {
		return this.plugins;
	}

	/**
	 * Get the underlying HTTP server instance
	 * @returns {HttpServer}
	 *
	public get server(): HttpServer | undefined {
		return this?.httpServer;
	}
	 */

	constructor() {
		this.middlewares = [];
		this.plugins     = [];

		this.connections = new Map();

		this.wssOptions = {
			//noServer: true,
			clientTracking: false,
		}

		let config: TServerConfig = getServerSettings<IServerConfig>(this) ?? DEFAULT_SETTINGS;
		this.httpServer           = config?.httpServer || http.createServer();

		this.wss = new WebSocketServer({ ...this.wssOptions, server: this.httpServer });
		this.wss.on(TLincServerEvent.CONNECTION, this.handleConnection.bind(this));

		this.pingIntervalMs      = config.pingIntervalMs;
		this.maxMissedPings      = config.maxMissedPings;
		this.connectionLimits    = new Map();
		this.maxConnectionsPerIP = 5;

		this.configureServer(config);
	}

	async configureServer(settings: IServerConfig): Promise<this> {
		try {
			const pluginManager = new LincPluginManager(this);
			await pluginManager.initPlugins();

			this.setReady();
		}
		catch (err) {
			log.error('Error in configureServer ::', err);
		}

		return this;
	}

	static fromConfiguration(config: IServerConfig): LincServer {
		throw new Error("Method not implemented.");
	}

	/**
	 * Start the WebSocket server and listen on the specified port
	 *
	 * @param {number} port
	 * @returns {Promise<number>}
	 */
	public start(port: number = 8080): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			try {
				this.httpServer.listen(port, () => {
					log.info(`Server is listening on port ${ port }`);
					serverStartEvent(port);
				});
			}
			catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * Using Middleware,es offers a way to process incoming messages before they are sent to the client.
	 * This can be useful for authentication, logging, or other types of processing.
	 * The middleware function receives the message, a context object, and a callback function as parameters.
	 *
	 * @param {Middleware<T>} middleware
	 * @returns {this}
	 */
	public use<T>(middleware: TMiddleware): this {
		this.middlewares.push(middleware);
		return this;
	}

	public usePlugin(plugin: { onClose: (event: TCloseEvent) => void; onError: (event: TSocketError) => void; onOpen: (event: TSocketEvent) => void; onMessage: (event: TMsgEvent) => void; initialize: (server?: LincServer) => Promise<void> }): this {
		this.plugins.push(plugin);
		return this;
	}

	/**
	 * Subscribes to events from the event hub with specified handlers for next event, error, and completion.
	 *
	 * @param observer An object containing handler functions for next, error, and completion events.
	 *                 - `next`: Function to handle the next event emitted by the event hub.
	 *                 - `error`: Function to handle any error that occurs in the event stream.
	 *                 - `complete`: Function to handle the completion of the event stream.
	 * @returns {Subscription} A subscription object that can be used to unsubscribe from the events.
	 *
	 * @example
	 * const eventSubscription = subscribeEvents({
	 *   next: (event) => console.log(`Event received: `, event),
	 *   error: (error) => console.error(`Error occurred: `, error),
	 *   complete: () => console.log(`Event stream completed`)
	 * });
	 *
	 * // Later, to unsubscribe from the events
	 * eventSubscription.unsubscribe();
	 */
	public subscribeEvents(
		observer: {
			next: (event: ILincServerEvent) => void;
			error: (error: any) => void;
			complete: () => void
		}
	): Subscription {
		return this.eventHub.subscribe(observer.next, observer.error, observer.complete);
	}

	protected emitEvent(event: ILincServerEvent) {
		this.eventHub.next(event);
	}

	/**
	 * Close the WebSocket connection with a specific close code and reason.
	 * and emits an event to the server event stream
	 *
	 * @param {WebSocket} ws
	 * @param {number} code
	 * @private
	 */

	private closeSocket(ws: WebSocket, code: number) {
		ws.close(code, LincEventName(code));
		this.emitEvent(LincServerEvent.fromCode(code, ws));
	}

	/**
	 * Handles new WebSocket connections.
	 * @param {WebSocket} ws - The WebSocket connection.
	 * @param {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
	 */
	private handleConnection(ws: WebSocket, req: http.IncomingMessage): void {
		const ip = req.socket.remoteAddress || '';

		/*if (this.isConnectionLimitReached(ip)) {
		 log.warn(`Connection limit reached for IP: ${ ip }`);
		 this.closeSocket(ws, LincEventType.ConnectionLimitReached)
		 return;
		 }*/

		const clientInfo = new ClientInfo(ip);
		this.connections.set(ws, clientInfo);
		this.incConnectionCount(clientInfo.ip);

		log.info('<-- New WebSocket Client :: connection :: ', clientInfo.ip)

		//
		// Handle incoming messages with safe JSON parsing
		//
		ws.on(TLincServerEvent.MESSAGE, (message: string) => {
			try {
				const parsedMessage = fromJson<ILincMessage>(message);

				this.msgAck(parsedMessage, ws);

				log.info('Received message from client:', parsedMessage);

				//
				// Handle ding responses to manage client heartbeat
				//
				if (parsedMessage.type === TLincServerEvent.Dong) {
					log.info("Server :: Heartbeat Response (*DING* --> <== *DONG*) received from Client");
					const client = this.connections.get(ws);
					if (client) {
						client.lastActivity = new Date().getTime();
						client.isAlive      = true;
						client.missedPings  = 0;
					}

					return;
				}

				//
				// Assemble context
				//
				const context: IMiddlewareContext<any> = {
					ws,
					req,
					data  : message,
					params: {},
				}

				this.processMessage(context);
			}
			catch (error: any) {
				this.handleError(error);

				//
				// Close the connection with specific close code
				//
				this.closeSocket(ws, LincEventType.InvalidMessageFormat)
			}
		});

		//
		// Cleanup on WebSocket close event
		//
		ws.on(TLincServerEvent.CLOSE, () => {
			this.connections.delete(ws); // Remove client from connections map
			log.info('WebSocket connection closed');
		});

		this.wss.on(TLincServerEvent.ERROR, (error: Error) => {
			this.handleError(error);
		});

		//
		// Start the heartbeat mechanism for this connection
		//
		this.startDingDong(ws, clientInfo);
	}

	/**
	 * Processes a message through the middleware chain.
	 *
	 * @param {MiddlewareContext} context - The initial context for processing the message.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async processMessage(context: IMiddlewareContext): Promise<void> {
		const processMiddleware = async (index: number, ctx: IMiddlewareContext) => {
			if (index === this.middlewares.length) {
				// End of middleware chain; send the processed context
				return ctx;
			}
			try {
				await new Promise<void>((resolve, reject) => {
					const middleware: TMiddleware = this.middlewares[ index ];

					middleware(ctx, (err: any, newCtx: any) => {

						//this.middlewares[ index ](ctx, (err: IMiddlewareError, newCtx: IMiddlewareContext) => {
						if (err) {
							const middlewareError = new MiddlewareError(
								MiddlewareErrorType.Server,
								ctx,
								err?.message,
								err.statusCode
							);

							middlewareError.error = err;
							reject(middlewareError);
							return;
						}

						resolve();
						processMiddleware(index + 1, newCtx || ctx);
					});
				});
			}
			catch (error) {
				log.error('Middleware error:', error);
				ctx.ws.close(1011, 'Processing error');
			}
		};

		await processMiddleware(0, context);
	}

	private incConnectionCount(ip: string) {
		const currentCount = this.connectionLimits.get(ip) || 0;
		this.connectionLimits.set(ip, currentCount + 1);
	}

	private decConnectionCount(ip: string) {
		const currentCount = this.connectionLimits.get(ip) || 1;
		this.connectionLimits.set(ip, Math.max(0, currentCount - 1));
	}

	private isConnectionLimitReached(ip: string): boolean {
		const currentCount = this.connectionLimits.get(ip) || 0;
		return currentCount >= this.maxConnectionsPerIP;
	}

	/**
	 * Set an error handling callback
	 *
	 * @param {ErrorCallback} callback
	 * @returns {this}
	 * @public
	 */
	public setErrorCallback(callback: ErrorCallback) {
		this.errorCallback = callback;
		return this;
	}

	/**
	 * Attach event listeners to the WebSocket server
	 *
	 * @param {TLincServerEvent} event
	 * @param {(...args: any[]) => void} listener
	 * @returns {this}
	 * @public
	 */
	public on(event: TLincServerEvent, listener: (...args: any[]) => void) {
		this.wss.on(event, listener);
		return this;
	}

	/**
	 * Send message acknowledgement to the client
	 *
	 * @param msg
	 * @param {ILincSocket} ws
	 * @private
	 */
	private msgAck(msg: ILincMessage, ws: WebSocket) {
		if (msg?.id) {
			// Construct an ACK message
			const ackMessage = new LincMessage(
				TLincServerEvent.Ack,
				msg.id
			);

			// Send ACK back to the client
			ws.send(toJson(ackMessage));
		}
	}

	/**
	 * Handle errors by calling the error callback or
	 * logging the error to the console.
	 *
	 * @param {Error} error
	 * @private
	 */
	private handleError(error: Error): void {
		if (this.errorCallback) {
			this.errorCallback(error, true);
		}

		this.eventHub.error(error);
	}

	/**
	 * Set the last activity timestamp for a client and mark the client as alive.
	 * Also reset the missed pings counter.
	 *
	 * @param {ClientInfo} clientInfo
	 * @private
	 */
	private setLastActivity(clientInfo: ClientInfo) {
		clientInfo.lastActivity = new Date().getTime();
		clientInfo.isAlive      = true;
		clientInfo.missedPings  = 0;
	}

	/**
	 * Start the *ding*-*dong* mechanism to keep the connection alive
	 *
	 * @param {} ws
	 * @param {ClientInfo} clientInfo
	 * @private
	 */
	private startDingDong(ws: WebSocket, clientInfo: ClientInfo) {
		log.info("startDingDong :: this.pingIntervalMs ::", this.pingIntervalMs);

		const heartbeatFrequency = setInterval(() => {
			log.info("heartbeatFrequency :: Active ::", clientInfo.isAlive);

			if (clientInfo.missedPings >= this.maxMissedPings) {
				clientInfo.isAlive = false;
				log.info('Terminating inactive WebSocket connection');

				this.closeSocket(ws, LincEventType.ClosedDueToInactivity);

				ws.terminate();
				return;
			}

			clientInfo.missedPings++;

			this.sendMessage(ws, TLincServerEvent.Ding);

		}, this.pingIntervalMs);

		//
		// Cleanup interval on WebSocket close
		//
		ws.on(TLincServerEvent.CLOSE, () => {
			clearInterval(heartbeatFrequency);
		});
	}

	sendMessage(ws: WebSocket, msgType: string, data?: any) {
		ws.send(toJson(new LincMessage(msgType, data)));
	}
}
