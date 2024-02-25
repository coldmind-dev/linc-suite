/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-24
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


import * as path        from "path";
import * as fs          from "fs";
import { ITSConfig }      from "@lib/cm.tslang/tsconfig.type";
import { loadJsonConfig } from "@lib/cm.tslang/tsconfig.finder";

/**
 * Searches for the tsconfig.json file starting from the given directory.
 * If not found, it moves to the parent directory and repeats the search
 * until the root of the filesystem is reached.
 *
 * @param startDir The starting directory for the search.
 * @returns The path to the tsconfig.json file if found, otherwise null.
 */
const { execSync } = require('child_process');

/**
 * Executes a shell command and returns its output as a string.
 * @param {string} cmd - The command to execute.
 * @returns {string} - The stdout from the executed command.
 */
function exec(cmd) {
	try {
		return execSync(cmd, { stdio: 'pipe' }).toString().trim();
	} catch (error) {
		console.error(`Error executing command '${cmd}': ${error}`);
		process.exit(1);
	}
}


export function getTSConfig(dir: string = process.cwd()): ITSConfig | null {
	let config: ITSConfig = {};



	return null;
}

/**
 * Reads the TypeScript configuration to determine the output directory.
 * @returns {string} The output directory as specified in tsconfig.json.
 */
export function getOutDir(defaultValue?: string): string | null {
	const tsConfig = loadJsonConfig();
	return tsConfig.compilerOptions?.outDir ?? defaultValue;
}

/**
 * Copies template files to the output directory and updates version in config files.
 * @param {string} version - The current version of the package.
 */
function prepareDist(version) {
	const outDir = getOutDir();
	const templateDir = path.resolve(__dirname, '../template');

	// Ensure output directory exists
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	// Copy template files
	fs.readdirSync(templateDir).forEach(file => {
		const srcPath = path.join(templateDir, file);
		const destPath = path.join(outDir, file);
		fs.copyFileSync(srcPath, destPath);
		console.log(`Copied ${file} to ${outDir}.`);
	});

	// Update version in a specific config file as an example
	const configPath = path.join(outDir, 'config.json');
	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		config.version = version;
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		console.log(`Updated version in config.json to ${version}.`);
	}
}

/**
 * Main function to orchestrate version bumping, building, and preparing the output directory.
 * @param {string} versionType - The type of version bump (patch, minor, major).
 */
async function main(versionType) {
	// Bump version and capture the new version number
	console.log(`Bumping version: ${versionType}`);
	const version = exec(`npm version ${versionType} --no-git-tag-version`);
	console.log(`New version: ${version}`);

	// Build the project
	console.log('Building project...');
	exec('npm run build');

	// Prepare the output directory
	console.log('Preparing output directory...');
	prepareDist(version);

	console.log('Build and release preparation complete.');
}
