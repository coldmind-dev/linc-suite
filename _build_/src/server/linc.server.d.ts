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
import WebSocket from 'ws';
import { TMiddleware } from "@middleware/middleware.type";
import { IServerConfig } from "@server/linc.server-config";
import { TLincServerEvent } from "@shared/linc.event.types";
import { TCloseEvent } from "@shared/linc.event.types";
import { TSocketError } from "@shared/linc.event.types";
import { TSocketEvent } from "@shared/linc.event.types";
import { TMsgEvent } from "@shared/linc.event.types";
import { TLincPlugin } from "@plugins/linc.plugin.type";
import { ILincServerEvent } from "@server/linc.server-event";
import { Subscription } from "@lib/cm.signal/cm.signal-hub";
export type ErrorCallback = (error: Error, recover?: boolean) => void;
export declare const DEFAULT_SETTINGS: IServerConfig;
export declare class LincServer {
    private eventHub;
    private wss;
    private middlewares;
    private plugins;
    private wssOptions;
    private connections;
    private errorCallback;
    private httpServer;
    private pingIntervalMs;
    private maxMissedPings;
    private connectionLimits;
    private maxConnectionsPerIP;
    private serverReady;
    get isReady(): boolean;
    setReady(): void;
    get plugIns(): TLincPlugin[];
    /**
     * Get the underlying HTTP server instance
     * @returns {HttpServer}
     *
    public get server(): HttpServer | undefined {
        return this?.httpServer;
    }
     */
    constructor();
    configureServer(settings: IServerConfig): Promise<this>;
    static fromConfiguration(config: IServerConfig): LincServer;
    /**
     * Start the WebSocket server and listen on the specified port
     *
     * @param {number} port
     * @returns {Promise<number>}
     */
    start(port?: number): Promise<number>;
    /**
     * Using Middleware,es offers a way to process incoming messages before they are sent to the client.
     * This can be useful for authentication, logging, or other types of processing.
     * The middleware function receives the message, a context object, and a callback function as parameters.
     *
     * @param {Middleware<T>} middleware
     * @returns {this}
     */
    use<T>(middleware: TMiddleware): this;
    usePlugin(plugin: {
        onClose: (event: TCloseEvent) => void;
        onError: (event: TSocketError) => void;
        onOpen: (event: TSocketEvent) => void;
        onMessage: (event: TMsgEvent) => void;
        initialize: (server?: LincServer) => Promise<void>;
    }): this;
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
    subscribeEvents(observer: {
        next: (event: ILincServerEvent) => void;
        error: (error: any) => void;
        complete: () => void;
    }): Subscription;
    protected emitEvent(event: ILincServerEvent): void;
    /**
     * Close the WebSocket connection with a specific close code and reason.
     * and emits an event to the server event stream
     *
     * @param {WebSocket} ws
     * @param {number} code
     * @private
     */
    private closeSocket;
    /**
     * Handles new WebSocket connections.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
     */
    private handleConnection;
    /**
     * Processes a message through the middleware chain.
     *
     * @param {MiddlewareContext} context - The initial context for processing the message.
     * @returns {Promise<void>}
     * @private
     */
    private processMessage;
    private incConnectionCount;
    private decConnectionCount;
    private isConnectionLimitReached;
    /**
     * Set an error handling callback
     *
     * @param {ErrorCallback} callback
     * @returns {this}
     * @public
     */
    setErrorCallback(callback: ErrorCallback): this;
    /**
     * Attach event listeners to the WebSocket server
     *
     * @param {TLincServerEvent} event
     * @param {(...args: any[]) => void} listener
     * @returns {this}
     * @public
     */
    on(event: TLincServerEvent, listener: (...args: any[]) => void): this;
    /**
     * Send message acknowledgement to the client
     *
     * @param msg
     * @param {ILincSocket} ws
     * @private
     */
    private msgAck;
    /**
     * Handle errors by calling the error callback or
     * logging the error to the console.
     *
     * @param {Error} error
     * @private
     */
    private handleError;
    /**
     * Set the last activity timestamp for a client and mark the client as alive.
     * Also reset the missed pings counter.
     *
     * @param {ClientInfo} clientInfo
     * @private
     */
    private setLastActivity;
    /**
     * Start the *ding*-*dong* mechanism to keep the connection alive
     *
     * @param {} ws
     * @param {ClientInfo} clientInfo
     * @private
     */
    private startDingDong;
    sendMessage(ws: WebSocket, msgType: string, data?: any): void;
}
