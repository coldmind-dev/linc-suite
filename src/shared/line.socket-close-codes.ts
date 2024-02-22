/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The software is provided "as is", without warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a
 * particular purpose and noninfringement. In no event shall the authors or copyright
 * holders be liable for any claim, damages or other liability, whether in an action of
 * contract, tort or otherwise, arising from, out of or in connection with the software
 * or the use or other dealings in the software.
 */

export enum WebSocketCloseCode {
	NormalClosure           = 1000,
	GoingAway               = 1001,
	ProtocolError           = 1002,
	UnsupportedData         = 1003,
	NoStatusReceived        = 1005,
	AbnormalClosure         = 1006,
	InvalidFramePayloadData = 1007,
	PolicyViolation         = 1008,
	MessageTooBig           = 1009,
	MissingExtension        = 1010,
	InternalServerError     = 1011,
	TLSHandshake            = 1015,
	// Custom close codes (3000-3999 range is reserved for use by libraries, frameworks, and applications)
	ConnectionLost          = 3000,
	ReconnectTimedOut       = 3001,
	CustomCode1             = 3002, // Reserved for future use
	CustomCode2             = 3003, // Reserved for future use
	CustomCode3             = 3004, // Reserved for future use
	CustomCode4             = 3005  // Reserved for future use
}

//
// Add a property to customize non-reconnectable close codes
//
export const nonReConnectableCodes: Set<number> = new Set(
	[
		WebSocketCloseCode.NormalClosure, // Normal closure
		WebSocketCloseCode.UnsupportedData, // Unsupported data
		WebSocketCloseCode.PolicyViolation, // Policy violation
		WebSocketCloseCode.MessageTooBig, // Message too big
		WebSocketCloseCode.InternalServerError, // Internal server error
		4000, // Example custom code for "Do not reconnect"
	]);
