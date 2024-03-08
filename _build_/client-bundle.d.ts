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
interface ILincClient {
    connectClient(host: string, port: number): Promise<any>;
}
declare class LincClient extends LincSocket implements ILincClient {
    connectClient(host: string, port: number): Promise<any>;
    static fromPort(port: number): LincClient;
}
export { TMsgType, ILincMessage, LincMessage, ILincClient, LincClient, LincSocket, TLincServerEvent, TSocketEvent, TSocketError, TBlobDataType, TLincDataType, TErrorEvent, TMsgEvent, TCloseEvent, TReconnectEvent };
