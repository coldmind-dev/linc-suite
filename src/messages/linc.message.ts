/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { fromJson }     from "@shared/helpers/json-parser.helper";
import { newMsgId }     from "@shared/linc.message.utils";

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
export class LincMessage implements ILincMessage {
	constructor(
		public type: string,
		public payload?: string | any,
		public id?: string,
		public ref?: string,
		public noAck?: boolean
	) {
		this.id = id || newMsgId();
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
	public static create(
		type: string,
		payload?: string | any,
		id?: string,
		ref?: string,
		noAck?: boolean
	): ILincMessage {
		return new LincMessage(type, payload, id, ref, noAck);
	}

	public static serialize(): string {
		return JSON.stringify(this);
	}

	/**
	 * Deserialize a JSON string to a LincMessage
	 *
	 * @param {string} json
	 * @returns {ILincMessage}
	 */
	public static deserialize(json: string): ILincMessage {
		return fromJson<ILincMessage>(json)
	}
}
