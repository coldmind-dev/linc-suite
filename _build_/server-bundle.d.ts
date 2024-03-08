/// <reference types="node" />
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import * as http from "http";
import WebSocket from "ws";
import { ServerOptions } from "ws";
import { WebSocket as WebSocket$0 } from "ws";
interface ILincMessage {
    type: string;
    payload?: string | any;
    id?: string;
    ref?: string;
    noAck?: boolean;
}
/**
 * Linc Message Object
 */
declare class LincMessage implements ILincMessage {
    type: string;
    payload?: string | any;
    id?: string;
    ref?: string;
    noAck?: boolean;
    constructor(type: string, payload?: string | any, id?: string, ref?: string, noAck?: boolean);
    /**
     * Create a new LincMessage
     *
     * @param {string} type
     * @param payload
     * @param {string} id
     * @param {string} ref
     * @param {boolean} noAck
     * @returns {ILincMessage}
     */
    static create(type: string, payload?: string | any, id?: string, ref?: string, noAck?: boolean): ILincMessage;
    static serialize(): string;
    /**
     * Deserialize a JSON string to a LincMessage
     *
     * @param {string} json
     * @returns {ILincMessage}
     */
    static deserialize(json: string): ILincMessage;
}
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-07
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
interface IReconnectStrategy {
    reconnectDecay: number;
    jitter: number;
    reconnectAttempts: number;
    shouldReconnect: boolean;
    reconnectInterval: number;
    maxReconnectInterval?: number;
}
/**
 * Server Client Connection Information
 * attached to each client connection
 */
declare class ClientInfo<T = any> {
    ip: string;
    lastActivity: number;
    isAuthenticated: boolean;
    session: T | null;
    isAlive: boolean;
    missedPings: number;
    constructor(ip: string);
    updateActivity(): void;
}
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-16
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
declare class CmEventError {
    error: any;
    constructor(error: any);
}
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-06
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
declare class SocketError {
    code?: number;
    reason?: string;
    constructor(code?: number, reason?: string);
    /**
     * Create a SocketError from an Error object.
     *
     * @param {Error} error
     * @returns {SocketError}
     */
    static fromError(error: Error): SocketError;
}
//////////////////////////////////////////////////////////////////////////
//
// Event Types
//
//////////////////////////////////////////////////////////////////////////
declare enum TLincServerEvent {
    // Enumerations for different WebSocket events
    NONE = "none",
    CONNECTING = "connecting",
    CONNECTION = "connection",
    CLOSE = "close",
    ERROR = "error",
    HEADERS = "headers",
    LISTENING = "listening",
    MESSAGE = "message",
    OPEN = "open",
    UPGRADE = "upgrade",
    Ding = "ding",
    Dong = "dong",
    Ack = "ack"
}
type TSocketEvent<T = any> = {
    code?: number;
    data?: T;
    error?: TSocketError;
};
type TSocketError = SocketError | Error | any;
type TBlobDataType = string | Blob;
type TLincDataType = string | Blob | ArrayBufferLike | ArrayBufferView;
type TErrorEvent = {
    data?: TSocketError;
};
type TMsgEvent = {
    data: any;
};
type TCloseEvent = {
    code?: number;
    reason?: string;
};
type TReconnectEvent = {
    attempt?: number;
};
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-03
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
declare const TMsgType: {
    Ding: string;
    Dong: string;
    Prompt: string;
};
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
declare enum LincState {
    None = -1000,
    Connecting = 0,
    Open = 1,
    Connected = 1,
    Disconnected = -1,
    Closing = 2,
    Closed = 3,
    Terminated = 110,
    ReConnecting = 120,
    Error = 130
}
/**
 * Represents a WebSocket connection, abstracting the environment-specific details to provide
 * a consistent interface for opening connections, sending messages, and handling events in both
 * Node.js and browser environments.
 */
