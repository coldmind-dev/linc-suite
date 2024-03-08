/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-03-07
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

export type CommentPattern = {
	blockStart?: string;
	blockEnd?: string;
	lineComment?: string;
}

export function removeComments(code: string, patterns: CommentPattern[] = ['']): string {
	let result = '';
	let inString: boolean | string = false;
	let escape = false;
	let commentType: null | 'block' | 'line' = null;
	let commentPatternIndex: number = -1;

	for (let i = 0; i < code.length; i++) {
		const currentChar = code[i];
		const nextChar = code[i + 1];

		// Handle escape characters
		if (inString && currentChar === '\\') {
			escape = !escape;
			result += currentChar;
			continue;
		} else if (inString && !escape && (currentChar === inString)) {
			inString = false;
			result += currentChar;
			continue;
		} else {
			escape = false;
		}

		if (!inString && commentType === null) {
			// Check for start of comment
			for (let j = 0; j < patterns.length; j++) {
				const pattern = patterns[j];
				if (pattern.lineComment && code.startsWith(pattern.lineComment, i)) {
					commentType = 'line';
					commentPatternIndex = j;
					break;
				} else if (pattern.blockStart && code.startsWith(pattern.blockStart, i)) {
					commentType = 'block';
					commentPatternIndex = j;
					break;
				}
			}
		}

		if (commentType === 'block' && patterns[commentPatternIndex].blockEnd && code.startsWith(patterns[commentPatternIndex].blockEnd, i)) {
			i += patterns[commentPatternIndex].blockEnd.length - 1; // Adjust for loop increment
			commentType = null;
			commentPatternIndex = -1;
			continue;
		} else if (commentType === 'line' && currentChar === '\n') {
			commentType = null;
			commentPatternIndex = -1;
		}

		if (commentType !== null) continue; // Skip adding comment content

		if (!inString && (currentChar === '"' || currentChar === "'")) {
			inString = currentChar;
		}

		if (commentType === null) {
			result += currentChar;
		}
	}

	return result;
}
