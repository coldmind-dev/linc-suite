/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ILincMessage }               from "@msg/linc.message";
import { LincMessage }                from "@msg/linc.message";
import { log }                        from "@shared/linc.logger";
import { newMsgId }                   from "@shared/linc.message.utils";
import { IReconnectStrategy }         from "@client/linc.reconnect-strategy";
import { DEFAULT_RECONNECT_STRATEGY } from "@client/linc.reconnect-strategy";
import { nonReConnectableCodes }      from "@shared/line.socket-close-codes";
import { WebSocketCloseCode }         from "@shared/line.socket-close-codes";
import { TLincDataType }              from "@shared/linc.event.types";
import { TCloseEvent }                from "@shared/linc.event.types";
import { TReconnectEvent }            from "@shared/linc.event.types";
import { TMsgEvent }                  from "@shared/linc.event.types";
import { TLincServerEvent }           from "@shared/linc.event.types";
import { TSocketError }               from "@shared/linc.event.types";
import { isNode }                     from "@root/linc.global";
import { ILincSocket }                from "@shared/linc.socket.type";
import { LincState }                  from "@root/types/linc.state.types";
import { TQueuedMessage }             from "@shared/linc.queued-message";
import { QueuedMessage }              from "@shared/linc.queued-message";
import { CMArray }                    from "@lib/cm.common/cm.array";

// TODO: Move to separate file

export interface IQueuedMessage {
	data: string;
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
}

export type ILincMsgId = string;
//export type TQueuedMessage = { data: ILincMessage, resolve: Function, reject: Function };
export type TMessageAck = { resolve: Function, reject: Function };

export class LincSocket implements ILincSocket {
	private f_prevState: LincState = LincState.Closed;
	private f_state: LincState     = LincState.Closed;

	private socket: WebSocket | undefined;
	private ws: any;

	private awaitingAck: Map<ILincMsgId, TMessageAck> = new Map();
	private messageQueue: CMArray<TQueuedMessage>     = new CMArray();
	public queueMessages: boolean                     = true;
	private ackTimeoutMs: number                      = 10000; // 10 seconds for ACK timeout
	private dingDongCounter: number                   = 0;

	private reconnectStrategy?: IReconnectStrategy;
	private autoReconnect?: boolean;
	private reconnectAttempts            = 0;
	private maxReconnectAttempts: number = 10;

	private emitErrors: boolean = false;

	private listeners: { [ key: string ]: ( (...args: any[]) => void )[] } = {};
	/**
	 * Initializes a new instance of the UniversalWebSocket class.
	 * @param {string} url - The URL to which to connect; this should be the URL to which the WebSocket server will respond.
	 * @param {string | string[]} [protocols] - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified protocol).
	 */
	constructor(
		public url?: string,
		public protocols?: string | string[]
	) {
		this.initReconnectStrategy();
	}

	//////////////////////////////////////////////////////////////////////////
	//
	// Event handlers
	//
	//////////////////////////////////////////////////////////////////////////
	public onOpen?: () => void;
	public onMessage?: (event: TMsgEvent) => void;
	public onError?: (event: TSocketError) => void;
	public onClose?: (event: TCloseEvent) => void;
	public onReconnect?: (event: TReconnectEvent) => void;

	public isOpen(): boolean {
		return this.socket && this.socket.readyState === WebSocket.OPEN;
	}

	/**
	 * Trigger a new reconnect event, if assigned
	 *
	 * @param {number} attempt
	 * @param {number} maxAttempts
	 * @param {number} interval
	 */
	triggerReconnectEvent(attempt?: number): void {
		log.debug("[EVENT] triggerReconnectEvent :: attempt ::", attempt);

		if (this.onReconnect) {
			this.onReconnect(
				{
					attempt: attempt,
				}
			);
		}
	}

	//
	// State
	//
	get prevState(): LincState {
		return this.f_prevState;
	}

	get state(): LincState {
		return this.f_state;
	}

	set state(newState: LincState) {
		this.f_prevState = this.f_state;
		this.f_state     = newState;
	}

	/**
	 * Properly dispose the current WebSocket instance
	 * @private
	 */
	private cleanup(): void {
		if (this.ws) {
			this.ws.terminate();
			this.ws = undefined;
		}
		else if (this.socket) {
			this.socket.close();
			this.socket = undefined;
		}
	}

	private initialize(): void {
		if (typeof WebSocket !== 'undefined') {
			this.socket = new WebSocket(this.url);
		}
		else {
			const WebSocketNode = require('ws');
			this.ws             = new WebSocketNode(this.url);
		}

		this.setupEventHandlers();
	}