interface ILincSocket {
    onOpen?: () => void;
    onMessage?: (event: TMsgEvent) => void;
    onError?: (event: any) => void;
    onClose?: (event: TCloseEvent) => void;
    isOpen(): boolean;
    connect(): void;
    close(code?: number, reason?: string): void;
    state: LincState;
    send(data: TLincDataType): void;
    sendMessage(message: ILincMessage): void;
}
declare class LincSocket implements ILincSocket {
    url: string;
    protocols?: string | string[];
    private f_prevState;
    private f_state;
    private socket;
    private ws;
    private awaitingAck;
    private messageQueue;
    queueMessages: boolean;
    private ackTimeoutMs; // 10 seconds for ACK timeout
    private dingDongCounter;
    private reconnectStrategy?;
    private autoReconnect?;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private emitErrors;
    private listeners;
    //////////////////////////////////////////////////////////////////////////
    //
    // Event handlers
    //
    //////////////////////////////////////////////////////////////////////////
    onOpen?: () => void;
    onMessage?: (event: TMsgEvent) => void;
    onError?: (event: TSocketError) => void;
    onClose?: (event: TCloseEvent) => void;
    onReconnect?: (event: TReconnectEvent) => void;
    isOpen(): boolean;
    /**
     * Trigger a new reconnect event, if assigned
     *
     * @param {number} attempt
     * @param {number} maxAttempts
     * @param {number} interval
     */
    triggerReconnectEvent(attempt?: number): void;
    /**
     * Initializes a new instance of the UniversalWebSocket class.
     * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
     * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
     */
    constructor(url: string, protocols?: string | string[]);
    //
    // State
    //
    get prevState(): LincState;
    get state(): LincState;
    set state(newState: LincState);
    /**
     * Properly dispose the current WebSocket instance
     * @private
     */
    private cleanup;
    private initialize;
    /**
     * Initializes the reconnect strategy with the specified options.
     *
     * @param {IReconnectStrategy} strategy
     */
    initReconnectStrategy(strategy?: IReconnectStrategy): void;
    resetSocket(): void;
    connect(): void;
    private setupEventHandlers;
    /**
     * Sets up event listeners for the WebSocket in Node.js environment.
     * This method is called only in Node.js environment.
     */
    private setupNodeEvents;
    private triggerErrorEvent;
    /**
     * Sets up event listeners for the WebSocket in browser environments.
     * This method is called only in browser environments.
     */
    private setupBrowserEvents;
    private getReconnectStrategy;
    /**
     * Determines if a reconnection should be attempted based on the close code.
     * @param closeCode - The close code from the WebSocket close event.
     * @returns {boolean} Whether a reconnection should be attempted.
     */
    private shouldAttemptReconnect;
    private handleReconnection;
    /**
     * Calculates the delay before attempting a reconnection, applying exponential backoff and jitter.
     * @returns {number} The calculated delay in milliseconds.
     */
    private calculateReconnectDelay;
    /**
     * Handle close evenr
     * @param {TCloseEvent} eventw
     */
    handleClose(event: TCloseEvent): void;
    /**
     * Handles global WebSocket errors.
     *
     * @param {TMsgEvent} event
     */
    handleError(event: any): void;
    parseWebSocketMessage(message: any): any;
    /**
     * Handles the WebSocket message event.
     * @param event
     */
    handleMessage(event: any): void;
    /**
     * Handles the WebSocket close event.
     * @private
     */
    private handleReconnect;
    sendAwait(data: string): Promise<unknown>;
    private directSend;
    /**
     * Flushes the queued messages, sending them with an optional delay between each message. If sending a message fails,
     * it is re-queued for a later attempt. This method can control the rate at which messages are sent.
     *
     * @param {number} [delayMs=0] - The delay in milliseconds to wait after sending each message.
     * @returns {Promise<void>} A promise that resolves when all queued messages have been attempted to be sent.
     */
    /**
     * Attempts to flush the message queue, sending all queued messages with a delay between each send.
     * Utilizes recursive processing to manage delays and message sending more effectively.
     * @param {number} delayMs - The delay in milliseconds between sending messages.
     */
    flushQueue(delayMs?: number): Promise<void>;
    /**
     * Gets the current state of the WebSocket connection.
     * @returns {number} The current state of the WebSocket connection.
     */
    get readyState(): number;
    /**
     * Sends data through the WebSocket connection.
     * @param {TLincDataType} data - The data to send through the WebSocket connection.
     * @param dataType
     */
    send(data: any): Promise<any>;
    sendNewMessage(type: string, payload: any): void;
    sendMessage(payload: ILincMessage): void;
    sendMsgDong(): void;
    /**
     * Closes the WebSocket connection or connection attempt, if any.
     * If the connection is already CLOSED, this method does nothing.
     * @param {number} [code=1000] - A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} [reason=""] - A human-readable string explaining why the connection is closing.
     */
    close(code?: number, reason?: string): void;
    //////////////////////////////////////////////////////////////////////////
    //
    // Event handlers
    //
    //////////////////////////////////////////////////////////////////////////
    addEventListener(eventType: string, listener: (...args: any[]) => void): void;
    removeEventListener(eventType: string, listener: (...args: any[]) => void): void;
    dispatchEvent(eventType: string, event: any): void;
}
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-04
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
declare class Logger {
    private static instance;
    private constructor();
    info(...args: any[]): this;
    warn(...args: any[]): this;
    error(...args: any[]): this;
    debug(...args: any[]): this;
    /**
     * Get the instance of the Logger
     *
     * @returns {Logger}
     */
    static getInstance(): Logger;
}
declare const log: Logger;
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
declare enum WebSocketCloseCode {
    NormalClosure = 1000,
    GoingAway = 1001,
    ProtocolError = 1002,
    UnsupportedData = 1003,
    NoStatusReceived = 1005,
    AbnormalClosure = 1006,
    InvalidFramePayloadData = 1007,
    PolicyViolation = 1008,
    MessageTooBig = 1009,
    MissingExtension = 1010,
    InternalServerError = 1011,
    TLSHandshake = 1015,
    // Custom close codes (3000-3999 range is reserved for use by libraries, frameworks, and applications)
    ConnectionLost = 3000,
    ReconnectTimedOut = 3001,
    CustomCode1 = 3002,
    // Reserved for future use
    CustomCode2 = 3003,
    // Reserved for future use
    CustomCode3 = 3004,
    // Reserved for future use
    CustomCode4 = 3005 // Reserved for future use
}
//
// Add a property to customize non-reconnectable close codes
//
declare const nonReConnectableCodes: Set<number>;
/**
 * Generates a unique message ID using the uuid library.
 * @returns {string} A unique message ID.
 */
