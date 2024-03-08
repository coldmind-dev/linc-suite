/**
 * Coldmind Graphmin - net
 *
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/graphmin/
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @time 21:12
 * @date 2024-02-15
 *
 * Copyright (c) 2024 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { TId } from "@server/link.server.types";
export interface ILincServerEvent<T = any> {
    type: TId;
    payload: T;
}
export declare const LINC_EVENT: {
    4001: {
        msg: string;
    };
    1008: {
        msg: string;
    };
    1003: {
        msg: string;
    };
};
export declare const LincEventName: (code: number) => string;
export declare enum LincEventType {
    Unknown = -1,
    UnhandledException = -10,
    NewConnection = 10,
    Close = 20,
    ClosedDueToInactivity = 4001,
    Message = 30,
    Error = 40,
    Warning = 50,
    Info = 60,
    ConnectionLimitReached = 1008,
    InvalidMessageFormat = 1003
}
export declare type TServerEvent = LincEventType;
/**
 * Data model for server events
 */
export declare class LincServerEvent<T = any> implements ILincServerEvent {
    type: TId;
    payload: T;
    constructor(type: TId, payload: any);
    static fromCode(event: TId, payload?: any): LincServerEvent;
    static fromError(error: Error): ILincServerEvent<any>;
}