	/**
	 * Initializes the reconnect strategy with the specified options.
	 *
	 * @param {IReconnectStrategy} strategy
	 */
	initReconnectStrategy(
		strategy?: IReconnectStrategy
	) {
		if ( !strategy) {
			strategy = DEFAULT_RECONNECT_STRATEGY;
		}

		strategy.reconnectDecay       = strategy.reconnectDecay || DEFAULT_RECONNECT_STRATEGY.reconnectDecay;
		strategy.jitter               = strategy.jitter || DEFAULT_RECONNECT_STRATEGY.jitter;
		strategy.reconnectAttempts    = strategy.reconnectAttempts || Infinity;
		strategy.shouldReconnect      = strategy.shouldReconnect || DEFAULT_RECONNECT_STRATEGY.shouldReconnect;
		strategy.reconnectInterval    = strategy.reconnectInterval || DEFAULT_RECONNECT_STRATEGY.reconnectInterval;
		strategy.maxReconnectInterval = strategy.maxReconnectInterval || DEFAULT_RECONNECT_STRATEGY.maxReconnectInterval;

		this.reconnectStrategy    = strategy;
		this.autoReconnect        = strategy.shouldReconnect;
		this.maxReconnectAttempts = strategy.reconnectAttempts;
	}

	public resetSocket(): void {
		this.cleanup();
		this.initialize();
	}

	public connect(): void {
		this.resetSocket();
	}

