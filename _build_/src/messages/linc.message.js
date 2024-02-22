"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincMessage = void 0;
const json_parser_helper_1 = require("@shared/helpers/json-parser.helper");
const linc_message_utils_1 = require("@root/shared/linc.message.utils");
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
        this.id = id || (0, linc_message_utils_1.newMsgId)();
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
        return (0, json_parser_helper_1.fromJson)(json);
    }
}
exports.LincMessage = LincMessage;
