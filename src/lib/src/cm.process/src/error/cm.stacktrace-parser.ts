/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-12
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

import { IStackFrame } from "./cm.error.types";

/**
 * Parses a stack trace into an array of custom stack frames.
 *
 * @param {string} stackTrace - The stack trace to parse.
 * @returns {IStackFrame[]} - An array of custom stack frames.
 */
export function parseStackTrace(stackTrace: string): IStackFrame[] {
	const stackFrames = stackTrace.split('\n').slice(1); // Skip the error message line.
	return stackFrames.map((frame) => {
		const frameParts = frame.match(/\s+at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) || [];
		const [_, functionName, fileName, lineNumber, columnNumber] = frameParts;
		return {
			functionName: functionName || 'anonymous',
			fileName: fileName || 'unknown',
			lineNumber: parseInt(lineNumber) || 0,
			columnNumber: parseInt(columnNumber) || 0,
		};
	});
}