declare function newMsgId(): string;
/**
 * Convert an object to its string representation
 
 * @param {T} obj
 * @returns {string}
 */
declare function toJson<T extends object>(obj: T): string;
/**
 * Convert a JSON formatted string into a solid object
 
 * @param {string} jsonString
 * @returns {T | null}
 */
declare function fromJson<T = any>(jsonString: string): T;
interface ILincClient {
    connectClient(host: string, port: number): Promise<any>;
}
declare class LincClient extends LincSocket implements ILincClient {
    connectClient(host: string, port: number): Promise<any>;
    static fromPort(port: number): LincClient;
}
type HttpServer = http.Server;
interface IPortRange {
    startPort: number;
    endPort: number;
}
type TServerPort = number | IPortRange | undefined;
interface IServerConfig {
    bindAddress?: string;
    options?: ServerOptions;
    httpServer?: HttpServer;
    port?: TServerPort;
    httpServerInstance?: HttpServer;
    pingIntervalMs?: number;
    maxMissedPings?: number;
}
type TServerConfig = IServerConfig;
/**
 * Middleware context definition, providing necessary information
 * and utilities to middleware functions.
 *
 * @typedef {Object} MiddlewareContext
 * @property {WebSocket} ws - The WebSocket connection.
 * @property {http.IncomingMessage} req - The HTTP request that initiated the WebSocket connection.
 * @property {any} data - The message data to be processed by the middleware.
 * @property {Record<string, any>} userContext - A user-defined context for passing data through the middleware chain.
 */
