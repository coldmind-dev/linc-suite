import 'reflect-metadata';
import * as http from 'http';
import { Server } from 'ws';
import { singleton, container } from 'tsyringe';

/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-05
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
/**
 * Convert an object to its string representation

 * @param {T} obj
 * @returns {string}
 */
function toJson(obj) {
    return JSON.stringify(obj);
}
/**
 * Convert a JSON formatted string into a solid object

 * @param {string} jsonString
 * @returns {T | null}
 */
function fromJson(jsonString) {
    return JSON.parse(jsonString);
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
// WE rewrite this import { v4 as uuidv4 } from 'uuid';
// as a require instead so that we can check if the package is installed or not
// if not we warn and replace it with vanilla typescript of more simple nature
let uuidv4;
try {
    uuidv4 = require('uuid').v4;
}
catch (e) {
    console.error('uuid package not found, using a simple message id generator instead');
    uuidv4 = () => {
        return Math.random().toString(36).substring(2);
    };
}
/**
 * Generates a unique message ID using the uuid library.
 * @returns {string} A unique message ID.
 */
function newMsgId() {
    return uuidv4();
}

/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
/**
 * Linc Message Object
 */
class LincMessage {
    constructor(type, payload, id, ref, noAck) {
        this.type = type;
        this.payload = payload;
        this.id = id;
        this.ref = ref;
        this.noAck = noAck;
        this.id = id || newMsgId();
    }
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
    static create(type, payload, id, ref, noAck) {
        return new LincMessage(type, payload, id, ref, noAck);
    }
    static serialize() {
        return JSON.stringify(this);
    }
    /**
     * Deserialize a JSON string to a LincMessage
     *
     * @param {string} json
     * @returns {ILincMessage}
     */
    static deserialize(json) {
        return fromJson(json);
    }
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
class Logger {
    constructor() { }
    info(...args) {
        console.log(args);
        return this;
    }
    warn(...args) {
        console.log(args);
        return this;
    }
    error(...args) {
        console.error(args);
        return this;
    }
    debug(...args) {
        console.log(args);
        return this;
    }
    /**
     * Get the instance of the Logger
     *
     * @returns {Logger}
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return Logger.instance;
    }
}
const log = Logger.getInstance();

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
const DEFAULT_RECONNECT_STRATEGY = {
    reconnectDecay: 1.5,
    jitter: 0.5,
    reconnectAttempts: Infinity,
    shouldReconnect: true,
    reconnectInterval: 1000,
    maxReconnectInterval: 30000
};

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
var WebSocketCloseCode;
(function (WebSocketCloseCode) {
    WebSocketCloseCode[WebSocketCloseCode["NormalClosure"] = 1000] = "NormalClosure";
    WebSocketCloseCode[WebSocketCloseCode["GoingAway"] = 1001] = "GoingAway";
    WebSocketCloseCode[WebSocketCloseCode["ProtocolError"] = 1002] = "ProtocolError";
    WebSocketCloseCode[WebSocketCloseCode["UnsupportedData"] = 1003] = "UnsupportedData";
    WebSocketCloseCode[WebSocketCloseCode["NoStatusReceived"] = 1005] = "NoStatusReceived";
    WebSocketCloseCode[WebSocketCloseCode["AbnormalClosure"] = 1006] = "AbnormalClosure";
    WebSocketCloseCode[WebSocketCloseCode["InvalidFramePayloadData"] = 1007] = "InvalidFramePayloadData";
    WebSocketCloseCode[WebSocketCloseCode["PolicyViolation"] = 1008] = "PolicyViolation";
    WebSocketCloseCode[WebSocketCloseCode["MessageTooBig"] = 1009] = "MessageTooBig";
    WebSocketCloseCode[WebSocketCloseCode["MissingExtension"] = 1010] = "MissingExtension";
    WebSocketCloseCode[WebSocketCloseCode["InternalServerError"] = 1011] = "InternalServerError";
    WebSocketCloseCode[WebSocketCloseCode["TLSHandshake"] = 1015] = "TLSHandshake";
    // Custom close codes (3000-3999 range is reserved for use by libraries, frameworks, and applications)
    WebSocketCloseCode[WebSocketCloseCode["ConnectionLost"] = 3000] = "ConnectionLost";
    WebSocketCloseCode[WebSocketCloseCode["ReconnectTimedOut"] = 3001] = "ReconnectTimedOut";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode1"] = 3002] = "CustomCode1";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode2"] = 3003] = "CustomCode2";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode3"] = 3004] = "CustomCode3";
    WebSocketCloseCode[WebSocketCloseCode["CustomCode4"] = 3005] = "CustomCode4"; // Reserved for future use
})(WebSocketCloseCode || (WebSocketCloseCode = {}));
//
// Add a property to customize non-reconnectable close codes
//
const nonReConnectableCodes = new Set([
    WebSocketCloseCode.NormalClosure, // Normal closure
    WebSocketCloseCode.UnsupportedData, // Unsupported data
    WebSocketCloseCode.PolicyViolation, // Policy violation
    WebSocketCloseCode.MessageTooBig, // Message too big
    WebSocketCloseCode.InternalServerError, // Internal server error
    4000, // Example custom code for "Do not reconnect"
]);

//////////////////////////////////////////////////////////////////////////
//
// Event Types
//
//////////////////////////////////////////////////////////////////////////
var TLincServerEvent;
(function (TLincServerEvent) {
    // Enumerations for different WebSocket events
    TLincServerEvent["NONE"] = "none";
    TLincServerEvent["CONNECTING"] = "connecting";
    TLincServerEvent["CONNECTION"] = "connection";
    TLincServerEvent["CLOSE"] = "close";
    TLincServerEvent["ERROR"] = "error";
    TLincServerEvent["HEADERS"] = "headers";
    TLincServerEvent["LISTENING"] = "listening";
    TLincServerEvent["MESSAGE"] = "message";
    TLincServerEvent["OPEN"] = "open";
    TLincServerEvent["UPGRADE"] = "upgrade";
    TLincServerEvent["Ding"] = "ding";
    TLincServerEvent["Dong"] = "dong";
    TLincServerEvent["Ack"] = "ack";
})(TLincServerEvent || (TLincServerEvent = {}));

/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
var LincState;
(function (LincState) {
    LincState[LincState["None"] = -1000] = "None";
    LincState[LincState["Connecting"] = 0] = "Connecting";
    LincState[LincState["Open"] = 1] = "Open";
    LincState[LincState["Connected"] = 1] = "Connected";
    LincState[LincState["Disconnected"] = -1] = "Disconnected";
    LincState[LincState["Closing"] = 2] = "Closing";
    LincState[LincState["Closed"] = 3] = "Closed";
    LincState[LincState["Terminated"] = 110] = "Terminated";
    LincState[LincState["ReConnecting"] = 120] = "ReConnecting";
    LincState[LincState["Error"] = 130] = "Error";
})(LincState || (LincState = {}));

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
class CMArray extends Array {
    constructor(items) {
        super();
        this.index = 0;
        this.items = [];
        if (items) {
            this.items = items;
        }
    }
    getItems() {
        this.items = (Array.isArray(this?.items) ? this.items : []);
        return this.items;
    }
    /**
     * Adds an item to the array.
     * @param item The item to add.
     */
    add(item) {
        this.items.push(item);
    }
    /**
     * Gets the next item in the array, cycling back to the start if at the end.
     * @returns The next item of type T.
     */
    next() {
        const item = this.items[this.index];
        this.index = (this.index + 1) % this.items.length; // Cycle back to start
        return item;
    }
    /**
     * Checks if the array is empty.
     * @returns True if the array is empty, false otherwise.
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Removes and returns the first item from the array.
     * @returns The first item of type T, or undefined if the array is empty.
     */
    shift(next, allowNull) {
        return next ? this.shiftNext(allowNull) : this.items.shift();
    }
    /**
     * Removes and returns the first item from the array that is not null. If `allowNull` is true,
     * it can return null when the first item is null. Continues to shift until a non-null item is found
     * or the array is empty.
     * @param {boolean} [allowNull=false] - Indicates if null items are allowed to be returned.
     * @returns {T | undefined} - The first non-null item, or undefined if the array is empty or only contains null.
     */
    shiftNext(allowNull) {
        let item;
        while (this.items.length > 0) {
            item = this.items.shift();
            if (item !== null || allowNull) {
                return item;
            }
        }
    }
    shiftBack(item) {
        return this.getItems().unshift(item);
    }
    /**
     * Adds an item to the beginning of the array.
     * @param item The item to add.
     */
    unshift(item) {
        return this.items.unshift(item);
    }
    /**
     * Gets the current size of the array.
     * @returns The number of items in the array.
     */
    size() {
        return this.items.length;
    }
    /**
     * Recursively processes each item in the array with a provided function.
     * @param func The function to apply to each item.
     * @param delay Optional delay between processing items.
     */
    async recursiveProcess(func, delay = 0) {
        if (this.isEmpty())
            return;
        await func(this.shiftNext());
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        // Continue processing recursively
        await this.recursiveProcess(func, delay);
    }
    /**
     * Clears the array.
     */
    clear() {
        this.items = [];
        this.index = 0;
    }
}

/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-11
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
var MetaKeys;
(function (MetaKeys) {
    MetaKeys["Plugin"] = "plugin";
    MetaKeys["Controller"] = "controller";
    MetaKeys["Service"] = "service";
    MetaKeys["Repository"] = "repository";
    MetaKeys["Middleware"] = "middleware";
    MetaKeys["Undefined"] = "undefined";
})(MetaKeys || (MetaKeys = {}));
const isNode = !!(typeof process !== MetaKeys.Undefined && process.versions && process.versions.node);
function getIsNode() {
    return isNode;
}

/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
class LincSocket {
    /**
     * Initializes a new instance of the UniversalWebSocket class.
     * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
     * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
     */
    constructor(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this.f_prevState = LincState.Closed;
        this.f_state = LincState.Closed;
        this.awaitingAck = new Map();
        this.messageQueue = new CMArray();
        this.queueMessages = true;
        this.ackTimeoutMs = 10000; // 10 seconds for ACK timeout
        this.dingDongCounter = 0;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.emitErrors = false;
        this.listeners = {};
        this.initReconnectStrategy();
    }
    isOpen() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
    /**
     * Trigger a new reconnect event, if assigned
     *
     * @param {number} attempt
     * @param {number} maxAttempts
     * @param {number} interval
     */
    triggerReconnectEvent(attempt) {
        log.debug("[EVENT] triggerReconnectEvent :: attempt ::", attempt);
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
            strategy = DEFAULT_RECONNECT_STRATEGY;
        }
        strategy.reconnectDecay = strategy.reconnectDecay || DEFAULT_RECONNECT_STRATEGY.reconnectDecay;
        strategy.jitter = strategy.jitter || DEFAULT_RECONNECT_STRATEGY.jitter;
        strategy.reconnectAttempts = strategy.reconnectAttempts || Infinity;
        strategy.shouldReconnect = strategy.shouldReconnect || DEFAULT_RECONNECT_STRATEGY.shouldReconnect;
        strategy.reconnectInterval = strategy.reconnectInterval || DEFAULT_RECONNECT_STRATEGY.reconnectInterval;
        strategy.maxReconnectInterval = strategy.maxReconnectInterval || DEFAULT_RECONNECT_STRATEGY.maxReconnectInterval;
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
        this.ws.on(TLincServerEvent.OPEN, () => {
            if (this.onOpen)
                this.onOpen();
        });
        this.ws.on(TLincServerEvent.MESSAGE, (data) => this.handleMessage(data));
        this.ws.on(TLincServerEvent.ERROR, (error) => {
            if (this.onError) {
                this.onError({ error, message: error.message, type: 'error', target: this.ws });
            }
        });
        this.ws.on(TLincServerEvent.CLOSE, (closeCode, closeReason) => {
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
            this.state = LincState.Open;
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
            this.state = LincState.Closed;
            this.handleClose(event);
        };
    }
    getReconnectStrategy() {
        return this.reconnectStrategy ?? DEFAULT_RECONNECT_STRATEGY;
    }
    /**
     * Determines if a reconnection should be attempted based on the close code.
     * @param closeCode - The close code from the WebSocket close event.
     * @returns {boolean} Whether a reconnection should be attempted.
     */
    shouldAttemptReconnect(closeCode) {
        closeCode = closeCode || WebSocketCloseCode.NormalClosure;
        const strategy = this.getReconnectStrategy();
        return !nonReConnectableCodes.has(closeCode) &&
            strategy.shouldReconnect &&
            this.reconnectAttempts < strategy.reconnectAttempts;
    }
    handleReconnection(event) {
        if (!this.shouldAttemptReconnect(event.code)) {
            log.debug(`Reconnect not attempted, close code: ${event.code}`);
            return;
        }
        let delay = this.calculateReconnectDelay();
        setTimeout(() => {
            log.debug(`Attempting to reconnect, attempt: ${this.reconnectAttempts + 1}`);
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
     * @param {TCloseEvent} eventw
     */
    handleClose(event) {
        log.debug("handleClose :: code ::", event.code, " :: reason ::", event.reason);
        const reconnect = this.reconnectStrategy?.shouldReconnect;
        if (!reconnect) {
            //f
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
     * @param {TMsgEvent} event
     */
    handleError(event) {
        console.log("handleError :: event ::", event);
    }
    parseWebSocketMessage(message) {
        let data;
        // Check if the message is an instance of Buffer or similar binary type
        if (message instanceof Buffer) {
            // Decode the binary data to a string
            data = message.toString('utf-8');
        }
        else if (typeof message === 'string') {
            // If the message is already a string, use it directly
            data = message;
        }
        else {
            // If the message is neither binary nor string, it might be an error or unexpected type
            throw new Error('Unsupported message format');
        }
        try {
            // Parse the decoded string or the direct string as JSON
            const parsedData = JSON.parse(data);
            return parsedData;
        }
        catch (error) {
            // Handle parsing errors (e.g., if the data is not valid JSON)
            throw new Error('Failed to parse message as JSON');
        }
    }
    /**
     * Handles the WebSocket message event.
     * @param event
     */
    handleMessage(event) {
        let jsonObj = event;
        console.log("----> jsonObj ::", jsonObj);
        try {
            if (typeof event === 'string') {
                jsonObj = JSON.parse(event);
            }
            else if (event?.type) {
                throw new Error("Invalid message type");
            }
        }
        catch (err) {
            this.handleError(err);
            return;
        }
        switch (jsonObj.type) {
            case TLincServerEvent.Ding:
                this.sendMsgDong();
                break;
        }
        console.log('handleMessage :: Message from server - A:', jsonObj);
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
                log.info(`Attempting to reconnect... Attempt ${this.reconnectAttempts + 1}`);
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
            const messageId = newMsgId();
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
        if (getIsNode()) {
            this.ws.send(data);
        }
        else {
            this.socket?.send(data);
        }
    }
    sendNewMessage(type, payload) {
        this.sendMessage(new LincMessage(type, payload));
    }
    sendMessage(payload) {
        const msg = JSON.stringify(payload);
        this.send(msg);
    }
    sendMsgDong() {
        this.dingDongCounter++;
        this.sendMessage({ type: TLincServerEvent.Dong });
    }
    /**
     * Closes the WebSocket connection or connection attempt, if any.
     * If the connection is already CLOSED, this method does nothing.
     * @param {number} [code=1000] - A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} [reason=""] - A human-readable string explaining why the connection is closing.
     */
    close(code = 1000, reason = "") {
        log.debug("LincSocket :: close :: code ::", code, " :: reason ::", reason);
        if (getIsNode()) {
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
const TMsgType = {
    Ding: "ding",
    Dong: "dong",
    Prompt: "prompt"
};

/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-03-08
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
/**
 * Represents a custom URL class for parsing, constructing, and manipulating URLs.
 */
class CmUrl {
    //////////////////////////////////////////////////////////
    //
    // Getters and setters
    // C#'s auto-props, nooo, remember that this is still JavaScript :)
    //
    /////////////////////////////////////////////////////////
    // Protocol
    get protocol() {
        return this._protocol;
    }
    set protocol(value) {
        this._protocol = value;
    }
    // Host
    get host() {
        return this._host;
    }
    set host(value) {
        this._host = value;
    }
    // Port
    get port() {
        return this._port;
    }
    set port(value) {
        this._port = value;
    }
    // Paths
    get paths() {
        return this._paths;
    }
    set paths(value) {
        this._paths = value;
    }
    //////////////////////////////////////////////////////////
    /**
     * Constructs a CmUrl instance, optionally parsing a provided URL string.
     *
     * @param value - The URL string to parse (optional).
     * @param defaults - Default values for protocol, host, and port.
     */
    constructor(value, defaults = { port: 80, protocol: 'http', host: 'localhost' }) {
        this._protocol = 'http';
        this._host = 'localhost';
        this._paths = [];
        this.params = new Map();
        this.init(defaults);
        if (value) {
            this.parse(value);
        }
    }
    init(defaults) {
        this.port = defaults.port;
        this.protocol = defaults.protocol;
        this.host = defaults.host;
    }
    /**
     * Parses a URL string, extracting its components.
     *
     * @param value - The URL string to parse.
     * @private
     */
    parse(value) {
        const url = new URL(value);
        this.protocol = url.protocol.slice(0, -1); // Remove trailing colon
        this.host = url.hostname;
        this.port = url.port !== '' ? parseInt(url.port, 10) : this.port;
        this.paths = url.pathname.split('/').filter(Boolean);
        url.searchParams.forEach((v, k) => {
            this.params.set(k, v);
        });
    }
    /**
     * Sets the protocol for the URL.
     *
     * @param protocol - The protocol to set.
     * @returns The instance of CmUrl for chaining.
     */
    setProtocol(protocol) {
        this.protocol = protocol;
        return this;
    }
    /**
     * Sets the host for the URL.
     *
     * @param host - The host to set.
     * @returns The instance of CmUrl for chaining.
     */
    setHost(host) {
        this.host = host;
        return this;
    }
    /**
     * Sets the port for the URL.
     *
     * @param port - The port number to set.
     * @returns The instance of CmUrl for chaining.
     */
    setPort(port) {
        this.port = port;
        return this;
    }
    /**
     * Appends a path segment to the URL's pathname.
     *
     * @param segment - The path segment to append.
     * @returns The instance of CmUrl for chaining.
     */
    appendPath(segment) {
        this.paths.push(segment);
        return this;
    }
    /**
     * Appends a query parameter to the URL.
     *
     * @param key - The key of the query parameter.
     * @param value - The value of the query parameter.
     * @returns The instance of CmUrl for chaining.
     */
    appendParam(key, value) {
        this.params.set(key, value);
        return this;
    }
    /**
     * Constructs the URL string from its components.
     *
     * @returns The constructed URL string.
     */
    toString() {
        const portPart = this.port ? `:${this.port}` : '';
        const pathPart = this.paths.join('/');
        const paramsPart = Array.from(this.params).map(([key, value]) => `${key}=${value}`).join('&');
        return `${this.protocol}://${this.host}${portPart}/${pathPart}${paramsPart ? '?' + paramsPart : ''}`;
    }
}

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
class LincClient extends LincSocket {
    constructor(url) {
        super();
    }
    connectClient(host, port) {
        return Promise.resolve();
    }
    static fromUrl(url) {
        let wsUrl = "";
        try {
            const urlObj = new CmUrl(url);
            let protocol = urlObj?.protocol.toLowerCase();
            if (!protocol)
                protocol = "ws";
            if (!["ws", "wss", "http", "https"].includes(protocol)) {
                throw new Error("Invalid protocol");
            }
            wsUrl = urlObj.toString();
        }
        catch (e) {
            console.error("Invalid URL:: ", e);
            return null;
        }
        return new LincClient(wsUrl);
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

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
/**
 * Server Client Connection Information
 * attached to each client connection
 */
class ClientInfo {
    constructor(ip) {
        this.lastActivity = -1;
        this.ip = ip;
        this.isAuthenticated = false;
        this.session = null;
        this.isAlive = false;
        this.missedPings = 0;
        this.updateActivity();
    }
    updateActivity() {
        this.lastActivity = new Date().getTime();
    }
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
/**
 * Retrieve server settings, stored as metadata on class instance
 *
 * @param instance
 * @returns {T | undefined}
 */
function getServerSettings(instance) {
    const reflectSettings = Reflect.getMetadata("MetadataKeys.Application", instance);
    log.debug("getServerSettings ::", reflectSettings);
    return reflectSettings;
}

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
var MiddlewareStatus;
(function (MiddlewareStatus) {
    MiddlewareStatus[MiddlewareStatus["Unknown"] = -1] = "Unknown";
    MiddlewareStatus[MiddlewareStatus["Success"] = 0] = "Success";
    MiddlewareStatus[MiddlewareStatus["Failure"] = 1] = "Failure";
    MiddlewareStatus[MiddlewareStatus["NoAction"] = 2] = "NoAction";
    MiddlewareStatus[MiddlewareStatus["Pending"] = 3] = "Pending";
})(MiddlewareStatus || (MiddlewareStatus = {}));

var MiddlewareErrorType;
(function (MiddlewareErrorType) {
    MiddlewareErrorType["Client"] = "client";
    MiddlewareErrorType["Server"] = "server";
})(MiddlewareErrorType || (MiddlewareErrorType = {}));
class MiddlewareError {
    constructor(type, ctx, message, statusCode, error) {
        this.type = type;
        this.ctx = ctx;
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
    /**
     * Constructs a new MiddlewareError instance from an error object
     */
    static fromError(error, ctx, type = MiddlewareErrorType.Server) {
        return new MiddlewareError(type, ctx, error.message, MiddlewareStatus.Failure, error);
    }
}

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
/**
 * Registers the class as a singleton in the DI container and tags it as a specific type.
 * @param type The type of class being registered (e.g., 'Client', 'Server', 'Service').
 */
function registerSingletonAs(type) {
    return function (constructor) {
        singleton()(constructor);
        container.registerSingleton(type, constructor);
    };
}
/**
 * Custom decorator for marking a class as a server component.
 * Registers the class as a singleton and tags it as 'Server'.
 */
function ServerApp(config) {
    return registerSingletonAs('CMServer');
}
/**
 * Custom decorator for marking a class as a service component.
 * Registers the class as a singleton and tags it as 'Service'.
 */
function Service() {
    return registerSingletonAs('CMService');
}

class CMResult {
    constructor(success, data, error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}

/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-12
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
let LincPluginManager = class LincPluginManager {
    constructor(server) {
        this.server = server;
        this.plugins = [];
        this.plugins = [];
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
    }
    removePlugin(plugin) {
        let index = this.plugins.indexOf(plugin);
        if (index > -1) {
            this.plugins.splice(index, 1);
        }
    }
    /**
     * Initialize plugins
     *
     * @returns {Promise<IResult>}
     */
    async initPlugins() {
        const result = new CMResult(true);
        try {
            let pluginList = [];
            if (container.isRegistered(MetaKeys.Plugin, true)) {
                pluginList = container.resolveAll(MetaKeys.Plugin) ?? [];
            }
            else {
                log.debug("LincPluginManager :: No plugins found");
            }
            pluginList.forEach((plugin) => async () => {
                log.debug("Plugin ::", plugin);
                await plugin.initialize(this.server);
            });
        }
        catch (err) {
            console.log("InitPlugin :: Error", err);
            result.success = false;
            result.error = err;
        }
        return result;
    }
};
LincPluginManager = __decorate([
    Service(),
    __metadata("design:paramtypes", [LincServer])
], LincPluginManager);

const LincEventName = (code) => {
    return LincEventType[code];
};
var LincEventType;
(function (LincEventType) {
    LincEventType[LincEventType["Unknown"] = -1] = "Unknown";
    LincEventType[LincEventType["UnhandledException"] = -10] = "UnhandledException";
    LincEventType[LincEventType["NewConnection"] = 10] = "NewConnection";
    LincEventType[LincEventType["Close"] = 20] = "Close";
    LincEventType[LincEventType["ClosedDueToInactivity"] = 4001] = "ClosedDueToInactivity";
    LincEventType[LincEventType["Message"] = 30] = "Message";
    LincEventType[LincEventType["Error"] = 40] = "Error";
    LincEventType[LincEventType["Warning"] = 50] = "Warning";
    LincEventType[LincEventType["Info"] = 60] = "Info";
    LincEventType[LincEventType["ConnectionLimitReached"] = 1008] = "ConnectionLimitReached";
    LincEventType[LincEventType["InvalidMessageFormat"] = 1003] = "InvalidMessageFormat";
})(LincEventType || (LincEventType = {}));
/**
 * Data model for server events
 */
class LincServerEvent {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    static fromCode(event, payload) {
        return new LincServerEvent(event, payload);
    }
    static fromError(error) {
        return new LincServerEvent(LincEventType.UnhandledException, error);
    }
}

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
/**
 * Implements a simple subject that allows observers to subscribe and receive
 * updates, errors, and completion notifications. It can also be consumed as a promise.
 * @class EnhancedSubject
 * @template T The type of items that the subject can emit.
 */
class CMSignalHub {
    constructor() {
        this.observers = [];
        this.errorCallbacks = [];
        this.completeCallbacks = [];
        this.isCompleted = false;
        this.hasErrored = false;
        this.promiseResolve = null;
        this.promiseReject = null;
    }
    subscribe(observer, error, complete) {
        if (this.isCompleted || this.hasErrored) {
            return { unsubscribe: () => { } };
        }
        this.observers.push(observer);
        if (error)
            this.errorCallbacks.push(error);
        if (complete)
            this.completeCallbacks.push(complete);
        return {
            unsubscribe: () => {
                this.observers = this.observers.filter(obs => obs !== observer);
                this.errorCallbacks = this.errorCallbacks.filter(errCb => errCb !== error);
                this.completeCallbacks = this.completeCallbacks.filter(compCb => compCb !== complete);
            },
        };
    }
    asPromise() {
        return new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
    }
    next(value) {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.lastValue = value;
        this.observers.forEach(observer => observer(value));
        if (this.promiseResolve) {
            this.promiseResolve(value);
            this.clearPromiseHandlers();
        }
    }
    error(errorValue) {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.errorCallbacks.forEach(errorCb => errorCb(errorValue));
        this.hasErrored = true;
        if (this.promiseReject) {
            this.promiseReject(errorValue);
            this.clearPromiseHandlers();
        }
        this.clearObservers();
    }
    complete() {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.completeCallbacks.forEach(completeCb => completeCb());
        this.isCompleted = true;
        this.clearObservers();
    }
    /**
     * Clears all observers and their associated callbacks
     *
     * @private
     */
    clearObservers() {
        this.observers = [];
        this.errorCallbacks = [];
        this.completeCallbacks = [];
    }
    /**
     * Resets the promise handlers to null after resolving or rejecting
     *
     * @private
     */
    clearPromiseHandlers() {
        this.promiseResolve = null;
        this.promiseReject = null;
    }
    clear() {
        this.clearObservers();
        this.clearPromiseHandlers();
    }
}

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
const DEFAULT_SETTINGS = {
    port: 8080,
    pingIntervalMs: 36000,
    maxMissedPings: 3
};
const serverStartEvent = (port) => {
    log.info(`Server is listening on port ::`, port);
};
let LincServer = class LincServer {
    get isReady() {
        return this.serverReady;
    }
    setReady() {
        this.serverReady = true;
    }
    get plugIns() {
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
        this.eventHub = new CMSignalHub();
        this.serverReady = false;
        this.middlewares = [];
        this.plugins = [];
        this.connections = new Map();
        this.wssOptions = {
            //noServer: true,
            clientTracking: false,
        };
        let config = getServerSettings(this) ?? DEFAULT_SETTINGS;
        this.httpServer = config?.httpServer || http.createServer();
        this.wss = new Server({ ...this.wssOptions, server: this.httpServer });
        this.wss.on(TLincServerEvent.CONNECTION, this.handleConnection.bind(this));
        this.pingIntervalMs = config.pingIntervalMs;
        this.maxMissedPings = config.maxMissedPings;
        this.connectionLimits = new Map();
        this.maxConnectionsPerIP = 5;
        this.configureServer(config);
    }
    async configureServer(settings) {
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
                    log.info(`Server is listening on port ${port}`);
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
        ws.close(code, LincEventName(code));
        this.emitEvent(LincServerEvent.fromCode(code, ws));
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
        const clientInfo = new ClientInfo(ip);
        this.connections.set(ws, clientInfo);
        this.incConnectionCount(clientInfo.ip);
        log.info('<-- New WebSocket Client :: connection :: ', clientInfo.ip);
        //
        // Handle incoming messages with safe JSON parsing
        //
        ws.on(TLincServerEvent.MESSAGE, (message) => {
            try {
                const parsedMessage = fromJson(message);
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
                this.closeSocket(ws, LincEventType.InvalidMessageFormat);
            }
        });
        //
        // Cleanup on WebSocket close event
        //
        ws.on(TLincServerEvent.CLOSE, () => {
            this.connections.delete(ws); // Remove client from connections map
            log.info('WebSocket connection closed');
        });
        this.wss.on(TLincServerEvent.ERROR, (error) => {
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
                            const middlewareError = new MiddlewareError(MiddlewareErrorType.Server, ctx, err?.message, err.statusCode);
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
            const ackMessage = new LincMessage(TLincServerEvent.Ack, msg.id);
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
    sendMessage(ws, msgType, data) {
        ws.send(toJson(new LincMessage(msgType, data)));
    }
};
LincServer = __decorate([
    ServerApp(),
    __metadata("design:paramtypes", [])
], LincServer);

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
class CmEventError {
    constructor(error) {
        this.error = error;
    }
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
class SocketError {
    constructor(code, reason) {
        this.code = code;
        this.reason = reason;
    }
    /**
     * Create a SocketError from an Error object.
     *
     * @param {Error} error
     * @returns {SocketError}
     */
    static fromError(error) {
        return new SocketError(500, error.message);
    }
}

/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-01-30
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
class MiddlewareContext {
    constructor(ws, req, data, params) {
        this.ws = ws;
        this.req = req;
        this.data = data;
        this.params = params;
    }
}

export { ClientInfo, CmEventError, LincClient, LincMessage, LincServer, LincServerEvent, LincSocket, MiddlewareContext, MiddlewareError, SocketError, TLincServerEvent, TMsgType, WebSocketCloseCode, fromJson, log, newMsgId, nonReConnectableCodes, toJson };
