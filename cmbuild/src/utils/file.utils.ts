/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import * as path                from "path";
import * as fs                  from "fs";
import { TFileFindResult }      from "../core/cm.file-find.type";
import { fileToString }         from "./cm.string-file";
import { TCMBuildFilenames }    from "../types/cm.filenames.const";
import { findTsConfigFilename } from "./tsconfig.finder";

/**
 * Synchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns boolean True if the path exists and is a file, false otherwise.
 */
export function cmFileExistsSync(...paths: string[]): boolean {
	try {
		const fullPath = path.join(...paths);
		const stats = fs.statSync(fullPath);
		return stats.isFile();
	} catch (error) {
		return false;
	}
}

/**
 * Asynchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns Promise<boolean> Resolves to true if the path exists and is a file, false otherwise.
 */
export async function cmFileExistsAsync(...paths: string[]): Promise<boolean> {
	try {
		const fullPath = path.join(...paths);
		const stats = await fs.promises.stat(fullPath);
		return stats.isFile();
	} catch (error) {
		return false;
	}
}

/**
 * Loads and parses the TypeScript configuration from the specified file path.
 *
 * @param filename
 * @param {string} startDir
 * @returns {TFileFindResult<T> | null}
 */
export function loadJsonConfig<T = any>(filename: string, startDir: string = process.cwd()): TFileFindResult<T> | null {
	let result: TFileFindResult<T> = null;

	try {
		result = findTsConfigFilename(startDir);

		console.log("findTsConfigFilename ----------- tsConfig ::", result);

		if (cmFileExistsSync(result.fullFilename)) {
			result.fileContent = JSON.parse(fileToString(result.fullFilename))
		}

		console.log("tsConfig ::", result);
	}
	catch (err) {
		console.error(`Error reading tsconfig.json: ${ err }`);
	}

	return result;
}

/**
 * Convenience function to grab the JSON file contents from the file find result
 *
 * @param {T} filename
 * @returns {T}
 */
export function grabConfig<T = any>(filename: TCMBuildFilenames | string): T {
	let result: T = null;

	try {
		result = loadJsonConfig(filename).fileContent;
	}
	catch (err) {
		console.error(`Error reading: ${TCMBuildFilenames[filename]}: ${ err }`);
		throw err;
	}

	return result;
}

