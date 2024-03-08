/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { IReconnectStrategy } from "@client/linc.reconnect-strategy";
export interface ILincConfig {
    url: string;
    protocols?: string | string[];
    jwtSecret?: string;
    reconnectStrategy?: IReconnectStrategy;
}
export declare class LincClientConfig implements ILincConfig {
    url: string;
    jwtSecret?: string;
    reconnectStrategy?: IReconnectStrategy;
    protocols?: string | string[];
    private messageQueue;
    constructor(url: string, jwtSecret?: string, reconnectStrategy?: IReconnectStrategy, protocols?: string | string[]);
    initReconnectStrategy(strategy?: IReconnectStrategy): void;
}
