"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincSocket = exports.QueuedMessage = void 0;
const linc_message_1 = require("@msg/linc.message");
const linc_logger_1 = require("@shared/linc.logger");
const linc_message_utils_1 = require("@shared/linc.message.utils");
const linc_reconnect_strategy_1 = require("@client/linc.reconnect-strategy");
const line_socket_close_codes_1 = require("@shared/line.socket-close-codes");
const line_socket_close_codes_2 = require("@shared/line.socket-close-codes");
const linc_event_types_1 = require("@shared/linc.event.types");
const cm_array_1 = require("@lib/cm.common/cm.array");
const linc_global_1 = require("@root/linc.global");
const linc_state_types_1 = require("@root/types/linc.state.types");
/**
 * Represents a message that is queued for sending
 */
class QueuedMessage {
    constructor(data, resolve, reject) {
        this.data = data;
        this.resolve = resolve;
        this.reject = reject;
    }
    /**
     * Creates a new QueuedMessage instance from a Promise, using the specified data and promise.
     *
     * @param {string} data
     * @param {Promise<any>} promise
     * @returns {QueuedMessage}
     */
    static fromPromise(data, promise) {
        return new QueuedMessage(data, () => promise, () => promise);
    }
}
exports.QueuedMessage = QueuedMessage;
class LincSocket {
    /**
     * Initializes a new instance of the UniversalWebSocket class.
     * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
     * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
     */
    constructor(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this.f_prevState = linc_state_types_1.LincState.Closed;
        this.f_state = linc_state_types_1.LincState.Closed;
        this.awaitingAck = new Map();
        this.messageQueue = new cm_array_1.CMArray();
        this.queueMessages = true;
        this.ackTimeoutMs = 10000; // 10 seconds for ACK timeout
        this.dingDongCounter = 0;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.emitErrors = false;
        this.listeners = {};
        this.initReconnectStrategy();
    }
    /**
     * Trigger a new reconnect event, if assigned
     *
     * @param {number} attempt
     * @param {number} maxAttempts
     * @param {number} interval
     */
    triggerReconnectEvent(attempt) {
        linc_logger_1.log.debug("[EVENT] triggerReconnectEvent :: attempt ::", attempt);
        if (this.onReconnect) {
            this.onReconnect({
                attempt: attempt,
            });
        }
    }
    //
    // State
    //
    get prevState() {
        return this.f_prevState;
    }
    get state() {
        return this.f_state;
    }
    set state(newState) {
        this.f_prevState = this.f_state;
        this.f_state = newState;
    }
    /**
     * Properly dispose the current WebSocket instance
     * @private
     */
    cleanup() {
        if (this.ws) {
            this.ws.terminate();
            this.ws = undefined;
        }
        else if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }
    initialize() {
        if (typeof WebSocket !== 'undefined') {
            this.socket = new WebSocket(this.url);
        }
        else {
            const WebSocketNode = require('ws');
            this.ws = new WebSocketNode(this.url);
        }
        this.setupEventHandlers();
    }
    /**
     * Initializes the reconnect strategy with the specified options.
     *
     * @param {IReconnectStrategy} strategy
     */
    initReconnectStrategy(strategy) {
        if (!strategy) {
            strategy = linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY;
        }
        strategy.reconnectDecay = strategy.reconnectDecay || linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY.reconnectDecay;
        strategy.jitter = strategy.jitter || linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY.jitter;
        strategy.reconnectAttempts = strategy.reconnectAttempts || Infinity;
        strategy.shouldReconnect = strategy.shouldReconnect || linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY.shouldReconnect;
        strategy.reconnectInterval = strategy.reconnectInterval || linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY.reconnectInterval;
        strategy.maxReconnectInterval = strategy.maxReconnectInterval || linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY.maxReconnectInterval;
        this.reconnectStrategy = strategy;
        this.autoReconnect = strategy.shouldReconnect;
        this.maxReconnectAttempts = strategy.reconnectAttempts;
    }
    resetSocket() {
        this.cleanup();
        this.initialize();
    }
    connect() {
        this.resetSocket();
    }
    setupEventHandlers() {
        if (this.ws) {
            this.setupNodeEvents();
        }
        else if (this.socket) {
            this.setupBrowserEvents();
        }
    }
    /**
     * Sets up event listeners for the WebSocket in Node.js environment.
     * This method is called only in Node.js environment.
     */
    setupNodeEvents() {
        if (!this.ws)
            return;
        this.ws.on(linc_event_types_1.TLincServerEvent.OPEN, () => {
            if (this.onOpen)
                this.onOpen();
        });
        this.ws.on(linc_event_types_1.TLincServerEvent.MESSAGE, (data) => this.handleMessage(data));
        this.ws.on(linc_event_types_1.TLincServerEvent.ERROR, (error) => {
            if (this.onError) {
                this.onError({ error, message: error.message, type: 'error', target: this.ws });
            }
        });
        this.ws.on(linc_event_types_1.TLincServerEvent.CLOSE, (closeCode, closeReason) => {
            const closeEvent = { code: closeCode, reason: closeReason };
            this.handleClose(closeEvent);
        });
    }
    triggerErrorEvent(event) {
    }
    /**
     * Sets up event listeners for the WebSocket in browser environments.
     * This method is called only in browser environments.
     */
    setupBrowserEvents() {
        if (!this.socket)
            return;
        this.socket.onopen = () => {
            if (this.onOpen)
                this.onOpen();
        };
        this.socket.onmessage = (event) => this.handleMessage(event);
        this.socket.onerror = (event) => {
            if (this.onError) {
                this.onError({
                    error: new Error('WebSocket error'),
                    message: 'WebSocket error',
                    type: 'error',
                    target: event
                });
            }
        };
        this.socket.onclose = (event) => {
            this.handleClose(event);
        };
    }
    getReconnectStrategy() {
        return this.reconnectStrategy ?? linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY;
    }
    /**
     * Determines if a reconnection should be attempted based on the close code.
     * @param closeCode - The close code from the WebSocket close event.
     * @returns {boolean} Whether a reconnection should be attempted.
     */
    shouldAttemptReconnect(closeCode) {
        closeCode = closeCode || line_socket_close_codes_2.WebSocketCloseCode.NormalClosure;
        const strategy = this.getReconnectStrategy();
        return !line_socket_close_codes_1.nonReConnectableCodes.has(closeCode) &&
            strategy.shouldReconnect &&
            this.reconnectAttempts < strategy.reconnectAttempts;
    }
    handleReconnection(event) {
        if (!this.shouldAttemptReconnect(event.code)) {
            linc_logger_1.log.debug(`Reconnect not attempted, close code: ${event.code}`);
            return;
        }
        let delay = this.calculateReconnectDelay();
        setTimeout(() => {
            linc_logger_1.log.debug(`Attempting to reconnect, attempt: ${this.reconnectAttempts + 1}`);
            this.reconnectAttempts++;
            this.triggerReconnectEvent(this.reconnectAttempts);
            this.resetSocket();
        }, delay);
    }
    /**
     * Calculates the delay before attempting a reconnection, applying exponential backoff and jitter.
     * @returns {number} The calculated delay in milliseconds.
     */
    calculateReconnectDelay() {
        const strategy = this.getReconnectStrategy();
        let delay = strategy.reconnectInterval * Math.pow(strategy.reconnectDecay, this.reconnectAttempts);
        delay = Math.min(delay, strategy.maxReconnectInterval ?? Infinity);
        delay += (Math.random() * 2 - 1) * strategy.jitter * delay;
        return delay;
    }
    /**
     * Handle close evenr
     * @param {TCloseEvent} event
     */
    handleClose(event) {
        linc_logger_1.log.debug("handleClose :: code ::", event.code, " :: reason ::", event.reason);
        const reconnect = this.reconnectStrategy?.shouldReconnect;
        if (!reconnect) {
            //
            // Dispatch event
            //
            if (this.onClose) {
                this.onClose(event);
            }
            return;
        }
        this.handleReconnection(event);
    }
    /**
     * Handles global WebSocket errors.
     *
     * @param {TMessageEvent} event
     */
    handleError(event) {
        console.log("handleError :: event ::", event);
    }
    /**
     * Handles the WebSocket message event.
     * @param event
     */
    handleMessage(event) {
        let jsonObj = event;
        try {
            const stringUtf8 = event.toString();
            jsonObj = JSON.parse(stringUtf8);
        }
        catch (err) {
            this.handleError(err);
            return;
        }
        switch (jsonObj.type) {
            case linc_event_types_1.TLincServerEvent.Ding:
                this.sendMsgDong();
                break;
        }
        console.log('handleMessage :: Message from server:', jsonObj);
        if (jsonObj.id && this.awaitingAck.has(jsonObj.id)) {
            this.awaitingAck.get(jsonObj.id).resolve();
            this.awaitingAck.delete(jsonObj.id);
        }
        if (this.onMessage) {
            this.onMessage(jsonObj);
        }
    }
    /**
     * Handles the WebSocket close event.
     * @private
     */
    handleReconnect() {
        console.log("handleReconnect :: autoReconnect ::", this.autoReconnect);
        let proceedReconnect = true;
        const interval = (this.reconnectStrategy?.reconnectInterval ?? 1000) * Math.pow(2, this.reconnectAttempts);
        if (this.autoReconnect || proceedReconnect) {
            setTimeout(() => {
                linc_logger_1.log.info(`Attempting to reconnect... Attempt ${this.reconnectAttempts + 1}`);
                this.cleanup(); // Cleanup before attempting to reconnect
                this.initialize(); // Reinitialize WebSocket connection
            }, interval);
            this.reconnectAttempts++;
        }
    }
    async sendAwait(data) {
        if (this.readyState === WebSocket.OPEN) {
            return this.directSend(data);
        }
        else if (this.queueMessages) {
            return new Promise((resolve, reject) => this.messageQueue.add(new QueuedMessage(data, resolve, reject)));
        }
        else {
            return Promise.reject(new Error("WebSocket not open and queuing disabled."));
        }
    }
    directSend(data) {
        return new Promise((resolve, reject) => {
            const messageId = (0, linc_message_utils_1.newMsgId)();
            const messageToSend = JSON.stringify({ messageId, data });
            this.awaitingAck.set(messageId, { resolve, reject });
            setTimeout(() => {
                if (this.awaitingAck.has(messageId)) {
                    this.awaitingAck.delete(messageId);
                    reject(new Error('ACK timeout'));
                }
            }, this.ackTimeoutMs);
            (this.ws || this.socket).send(messageToSend);
        });
    }
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
    async flushQueue(delayMs = 100) {
        const sendFunction = async (messageData) => {
            if (this.readyState !== WebSocket.OPEN) {
                console.warn('WebSocket is not open. Waiting before retrying flushQueue...');
                this.messageQueue.shiftBack(messageData); // Re-queue the message at the beginning
                return; // Exit the current send operation
            }
            try {
                await this.directSend(messageData.data);
                messageData.resolve(); // Resolve the message's promise on successful send
            }
            catch (error) {
                console.error('Failed to send message:', error);
                messageData.reject(error); // Reject the message's promise on failure
                // Optionally, decide here whether to re-queue or handle the error differently
            }
        };
        await this.messageQueue.recursiveProcess(sendFunction, delayMs);
    }
    /**
     * Gets the current state of the WebSocket connection.
     * @returns {number} The current state of the WebSocket connection.
     */
    get readyState() {
        if (this.ws) {
            return this.ws.readyState;
        }
        else if (this.socket) {
            return this.socket.readyState;
        }
        // Return a state representing closed if neither socket is initialized,
        // mirroring the WebSocket.CLOSED state
        return WebSocket.CLOSED; // 3; // WebSocket.CLOSED
    }
    /**
     * Sends data through the WebSocket connection.
     * @param {TLincDataType} data - The data to send through the WebSocket connection.
     * @param dataType
     */
    async send(data) {
        if (linc_global_1.isNode) {
            this.ws.send(data);
        }
        else {
            this.socket?.send(data);
        }
    }
    sendNewMessage(type, payload) {
        this.sendMessage(new linc_message_1.LincMessage(type, payload));
    }
    sendMessage(payload) {
        this.send(JSON.stringify(payload));
    }
    sendMsgDong() {
        this.dingDongCounter++;
        this.sendMessage({ type: linc_event_types_1.TLincServerEvent.Dong });
    }
    /**
     * Closes the WebSocket connection or connection attempt, if any.
     * If the connection is already CLOSED, this method does nothing.
     * @param {number} [code=1000] - A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} [reason=""] - A human-readable string explaining why the connection is closing.
     */
    close(code = 1000, reason = "") {
        linc_logger_1.log.debug("LincSocket :: close :: code ::", code, " :: reason ::", reason);
        if (linc_global_1.isNode) {
            this.ws.close(code, reason);
        }
        else {
            this.socket?.close(code, reason);
        }
        this.handleReconnect();
    }
    //////////////////////////////////////////////////////////////////////////
    //
    // Event handlers
    //
    //////////////////////////////////////////////////////////////////////////
    addEventListener(eventType, listener) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(listener);
    }
    removeEventListener(eventType, listener) {
        if (!this.listeners[eventType])
            return;
        const index = this.listeners[eventType].indexOf(listener);
        if (index !== -1) {
            this.listeners[eventType].splice(index, 1);
        }
    }
    dispatchEvent(eventType, event) {
        if (!this.listeners[eventType])
            return;
        this.listeners[eventType].forEach((listener) => {
            listener(event);
        });
    }
}
exports.LincSocket = LincSocket;
