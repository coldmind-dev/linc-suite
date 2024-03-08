"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincServer = exports.DEFAULT_SETTINGS = void 0;
require("reflect-metadata");
const http = __importStar(require("http"));
const ws_1 = require("ws");
const linc_message_1 = require("@msg/linc.message");
const client_info_1 = require("@classes/client-info");
const linc_logger_1 = require("@shared/linc.logger");
const json_parser_helper_1 = require("@shared/helpers/json-parser.helper");
const json_parser_helper_2 = require("@shared/helpers/json-parser.helper");
const linc_server_config_1 = require("@server/linc.server-config");
const middleware_error_1 = require("@middleware/middleware-error");
const middleware_error_2 = require("@middleware/middleware-error");
const linc_event_types_1 = require("@shared/linc.event.types");
const linc_plugin_manager_1 = require("@plugins/linc.plugin-manager");
const linc_server_event_1 = require("@server/linc.server-event");
const linc_server_event_2 = require("@server/linc.server-event");
const linc_server_event_3 = require("@server/linc.server-event");
const linc_di_types_1 = require("@root/types/linc.di.types");
const cm_signal_hub_1 = require("@lib/src/cm.signal/cm.signal-hub");
exports.DEFAULT_SETTINGS = {
    port: 8080,
    pingIntervalMs: 36000,
    maxMissedPings: 3
};
const serverStartEvent = (port) => {
    linc_logger_1.log.info(`Server is listening on port ::`, port);
};
let LincServer = class LincServer {
    /**
     * Get the underlying HTTP server instance
     * @returns {HttpServer}
     *
    public get server(): HttpServer | undefined {
        return this?.httpServer;
    }
     */
    constructor() {
        this.eventHub = new cm_signal_hub_1.CMSignalHub();
        this.serverReady = false;
        this.middlewares = [];
        this.plugins = [];
        this.connections = new Map();
        this.wssOptions = {
            //noServer: true,
            clientTracking: false,
        };
        let config = (0, linc_server_config_1.getServerSettings)(this) ?? exports.DEFAULT_SETTINGS;
        this.httpServer = config?.httpServer || http.createServer();
        this.wss = new ws_1.Server({ ...this.wssOptions, server: this.httpServer });
        this.wss.on(linc_event_types_1.TLincServerEvent.CONNECTION, this.handleConnection.bind(this));
        this.pingIntervalMs = config.pingIntervalMs;
        this.maxMissedPings = config.maxMissedPings;
        this.connectionLimits = new Map();
        this.maxConnectionsPerIP = 5;
        this.configureServer(config);
    }
    get isReady() {
        return this.serverReady;
    }
    setReady() {
        this.serverReady = true;
    }
    get plugIns() {
        return this.plugins;
    }
    async configureServer(settings) {
        try {
            const pluginManager = new linc_plugin_manager_1.LincPluginManager(this);
            await pluginManager.initPlugins();
            this.setReady();
        }
        catch (err) {
            linc_logger_1.log.error('Error in configureServer ::', err);
        }
        return this;
    }
    static fromConfiguration(config) {
        throw new Error("Method not implemented.");
    }
    /**
     * Start the WebSocket server and listen on the specified port
     *
     * @param {number} port
     * @returns {Promise<number>}
     */
    start(port = 8080) {
        return new Promise((resolve, reject) => {
            try {
                this.httpServer.listen(port, () => {
                    linc_logger_1.log.info(`Server is listening on port ${port}`);
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
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    usePlugin(plugin) {
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
    subscribeEvents(observer) {
        return this.eventHub.subscribe(observer.next, observer.error, observer.complete);
    }
    emitEvent(event) {
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
    closeSocket(ws, code) {
        ws.close(code, (0, linc_server_event_2.LincEventName)(code));
        this.emitEvent(linc_server_event_3.LincServerEvent.fromCode(code, ws));
    }
    /**
     * Handles new WebSocket connections.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
     */
    handleConnection(ws, req) {
        const ip = req.socket.remoteAddress || '';
        /*if (this.isConnectionLimitReached(ip)) {
         log.warn(`Connection limit reached for IP: ${ ip }`);
         this.closeSocket(ws, LincEventType.ConnectionLimitReached)
         return;
         }*/
        const clientInfo = new client_info_1.ClientInfo(ip);
        this.connections.set(ws, clientInfo);
        this.incConnectionCount(clientInfo.ip);
        linc_logger_1.log.info('<-- New WebSocket Client :: connection :: ', clientInfo.ip);
        //
        // Handle incoming messages with safe JSON parsing
        //
        ws.on(linc_event_types_1.TLincServerEvent.MESSAGE, (message) => {
            try {
                const parsedMessage = (0, json_parser_helper_2.fromJson)(message);
                this.msgAck(parsedMessage, ws);
                linc_logger_1.log.info('Received message from client:', parsedMessage);
                //
                // Handle ding responses to manage client heartbeat
                //
                if (parsedMessage.type === linc_event_types_1.TLincServerEvent.Dong) {
                    linc_logger_1.log.info("Server :: Heartbeat Response (*DING* --> <== *DONG*) received from Client");
                    const client = this.connections.get(ws);
                    if (client) {
                        client.lastActivity = new Date().getTime();
                        client.isAlive = true;
                        client.missedPings = 0;
                    }
                    return;
                }
                //
                // Assemble context
                //
                const context = {
                    ws,
                    req,
                    data: message,
                    params: {},
                };
                this.processMessage(context);
            }
            catch (error) {
                this.handleError(error);
                //
                // Close the connection with specific close code
                //
                this.closeSocket(ws, linc_server_event_1.LincEventType.InvalidMessageFormat);
            }
        });
        //
        // Cleanup on WebSocket close event
        //
        ws.on(linc_event_types_1.TLincServerEvent.CLOSE, () => {
            this.connections.delete(ws); // Remove client from connections map
            linc_logger_1.log.info('WebSocket connection closed');
        });
        this.wss.on(linc_event_types_1.TLincServerEvent.ERROR, (error) => {
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
    async processMessage(context) {
        const processMiddleware = async (index, ctx) => {
            if (index === this.middlewares.length) {
                // End of middleware chain; send the processed context
                return ctx;
            }
            try {
                await new Promise((resolve, reject) => {
                    const middleware = this.middlewares[index];
                    middleware(ctx, (err, newCtx) => {
                        //this.middlewares[ index ](ctx, (err: IMiddlewareError, newCtx: IMiddlewareContext) => {
                        if (err) {
                            const middlewareError = new middleware_error_1.MiddlewareError(middleware_error_2.MiddlewareErrorType.Server, ctx, err?.message, err.statusCode);
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
                linc_logger_1.log.error('Middleware error:', error);
                ctx.ws.close(1011, 'Processing error');
            }
        };
        await processMiddleware(0, context);
    }
    incConnectionCount(ip) {
        const currentCount = this.connectionLimits.get(ip) || 0;
        this.connectionLimits.set(ip, currentCount + 1);
    }
    decConnectionCount(ip) {
        const currentCount = this.connectionLimits.get(ip) || 1;
        this.connectionLimits.set(ip, Math.max(0, currentCount - 1));
    }
    isConnectionLimitReached(ip) {
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
    setErrorCallback(callback) {
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
    on(event, listener) {
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
    msgAck(msg, ws) {
        if (msg?.id) {
            // Construct an ACK message
            const ackMessage = new linc_message_1.LincMessage(linc_event_types_1.TLincServerEvent.Ack, msg.id);
            // Send ACK back to the client
            ws.send((0, json_parser_helper_1.toJson)(ackMessage));
        }
    }
    /**
     * Handle errors by calling the error callback or
     * logging the error to the console.
     *
     * @param {Error} error
     * @private
     */
    handleError(error) {
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
    setLastActivity(clientInfo) {
        clientInfo.lastActivity = new Date().getTime();
        clientInfo.isAlive = true;
        clientInfo.missedPings = 0;
    }
    /**
     * Start the *ding*-*dong* mechanism to keep the connection alive
     *
     * @param {} ws
     * @param {ClientInfo} clientInfo
     * @private
     */
    startDingDong(ws, clientInfo) {
        linc_logger_1.log.info("startDingDong :: this.pingIntervalMs ::", this.pingIntervalMs);
        const heartbeatFrequency = setInterval(() => {
            linc_logger_1.log.info("heartbeatFrequency :: Active ::", clientInfo.isAlive);
            if (clientInfo.missedPings >= this.maxMissedPings) {
                clientInfo.isAlive = false;
                linc_logger_1.log.info('Terminating inactive WebSocket connection');
                this.closeSocket(ws, linc_server_event_1.LincEventType.ClosedDueToInactivity);
                ws.terminate();
                return;
            }
            clientInfo.missedPings++;
            this.sendMessage(ws, linc_event_types_1.TLincServerEvent.Ding);
        }, this.pingIntervalMs);
        //
        // Cleanup interval on WebSocket close
        //
        ws.on(linc_event_types_1.TLincServerEvent.CLOSE, () => {
            clearInterval(heartbeatFrequency);
        });
    }
    sendMessage(ws, msgType, data) {
        ws.send((0, json_parser_helper_1.toJson)(new linc_message_1.LincMessage(msgType, data)));
    }
};
LincServer = __decorate([
    (0, linc_di_types_1.ServerApp)(),
    __metadata("design:paramtypes", [])
], LincServer);
exports.LincServer = LincServer;
