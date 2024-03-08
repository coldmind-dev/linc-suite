/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export enum LincState {
	None         = -1000,
	Connecting   = 0,
	Open         = 1,
	Connected    = 1,
	Disconnected = -1,
	Closing      = 2,
	Closed       = 3,
	Terminated   = 110,
	ReConnecting = 120,
	Error        = 130
}

export type TLincState = LincState;
