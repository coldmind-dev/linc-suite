/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-25
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

import * as fs from "fs";

/**
 * Reads the content of the file at the given path and returns it as a string.
 *
 * @param {string} filePath
 * @param {boolean} throws
 * @returns {string}
 */
export function fileToString(filePath: string, throws?: boolean): string {
	try {
		return fs.readFileSync(filePath, 'utf8');
	}
	catch (e) {
		if (throws) {
			throw e ?? new Error(`Could not read file: ${filePath}`);
		}
	}

	return "";
}

/**
 * Writes the given content to the file at the given path.
 *
 * @param {string} filePath
 * @param {string} content
 * @param {boolean} throws
 */
export function stringToFile(filePath: string, content: string, throws: boolean = true): void {
	try {
		fs.writeFileSync(filePath, content, 'utf8');
	}
	catch (e) {
		if (throws) {
			throw e ?? new Error(`Could not write file: ${filePath}`);
		}
	}
}
