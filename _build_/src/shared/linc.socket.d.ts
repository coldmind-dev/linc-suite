/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { ILincMessage } from "@msg/linc.message";
import { IReconnectStrategy } from "@client/linc.reconnect-strategy";
import { TCloseEvent } from "@shared/linc.event.types";
import { TReconnectEvent } from "@shared/linc.event.types";
import { TMsgEvent } from "@shared/linc.event.types";
import { TSocketError } from "@shared/linc.event.types";
import { ILincSocket } from "@shared/linc.socket.type";
import { LincState } from "@CmTypes/linc.state.types";
export interface IQueuedMessage {
    data: string;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}
export type ILincMsgId = string;
export type TMessageAck = {
    resolve: Function;
    reject: Function;
};
export declare class LincSocket implements ILincSocket {
    url?: string;
    protocols?: string | string[];
    private f_prevState;
    private f_state;
    private socket;
    private ws;
    private awaitingAck;
    private messageQueue;
    queueMessages: boolean;
    private ackTimeoutMs;
    private dingDongCounter;
    private reconnectStrategy?;
    private autoReconnect?;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private emitErrors;
    private listeners;
    /**
     * Initializes a new instance of the UniversalWebSocket class.
     * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
     * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
     */
    constructor(url?: string, protocols?: string | string[]);
    o: any;
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
    addEventListener(eventType: string, listener: (...args: any[]) => void): void;
    removeEventListener(eventType: string, listener: (...args: any[]) => void): void;
    dispatchEvent(eventType: string, event: any): void;
}
