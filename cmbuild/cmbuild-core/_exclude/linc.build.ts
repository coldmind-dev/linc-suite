/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-09
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

import * as ts     from 'typescript';
import { rollup }  from 'rollup';
import commonjs    from '@rollup/plugin-commonjs';
import resolve     from '@rollup/plugin-node-resolve';
import { Program } from "typescript";

// Function to compile TypeScript code using the TypeScript Compiler API
export function compileTypeScript() {
	// Load your tsconfig.json file
	const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
	const parsedCommandLine = ts.parseJsonConfigFileContent(
		configFile.config,
		ts.sys,
		'./'
	);

	// Compile the project
	const program: Program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);

	for (let sourceFile of program.getSourceFiles()) {
		if (!sourceFile.isDeclarationFile) {
			console.log('Compiling', sourceFile.fileName);
		}
	}



	const emitResult = program.emit();

	// Check for and report compiler errors
	const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	allDiagnostics.forEach(diagnostic => {
		if (diagnostic.file) {
			let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
			let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
			console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
		} else {
			console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
		}
	});

	if (emitResult.emitSkipped) {
		console.log('TypeScript compilation failed');
		return false;
	}

	console.log('TypeScript compilation completed successfully');
	return true;
}

// Function to bundle compiled code using Rollup
async function bundleCode() {
	// Assuming you have a rollup.config.js or you can define your config here
	const bundle = await rollup({
									input: './dist/main.js', // Adjust based on your output directory from TypeScript
									plugins: [resolve(), commonjs()],
								});

	await bundle.write({
						   file: './cmbuild-core/bundle.js',
						   format: 'cjs',
					   });

	console.log('Bundling completed successfully');
}

// Main cmbuild-core function
async function main() {
	if (compileTypeScript()) {
		await bundleCode();
	} else {
		console.error('Build failed');
	}
}

main().catch(console.error);

/*
let tw = new CMCliTextWriter();

cp kalle = `
			<icon="star" />
			<color="yellow">
			Hello
			</color>
			<color="red">
			World
			</color>
			<br />
`;
tw.write(kalle);

//Create a "StripeService" something like constructor(settings: IStripeSettings)
interface IStripeSettings {
	apiKey: string;
	successUrl: string;
	redirectUrl: string;
	cancelUrl: string;
}

apiKey: string) ,
*/
