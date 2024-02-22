/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-04
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

// WE rewrite this import { v4 as uuidv4 } from 'uuid';
// as a require instead so that we can check if the package is installed or not
// if not we warn and replace it with vanilla typescript of more simple nature

export let uuidv4: any;

try {
	uuidv4 = require('uuid').v4;

} catch (e) {
	console.error('uuid package not found, using a simple message id generator instead');
	uuidv4 = () => {
		return Math.random().toString(36).substring(2);
	};
}

/**
 * Generates a unique message ID using the uuid library.
 * @returns {string} A unique message ID.
 */
export function newMsgId(): string {
	return uuidv4();
}
