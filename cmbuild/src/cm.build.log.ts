/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-26
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
/*
class MarkupChalk {
	private static parseMarkup(text: string): string {
		const tagRegex = /<([a-z]+|\/[a-z]+|color hex="#[0-9A-Fa-f]{6}")>(.*?)<\/\1>|<([a-z]+|color hex="#[0-9A-Fa-f]{6}")>([^<]+)$/g;
		let match: RegExpExecArray | null;3

		while ((match = tagRegex.exec(text)) !== null) {
			if (match.index === tagRegex.lastIndex) {
				tagRegex.lastIndex++;
			}

			const fullMatch = match[0];
			const tag = match[1] || match[3];
			const content = match[2] || match[4];
			text = text.replace(fullMatch, this.applyStyle(tag, content));
		}

		return text;
	}

	private static applyStyle(tag: string, content: string): string {
		let styleFunction: chalk.Chalk = chalk;

		if (tag.startsWith('color hex="')) {
			const colorHex = tag.match(/"#([0-9A-Fa-f]{6})"/)![1];
			styleFunction = chalk.hex(colorHex);
		} else {
			// Handling predefined chalk colors and styles
			const styleMap: { [key: string]: (text: string) => string } = {
				black: chalk.black,
				red: chalk.red,
				green: chalk.green,
				yellow: chalk.yellow,
				blue: chalk.blue,
				magenta: chalk.magenta,
				cyan: chalk.cyan,
				white: chalk.white,
				gray: chalk.gray,
				grey: chalk.grey,
				blackBright: chalk.blackBright,
				redBright: chalk.redBright,
				greenBright: chalk.greenBright,
				yellowBright: chalk.yellowBright,
				blueBright: chalk.blueBright,
				magentaBright: chalk.magentaBright,
				cyanBright: chalk.cyanBright,
				whiteBright: chalk.whiteBright,
				// Styles
				bold: chalk.bold,
				dim: chalk.dim,
				italic: chalk.italic,
				underline: chalk.underline,
				inverse: chalk.inverse,
				hidden: chalk.hidden,
				strikethrough: chalk.strikethrough,
				// Additional styles can be added here
			};

			const styleFunctionOrDefault = styleMap[tag] || ((text: string) => text);
			return styleFunctionOrDefault(content);
		}

		return styleFunction(content);
	}

	public static styledText(text: string): string {
		return this.parseMarkup(text);
	}
}

// Usage
console.log(MarkupChalk.styledText('hello <blue>toto<b>oijoij</b> lalala</blue>: <color hex="#f4f4f4">Custom</color>pokdsf'));


*/


export class CmLogger {
	constructor() {
	}
}

class AnsiStyledText {
	private static styles: { [key: string]: string } = {
		// Styles
		bold: "\u001b[1m",
		dim: "\u001b[2m",
		italic: "\u001b[3m",
		u: "\u001b[4m",
		inverse: "\u001b[7m",
		hidden: "\u001b[8m",
		strikethrough: "\u001b[9m",
		// Reset
		reset: "\u001b[0m",
		// Foreground Colors
		black: "\u001b[30m",
		red: "\u001b[31m",
		green: "\u001b[32m",
		yellow: "\u001b[33m",
		blue: "\u001b[34m",
		magenta: "\u001b[35m",
		cyan: "\u001b[36m",
		white: "\u001b[37m",
		gray: "\u001b[90m",
		// Background Colors
		bgBlack: "\u001b[40m",
		bgRed: "\u001b[41m",
		bgGreen: "\u001b[42m",
		bgYellow: "\u001b[43m",
		bgBlue: "\u001b[44m",
		bgMagenta: "\u001b[45m",
		bgCyan: "\u001b[46m",
		bgWhite: "\u001b[47m",
	};

	private static parseMarkup(text: string): string {
		const regex = /<(\w+)>(.*?)<\/\1>/g;
		let result = text;

		let match: RegExpExecArray | null;
		while ((match = regex.exec(text)) !== null) {
			const [fullMatch, style, content] = match;
			if (this.styles[style]) {
				result = result.replace(fullMatch, `${this.styles[style]}${content}${this.styles.reset}`);
			}
		}

		return result;
	}

	public static styledText(text: string): string {
		return this.parseMarkup(text);
	}
}


export function xtLog(...args: any[]): void {
	console.log(AnsiStyledText.styledText(args.join(" ")));
}
