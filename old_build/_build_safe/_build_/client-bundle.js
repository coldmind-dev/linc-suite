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
})(MetaKeys || (MetaKeys = {}));
const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

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
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
class LincSocket {
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
        if (isNode) {
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
        if (isNode) {
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
class LincClient extends LincSocket {
    connectClient(host, port) {
        return Promise.resolve();
    }
    static fromPort(port) {
        return new LincClient(`ws://localhost:{port}`);
    }
}

export { LincClient, LincMessage, LincSocket, TLincServerEvent, TMsgType };
