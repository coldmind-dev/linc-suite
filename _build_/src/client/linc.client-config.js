"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincClientConfig = void 0;
const linc_reconnect_strategy_1 = require("@client/linc.reconnect-strategy");
class LincClientConfig {
    constructor(url, jwtSecret, reconnectStrategy, protocols) {
        this.url = url;
        this.jwtSecret = jwtSecret;
        this.reconnectStrategy = reconnectStrategy;
        this.protocols = protocols;
        this.messageQueue = [];
        this.initReconnectStrategy(reconnectStrategy);
        this.messageQueue = [];
    }
    initReconnectStrategy(strategy) {
        this.reconnectStrategy = { ...linc_reconnect_strategy_1.DEFAULT_RECONNECT_STRATEGY, ...strategy };
    }
}
exports.LincClientConfig = LincClientConfig;
