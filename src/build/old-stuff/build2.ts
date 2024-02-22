/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import * as ts from 'typescript';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import chalk from 'chalk';

// Function to compile TypeScript code using the TypeScript Compiler API
function compileTypeScript() {
	const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
	const parsedCommandLine = ts.parseJsonConfigFileContent(
		configFile.config,
		ts.sys,
		'./'
	);

	let program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
	let emitResult = program.emit();

	let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	allDiagnostics.forEach(diagnostic => {
		if (diagnostic.file) {
			let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
			let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
			console.log(`${chalk.red(diagnostic.file.fileName)} (${line + 1},${character + 1}): ${chalk.yellow(message)}`);
		} else {
			console.log(chalk.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
		}
	});

	if (emitResult.emitSkipped) {
		console.log(chalk.bgRed('TypeScript compilation failed'));
		return false;
	}

	console.log(chalk.bgGreen('TypeScript compilation completed successfully'));
	return true;
}

// Function to bundle compiled code using Rollup
async function bundleCode() {
	const bundle = await rollup({
									input: './dist/main.js',
									plugins: [resolve(), commonjs()],
								});

	await bundle.write({
						   file: './build/bundle.js',
						   format: 'cjs',
					   });

	console.log(chalk.bgGreen('Bundling completed successfully'));
}

// Main build function
async function main() {
	if (compileTypeScript()) {
		await bundleCode();
	} else {
		console.error(chalk.bgRed('Build failed'));
	}
}

main().then(res => {
	console.log(chalk.bgGreen('Build completed successfully'));
}).catch(error => {
	console.error(chalk.bgRed(error.message));
});