interface IMiddlewareContext<T = any> {
    ws: WebSocket$0;
    req: http.IncomingMessage;
    data: T | undefined;
    params: Record<string, any>;
}
declare class MiddlewareContext<T = any> implements IMiddlewareContext<T> {
    ws: WebSocket$0;
    req: http.IncomingMessage;
    data: T | undefined;
    params: Record<string, any>;
    constructor(ws: WebSocket$0, req: http.IncomingMessage, data: T | undefined, params: Record<string, any>);
}
declare enum MiddlewareErrorType {
    Client = "client",
    Server = "server"
}
/**
 * Middleware error type for handling errors within the middleware chain.
 * @typedef {Object} MiddlewareError
 * @property {'client' | 'server'} type - The type of error (client or server).
 * @property {string} message - The error message.
 * @property {number} [statusCode] - Optional WebSocket close code.
 */
interface IMiddlewareError {
    type: MiddlewareErrorType;
    ctx?: IMiddlewareContext;
    message?: string;
    statusCode?: number;
    error?: Error | any | undefined;
}
declare class MiddlewareError implements IMiddlewareError {
    type: MiddlewareErrorType;
    ctx?: IMiddlewareContext;
    message?: string;
    statusCode?: number;
    error?: Error | any | undefined;
    constructor(type: MiddlewareErrorType, ctx?: IMiddlewareContext, message?: string, statusCode?: number, error?: Error | any | undefined);
    /**
     * Constructs a new MiddlewareError instance from an error object
     */
    static fromError(error: Error | any, ctx?: IMiddlewareContext, type?: MiddlewareErrorType): IMiddlewareError;
}
/**
 * Type definition for the next function in the middleware chain.
 * @callback NextFunction
 * @param {MiddlewareError | null} error - An error object if an error occurred, or null to continue processing.
 * @param {MiddlewareContext} [context] - The middleware context, potentially modified by the middleware.
 */
type TNextFunc = (error?: IMiddlewareError | null, context?: IMiddlewareContext) => Promise<void> | void;
/**
 * Type definition for middleware functions.
 * @callback Middleware
 * @param {MiddlewareContext} context - The context for the middleware function.
 * @param {NextFunction} next - The callback to trigger the next middleware in the chain.
 */
type TMiddleware = (context: IMiddlewareContext, next: TNextFunc) => void;
interface ILincPlugin {
    initialize: (server?: LincServer) => Promise<void>;
}
type TLincPlugin = ILincPlugin;
type TId = string | number | symbol;
interface ILincServerEvent<T = any> {
    type: TId;
    payload: T;
}
/**
 * Data model for server events
 */
declare class LincServerEvent<T = any> implements ILincServerEvent {
    type: TId;
    payload: T;
    constructor(type: TId, payload: any);
    static fromCode(event: TId, payload?: any): LincServerEvent;
    static fromError(error: Error): ILincServerEvent<any>;
}
/**
 * Interface for subscription objects returned by the subscribe method.
 * @interface Subscription
 */
interface Subscription {
    /**
     * Unsubscribes from the subject to stop receiving notifications.
     */
    unsubscribe: () => void;
}
type ErrorCallback$0 = (error: Error, recover?: boolean) => void;
declare class LincServer {
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
    setErrorCallback(callback: ErrorCallback$0): this;
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
type TMiddlewareFunc = (ctx: IMiddlewareContext, next: TNextFunc) => Promise<IMiddlewareContext>;
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-09
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
declare enum MiddlewareStatus {
    Unknown = -1,
    Success = 0,
    Failure = 1,
    NoAction = 2,
    Pending = 3
}
type TMiddlewareStatus = MiddlewareStatus | number;
export { LincSocket, log, nonReConnectableCodes, newMsgId, WebSocketCloseCode, TLincServerEvent, TSocketEvent, TSocketError, TBlobDataType, TLincDataType, TErrorEvent, TMsgEvent, TCloseEvent, TReconnectEvent, toJson, fromJson, TMsgType, ILincMessage, LincMessage, ILincClient, LincClient, TServerConfig, LincServer, LincServerEvent, ClientInfo, CmEventError, SocketError, TMiddleware, TMiddlewareFunc, MiddlewareContext, TNextFunc, TMiddlewareStatus, MiddlewareError };
