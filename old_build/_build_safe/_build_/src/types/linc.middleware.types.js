"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
var ws_1 = require("ws");
Object.defineProperty(exports, "WebSocketServer", { enumerable: true, get: function () { return ws_1.WebSocketServer; } });
/*/ Middleware type for processing messages
export type aaaTMiddleware<T> = (
    data: ILincMessage,
    context: {
        clientInfo: ClientInfo;
        connections: Map<WebSocket, ClientInfo>;
    },
    server: WebSocketServer,
    next: (error?: Error) => void
) => void | Promise<void>;
*/
