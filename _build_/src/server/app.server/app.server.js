"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtLincServer = exports.ChatPlugin = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const linc_server_1 = require("@server/linc.server");
const _linc_plugin_1 = require("@decorators/@linc.plugin");
const port = process.env.PORT || 8080;
// @ts-ignore
let ChatPlugin = class ChatPlugin {
    constructor() {
        console.log("ChatPlugin :: Constructor ***");
    }
    initialize(server) {
        return Promise.resolve(undefined);
    }
    onClose(event) {
        console.log("ChatPlugin :: onClose ***");
    }
    onError(event) {
        console.log("ChatPlugin :: onError ***");
    }
    onMessage(event) {
        console.log("ChatPlugin :: onMessage ***");
    }
    onOpen(event) {
        console.log("ChatPlugin :: onOpen ***");
    }
    onServerEvent(event) {
        console.log("ChatPlugin :: onServerEvent ***");
    }
};
ChatPlugin = __decorate([
    (0, _linc_plugin_1.LincPlugin)({}),
    __metadata("design:paramtypes", [])
], ChatPlugin);
exports.ChatPlugin = ChatPlugin;
class ExtLincServer extends linc_server_1.LincServer {
    constructor() {
        super();
        run(port);
        console.log("ExtLincServer :: Constructor ***");
    }
}
exports.ExtLincServer = ExtLincServer;
/**
 * Starts the server.
 *
 * @returns {Promise<void>}
 */
async function run(port) {
    const portNum = parseInt(port);
    //const portRes = await attemptToBindPort(portNum, true, { startPort: 9090, endPort: 9120});
    //console.log("Port Result ::", portRes);
    const server = tsyringe_1.container.resolve(linc_server_1.LincServer);
    server.usePlugin({
        initialize: async (server) => {
            console.log("ChatPlugin :: initialize ***");
        },
        onOpen: (event) => {
            console.log("::XREPO_ChatPlugin :: onOpen ***");
        },
        onMessage: (event) => {
            console.log("::XREPO_ChatPlugin :: onMessage ***");
        },
        onClose: (event) => {
            console.log("::XREPO_ChatPlugin :: onClose ***");
        },
        onError: (event) => {
            console.log("::XREPO_ChatPlugin :: onError ***");
        }
    });
    console.log("Plugins ::", server.plugIns);
    //const server = new ExtLincServer();
    await server.start();
}
run(port).catch(error => {
    console.log("Error starting server :::", error);
});
