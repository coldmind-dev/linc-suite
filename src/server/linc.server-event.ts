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
import { TId } from "@server/link.server.type";

export interface ILincServerEvent<T = any> {
	type: TId;
	payload: T
}

export const LINC_EVENT = {
	4001: {
		msg: 'Closed due to inactivity'
	},
	1008: {
		msg: `Connection Limit Reached`
	},
	1003: {
		msg: `Invalid Message Format`
	}
}

export const LincEventName = (code: number): string => {
	return LincEventType[ code ];
}

export enum LincEventType {
	Unknown                = -1,
	UnhandledException     = -10,
	NewConnection          = 10,
	Close                  = 20,
	ClosedDueToInactivity  = 4001,
	Message                = 30,
	Error                  = 40,
	Warning                = 50,
	Info                   = 60,
	ConnectionLimitReached = 1008,
	InvalidMessageFormat   = 1003
}

export type TServerEvent = LincEventType;

/**
 * Data model for server events
 */
export class LincServerEvent<T = any> implements ILincServerEvent {
	type: TId;
	payload: T;

	constructor(type: TId, payload: any) {
		this.type    = type;
		this.payload = payload;
	}

	static fromCode(event: TId, payload?: any): LincServerEvent {
		return new LincServerEvent(event, payload);
	}

	public static fromError(error: Error): ILincServerEvent<any> {
		return new LincServerEvent(LincEventType.UnhandledException, error);
	}
}
