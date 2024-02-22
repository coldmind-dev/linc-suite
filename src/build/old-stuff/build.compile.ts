/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-20
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

import * as ts   from 'typescript';
import * as path from 'path';
import * as fs   from 'fs';

export async function compileTypescript(tsConfigPath: string): Promise<void> {
	// Read and parse the configuration file
	const configFileText = fs.readFileSync(tsConfigPath, 'utf8');
	const result         = ts.parseConfigFileTextToJson(tsConfigPath, configFileText);
	if (result.error) {
		throw new Error(`Error parsing tsconfig.json: ${ result.error.messageText }`);
	}

	// Prepare the ParseConfigHost
	const parseConfigHost: ts.ParseConfigHost = {
		useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
		readDirectory            : ts.sys.readDirectory,
		fileExists               : ts.sys.fileExists,
		readFile                 : ts.sys.readFile,
		getCurrentDirectory      : ts.sys.getCurrentDirectory,
	};

	// Parse json config to compiler options
	const parsedCommandLine = ts.parseJsonConfigFileContent(result.config, parseConfigHost, path.dirname(tsConfigPath));
	if (parsedCommandLine.errors.length > 0) {
		parsedCommandLine.errors.forEach(error => {
			console.error("TSConfig Error:", error.messageText);
		});
		throw new Error(`Failed to parse tsconfig.json`);
	}

	// Create the program
	const program    = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
	const emitResult = program.emit();

	// Process and log diagnostics
	const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
	allDiagnostics.forEach(diagnostic => {
		const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
		if (diagnostic.file) {
			const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
			console.log(`${ diagnostic.file.fileName } (${ line + 1 },${ character + 1 }): ${ message }`);
		}
		else {
			console.log(message);
		}
	});

	// Check if the emit was successful
	if (emitResult.emitSkipped) {
		throw new Error('TypeScript compilation failed');
	}
}