	private setupEventHandlers(): void {
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
	private setupNodeEvents(): void {
		if ( !this.ws) return;

		this.ws.on(TLincServerEvent.OPEN, () => {
			if (this.onOpen) this.onOpen();
		});

		this.ws.on(TLincServerEvent.MESSAGE, (data: TMsgEvent) => this.handleMessage(data));

		this.ws.on(TLincServerEvent.ERROR, (error: any) => {
			if (this.onError) {
				this.onError(
					{ error, message: error.message, type: 'error', target: this.ws }
				);
			}
		});

		this.ws.on(TLincServerEvent.CLOSE, (closeCode: number, closeReason: string) => {
			const closeEvent: TCloseEvent = { code: closeCode, reason: closeReason };
			this.handleClose(closeEvent)
		});
	}

	private triggerErrorEvent(event: Event): void {
	}

	/**
	 * Sets up event listeners for the WebSocket in browser environments.
	 * This method is called only in browser environments.
	 */
	private setupBrowserEvents(): void {
		if ( !this.socket) return;

		this.socket.onopen = () => {
			this.state = LincState.Open;
			if (this.onOpen) this.onOpen();
		};

		this.socket.onmessage = (event: MessageEvent) => this.handleMessage(event);

		this.socket.onerror = (event: Event) => {
			if (this.onError) {
				this.onError(
					{
						error  : new Error('WebSocket error'),
						message: 'WebSocket error',
						type   : 'error',
						target : event
					});
			}
		};

		this.socket.onclose = (event: TCloseEvent) => {
			this.state = LincState.Closed;
			this.handleClose(event);
		};
	}

	private getReconnectStrategy(): IReconnectStrategy {
		return this.reconnectStrategy ?? DEFAULT_RECONNECT_STRATEGY;
	}

	/**
	 * Determines if a reconnection should be attempted based on the close code.
	 * @param closeCode - The close code from the WebSocket close event.
	 * @returns {boolean} Whether a reconnection should be attempted.
	 */
	private shouldAttemptReconnect(closeCode?: number): boolean {
		closeCode      = closeCode || WebSocketCloseCode.NormalClosure;
		const strategy = this.getReconnectStrategy();
		return !nonReConnectableCodes.has(closeCode) &&
			   strategy.shouldReconnect &&
			   this.reconnectAttempts < strategy.reconnectAttempts;
	}

	private handleReconnection(event: TCloseEvent): void {
		if ( !this.shouldAttemptReconnect(event.code)) {
			log.debug(`Reconnect not attempted, close code: ${ event.code }`);
			return;
		}

		let delay = this.calculateReconnectDelay();

		setTimeout(() => {
			log.debug(`Attempting to reconnect, attempt: ${ this.reconnectAttempts + 1 }`);
			this.reconnectAttempts++;

			this.triggerReconnectEvent(
				this.reconnectAttempts
			);

			this.resetSocket();

		}, delay);
	}

	/**
	 * Calculates the delay before attempting a reconnection, applying exponential backoff and jitter.
	 * @returns {number} The calculated delay in milliseconds.
	 */
	private calculateReconnectDelay(): number {
		const strategy = this.getReconnectStrategy();
		let delay      = strategy.reconnectInterval * Math.pow(strategy.reconnectDecay, this.reconnectAttempts);
		delay          = Math.min(delay, strategy.maxReconnectInterval ?? Infinity);
		delay += ( Math.random() * 2 - 1 ) * strategy.jitter * delay;
		return delay;
	}

	/**
	 * Handle close evenr
	 * @param {TCloseEvent} eventw
	 */
	handleClose(event: TCloseEvent): void {
		log.debug("handleClose :: code ::", event.code, " :: reason ::", event.reason);
		const reconnect = this.reconnectStrategy?.shouldReconnect;

		if ( !reconnect) {
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
	handleError(event: any): void {
		console.log("handleError :: event ::", event);
	}

	parseWebSocketMessage(message: any): any {
		let data: string;

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
	handleMessage(event: any): void {
		let jsonObj: any = event;

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
			this.awaitingAck.get(jsonObj.id)!.resolve();
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
	private handleReconnect(): void {
		console.log("handleReconnect :: autoReconnect ::", this.autoReconnect);
		let proceedReconnect = true;

		const interval = ( this.reconnectStrategy?.reconnectInterval ?? 1000 ) * Math.pow(2, this.reconnectAttempts)

		if (this.autoReconnect || proceedReconnect) {
			setTimeout(() => {
				log.info(`Attempting to reconnect... Attempt ${ this.reconnectAttempts + 1 }`);
				this.cleanup(); // Cleanup before attempting to reconnect
				this.initialize(); // Reinitialize WebSocket connection
			}, interval);

			this.reconnectAttempts++;
		}
	}

	async sendAwait(data: string): Promise<unknown> {
		if (this.readyState === WebSocket.OPEN) {
			return this.directSend(data);
		}
		else if (this.queueMessages) {
			return new Promise((resolve, reject) => this.messageQueue.add(
				new QueuedMessage(data, resolve, reject)
			));
		}
		else {
			return Promise.reject(
				new Error("WebSocket not open and queuing disabled.")
			);
		}
	}

	private directSend(data: TLincDataType): Promise<void> {
		return new Promise((resolve, reject) => {
			const messageId     = newMsgId();
			const messageToSend = JSON.stringify({ messageId, data });

			this.awaitingAck.set(messageId, { resolve, reject });

			setTimeout(() => {
				if (this.awaitingAck.has(messageId)) {
					this.awaitingAck.delete(messageId);
					reject(new Error('ACK timeout'));
				}
			}, this.ackTimeoutMs);

			( this.ws || this.socket ).send(messageToSend);
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
	async flushQueue(delayMs: number = 100): Promise<void> {
		const sendFunction = async (messageData: IQueuedMessage) => {
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
	get readyState(): number {
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
	async send(data: any): Promise<any> {
		if (isNode) {
			this.ws.send(data);
		}
		else {
			this.socket?.send(data);
		}
	}

	sendNewMessage(type: string, payload: any): void {
		this.sendMessage(
			new LincMessage(
				type,
				payload
			)
		)
	}

	sendMessage(payload: ILincMessage): void {
		const msg = JSON.stringify(payload);
		this.send(msg);
	}

	sendMsgDong(): void {
		this.dingDongCounter++;
		this.sendMessage({ type: TLincServerEvent.Dong });
	}

	/**
	 * Closes the WebSocket connection or connection attempt, if any.
	 * If the connection is already CLOSED, this method does nothing.
	 * @param {number} [code=1000] - A numeric value indicating the status code explaining why the connection is being closed.
	 * @param {string} [reason=""] - A human-readable string explaining why the connection is closing.
	 */
	close(code: number = 1000, reason: string = ""): void {
		log.debug("LincSocket :: close :: code ::", code, " :: reason ::", reason);

		if (isNode) {
			this.ws.close(code, reason);
		}
		else {
			this.socket?.close(code, reason);
		}

		this.handleReconnect()
	}

	//////////////////////////////////////////////////////////////////////////
	//
	// Event handlers
	//
	//////////////////////////////////////////////////////////////////////////
	addEventListener(eventType: string, listener: (...args: any[]) => void): void {
		if ( !this.listeners[ eventType ]) {
			this.listeners[ eventType ] = [];
		}
		this.listeners[ eventType ].push(listener);
	}

	removeEventListener(eventType: string, listener: (...args: any[]) => void): void {
		if ( !this.listeners[ eventType ]) return;

		const index = this.listeners[ eventType ].indexOf(listener);
		if (index !== -1) {
			this.listeners[ eventType ].splice(index, 1);
		}
	}

	dispatchEvent(eventType: string, event: any): void {
		if ( !this.listeners[ eventType ]) return;

		this.listeners[ eventType ].forEach((listener) => {
			listener(event);
		});
	}
}
