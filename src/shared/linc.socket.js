"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincSocket = void 0;
var linc_message_1 = require("@msg/linc.message");
var linc_state_type_1 = require("@/@types/linc.state.type");
var linc_logger_1 = require("@shared/linc.logger");
var linc_message_utils_1 = require("@shared/linc.message.utils");
var linc_platform_utils_1 = require("@shared/linc.platform-utils");
var linc_reconnect_strategy_1 = require("@client/linc.reconnect-strategy");
var line_socket_close_codes_1 = require("@shared/line.socket-close-codes");
var line_socket_close_codes_2 = require("@shared/line.socket-close-codes");
var linc_event_types_1 = require("@shared/linc.event.types");
var cm_array_1 = require("@lib/cm.common/cm.array");
/**
 * Provides a unified WebSocket interface compatible with both Node.js and browser environments.
 * This class abstracts away the environment-specific details of the WebSocket API, offering
 * a consistent interface for opening a connection, sending messages, and registering event handlers.
 */
var LincSocket = /** @class */ (function () {
    /**
     * Initializes a new instance of the UniversalWebSocket class.
     * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
     * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
     */
    function LincSocket(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this.f_prevState = linc_state_type_1.LincState.Closed;
        this.f_state = linc_state_type_1.LincState.Closed;
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
    LincSocket.prototype.triggerReconnectEvent = function (attempt) {
        linc_logger_1.log.debug("[EVENT] triggerReconnectEvent :: attempt ::", attempt);
        if (this.onReconnect) {
            this.onReconnect({
                attempt: attempt,
            });
        }
    };
    Object.defineProperty(LincSocket.prototype, "prevState", {
        //
        // State
        //
        get: function () {
            return this.f_prevState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LincSocket.prototype, "state", {
        get: function () {
            return this.f_state;
        },
        set: function (newState) {
            this.f_prevState = this.f_state;
            this.f_state = newState;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Properly dispose the current WebSocket instance
     * @private
     */
    LincSocket.prototype.cleanup = function () {
        if (this.ws) {
            this.ws.terminate();
            this.ws = undefined;
        }
        else if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    };
    LincSocket.prototype.initialize = function () {
        if (typeof WebSocket !== 'undefined') {
            this.socket = new WebSocket(this.url);
        }
        else {
            var WebSocketNode = eval("require('ws')");
            this.ws = new WebSocketNode(this.url, this.protocols);
        }
        this.setupEventHandlers();
    };
    /**
     * Initializes the reconnect strategy with the specified options.
     *
     * @param {IReconnectStrategy} strategy
     */
    LincSocket.prototype.initReconnectStrategy = function (strategy) {
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
    };
    LincSocket.prototype.resetSocket = function () {
        this.cleanup();
        this.initialize();
    };
    LincSocket.prototype.connect = function () {
        this.resetSocket();
    };
    LincSocket.prototype.setupEventHandlers = function () {
        if (this.ws) {
            this.setupNodeEvents();
        }
        else if (this.socket) {
            this.setupBrowserEvents();
        }
    };
    /**
     * Sets up event listeners for the WebSocket in Node.js environment.
     * This method is called only in Node.js environment.
     */
    LincSocket.prototype.setupNodeEvents = function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.on(linc_event_types_1.TLincServerEvent.OPEN, function () {
            if (_this.onOpen)
                _this.onOpen();
        });
        this.ws.on(linc_event_types_1.TLincServerEvent.MESSAGE, function (data) { return _this.handleMessage(data); });
        this.ws.on(linc_event_types_1.TLincServerEvent.ERROR, function (error) {
            if (_this.onError) {
                _this.onError({ error: error, message: error.message, type: 'error', target: _this.ws });
            }
        });
        this.ws.on(linc_event_types_1.TLincServerEvent.CLOSE, function (closeCode, closeReason) {
            var closeEvent = { code: closeCode, reason: closeReason };
            _this.handleClose(closeEvent);
        });
    };
    LincSocket.prototype.triggerErrorEvent = function (event) {
    };
    /**
     * Sets up event listeners for the WebSocket in browser environments.
     * This method is called only in browser environments.
     */
    LincSocket.prototype.setupBrowserEvents = function () {
        var _this = this;
        if (!this.socket)
            return;
        this.socket.onopen = function () {
            if (_this.onOpen)
                _this.onOpen();
        };
        this.socket.onmessage = function (event) { return _this.handleMessage(event); };
        this.socket.onerror = function (event) {
            if (_this.onError) {
                _this.onError({
                    error: new Error('WebSocket error'),
                    message: 'WebSocket error',
                    type: 'error',
                    target: event
                });
            }
        };
        this.socket.onclose = function (event) {
            _this.handleClose(event);
        };
    };
    LincSocket.prototype.getReconnectStrategy = function () {
        var _a;
        return (_a = this.reconnectStrategy) !== null && _a !== void 0 ? _a : linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY;
    };
    /**
     * Determines if a reconnection should be attempted based on the close code.
     * @param closeCode - The close code from the WebSocket close event.
     * @returns {boolean} Whether a reconnection should be attempted.
     */
    LincSocket.prototype.shouldAttemptReconnect = function (closeCode) {
        closeCode = closeCode || line_socket_close_codes_2.WebSocketCloseCode.NormalClosure;
        var strategy = this.getReconnectStrategy();
        return !line_socket_close_codes_1.nonReConnectableCodes.has(closeCode) &&
            strategy.shouldReconnect &&
            this.reconnectAttempts < strategy.reconnectAttempts;
    };
    LincSocket.prototype.handleReconnection = function (event) {
        var _this = this;
        if (!this.shouldAttemptReconnect(event.code)) {
            linc_logger_1.log.debug("Reconnect not attempted, close code: ".concat(event.code));
            return;
        }
        var delay = this.calculateReconnectDelay();
        setTimeout(function () {
            linc_logger_1.log.debug("Attempting to reconnect, attempt: ".concat(_this.reconnectAttempts + 1));
            _this.reconnectAttempts++;
            _this.triggerReconnectEvent(_this.reconnectAttempts);
            _this.resetSocket();
        }, delay);
    };
    /**
     * Calculates the delay before attempting a reconnection, applying exponential backoff and jitter.
     * @returns {number} The calculated delay in milliseconds.
     */
    LincSocket.prototype.calculateReconnectDelay = function () {
        var _a;
        var strategy = this.getReconnectStrategy();
        var delay = strategy.reconnectInterval * Math.pow(strategy.reconnectDecay, this.reconnectAttempts);
        delay = Math.min(delay, (_a = strategy.maxReconnectInterval) !== null && _a !== void 0 ? _a : Infinity);
        delay += (Math.random() * 2 - 1) * strategy.jitter * delay;
        return delay;
    };
    /**
     * Handle close evenr
     * @param {TCloseEvent} event
     */
    LincSocket.prototype.handleClose = function (event) {
        var _a;
        linc_logger_1.log.debug("handleClose :: code ::", event.code, " :: reason ::", event.reason);
        var reconnect = (_a = this.reconnectStrategy) === null || _a === void 0 ? void 0 : _a.shouldReconnect;
        if (!reconnect) {
            //
            // Dispatch event
            //
            if (this.onClose)
                this.onClose(event);
            return;
        }
        this.handleReconnection(event);
    };
    /**
     * Handles global WebSocket errors.
     *
     * @param {TMessageEvent} event
     */
    LincSocket.prototype.handleError = function (event) {
        console.log("handleError :: event ::", event);
    };
    /**
     * Handles the WebSocket message event.
     * @param event
     */
    LincSocket.prototype.handleMessage = function (event) {
        var jsonObj = event;
        try {
            var stringUtf8 = event.toString();
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
    };
    /**
     * Handles the WebSocket close event.
     * @private
     */
    LincSocket.prototype.handleReconnect = function () {
        var _this = this;
        var _a;
        console.log("handleReconnect :: autoReconnect ::", this.autoReconnect);
        var proceedReconnect = true;
        var interval = (_a = this.reconnectStrategy) === null || _a === void 0 ? void 0 : _a.reconnectInterval; // * Math.pow(2, this.reconnectAttempts)
        if (this.autoReconnect || proceedReconnect) {
            setTimeout(function () {
                linc_logger_1.log.info("Attempting to reconnect... Attempt ".concat(_this.reconnectAttempts + 1));
                _this.cleanup(); // Cleanup before attempting to reconnect
                _this.initialize(); // Reinitialize WebSocket connection
            }, interval);
            this.reconnectAttempts++;
        }
    };
    LincSocket.prototype.sendAwait = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.readyState === WebSocket.OPEN) {
                    return [2 /*return*/, this.directSend(data)];
                }
                else if (this.queueMessages) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return _this.messageQueue.add({ data: data, resolve: resolve, reject: reject }); })];
                }
                else {
                    return [2 /*return*/, Promise.reject(new Error("WebSocket not open and queuing disabled."))];
                }
                return [2 /*return*/];
            });
        });
    };
    LincSocket.prototype.directSend = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var messageId = (0, linc_message_utils_1.newMsgId)();
            var messageToSend = JSON.stringify({ messageId: messageId, data: data });
            _this.awaitingAck.set(messageId, { resolve: resolve, reject: reject });
            setTimeout(function () {
                if (_this.awaitingAck.has(messageId)) {
                    _this.awaitingAck.delete(messageId);
                    reject(new Error('ACK timeout'));
                }
            }, _this.ackTimeoutMs);
            (_this.ws || _this.socket).send(messageToSend);
        });
    };
    /**
     * Flushes the queued messages, sending them with an optional delay between each message. If sending a message fails,
     * it is re-queued for a later attempt. This method can control the rate at which messages are sent.
     *
     * @param {number} [delayMs=0] - The delay in milliseconds to wait after sending each message.
     * @returns {Promise<void>} A promise that resolves when all queued messages have been attempted to be sent.
     */
    LincSocket.prototype.flushQueue = function (delayMs) {
        if (delayMs === void 0) { delayMs = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(LincSocket.prototype, "readyState", {
        /**
         * Gets the current state of the WebSocket connection.
         * @returns {number} The current state of the WebSocket connection.
         */
        get: function () {
            if (this.ws) {
                return this.ws.readyState;
            }
            else if (this.socket) {
                return this.socket.readyState;
            }
            // Return a state representing closed if neither socket is initialized,
            // mirroring the WebSocket.CLOSED state
            return WebSocket.CLOSED; // 3; // WebSocket.CLOSED
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sends data through the WebSocket connection.
     * @param {TLincDataType} data - The data to send through the WebSocket connection.
     * @param dataType
     */
    LincSocket.prototype.send = function (data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if ((0, linc_platform_utils_1.isNode)()) {
                    this.ws.send(data);
                }
                else {
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(data);
                }
                return [2 /*return*/];
            });
        });
    };
    LincSocket.prototype.sendNewMessage = function (type, payload) {
        this.sendMessage(new linc_message_1.LincMessage(type, payload));
    };
    LincSocket.prototype.sendMessage = function (payload) {
        this.send(JSON.stringify(payload));
    };
    LincSocket.prototype.sendMsgDong = function () {
        this.dingDongCounter++;
        this.sendMessage({ type: linc_event_types_1.TLincServerEvent.Dong });
    };
    /**
     * Closes the WebSocket connection or connection attempt, if any.
     * If the connection is already CLOSED, this method does nothing.
     * @param {number} [code=1000] - A numeric value indicating the status code explaining why the connection is being closed.
     * @param {string} [reason=""] - A human-readable string explaining why the connection is closing.
     */
    LincSocket.prototype.close = function (code, reason) {
        var _a;
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ""; }
        linc_logger_1.log.debug("LincSocket :: close :: code ::", code, " :: reason ::", reason);
        if ((0, linc_platform_utils_1.isNode)()) {
            this.ws.close(code, reason);
        }
        else {
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close(code, reason);
        }
        this.handleReconnect();
    };
    //////////////////////////////////////////////////////////////////////////
    //
    // Event handlers
    //
    //////////////////////////////////////////////////////////////////////////
    LincSocket.prototype.addEventListener = function (eventType, listener) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(listener);
    };
    LincSocket.prototype.removeEventListener = function (eventType, listener) {
        if (!this.listeners[eventType])
            return;
        var index = this.listeners[eventType].indexOf(listener);
        if (index !== -1) {
            this.listeners[eventType].splice(index, 1);
        }
    };
    LincSocket.prototype.dispatchEvent = function (eventType, event) {
        if (!this.listeners[eventType])
            return;
        this.listeners[eventType].forEach(function (listener) {
            listener(event);
        });
    };
    return LincSocket;
}());
exports.LincSocket = LincSocket;
