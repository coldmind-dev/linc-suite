/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
export interface ILincMessage {
    type: string;
    payload?: string | any;
    id?: string;
    ref?: string;
    noAck?: boolean;
}
/**
 * Linc Message Object
 */
export declare class LincMessage implements ILincMessage {
    type: string;
    payload?: string | any;
    id?: string;
    ref?: string;
    noAck?: boolean;
    constructor(type: string, payload?: string | any, id?: string, ref?: string, noAck?: boolean);
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
    static create(type: string, payload?: string | any, id?: string, ref?: string, noAck?: boolean): ILincMessage;
    static serialize(): string;
    /**
     * Deserialize a JSON string to a LincMessage
     *
     * @param {string} json
     * @returns {ILincMessage}
     */
    static deserialize(json: string): ILincMessage;
}
