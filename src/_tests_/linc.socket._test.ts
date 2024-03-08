/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

const globalAny: any = global;

import { LincSocket } from "@shared/linc.socket";

describe('LincSocket', () => {
	let mockWebSocket: any;
	let socket: LincSocket;

	beforeEach(() => {
		mockWebSocket = {
			send: jest.fn(),
			close: jest.fn(),
			addEvlentListener: jest.fn(),
			removeEventListener: jest.fn()
		};
	//	global.WebSocket = jest.fn(() => mockWebSocket) as any;

		const socket = new LincSocket('ws://test');
	});

	test('should establish a connection', () => {
		socket.connect();
		expect(globalAny.WebSocket).toHaveBeenCalledWith('ws://test');
	});

	test('should send a message', () => {
		const message = { type: 'test', payload: 'hello' };

		socket.connect();
		socket.send(JSON.stringify(message));
		expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
	});

	test('should handle incoming messages', done => {
		const testMessage = { type: 'test', payload: 'world' };

		//socket.onMessage = jest.fn((data) => {
			//expect(.data).toEqual(testMessage);
			//done();
		//});

		socket.connect();
		mockWebSocket.onmessage({ data: JSON.stringify(testMessage) });
	});

	test('should close the connection', () => {
		socket.connect();
		socket.close();
		expect(mockWebSocket.close).toHaveBeenCalled();
	});
});
