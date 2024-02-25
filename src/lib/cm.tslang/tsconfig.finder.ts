/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { fileToString }      from "@lib/cm.io/cm.string-file";
import { TFileFindResult }   from "@lib/cm.io/cm.file-find.type";
import { findFileUp }        from "@lib/cm.io/cm.file-find-up";
import { cmFileExistsSync }  from "@lib/cm.io/files/file.utils";
import { TCMBuildFilenames } from "../../../cmbuild/cmbuild-core/types/cm.filenames.const";

/**
 * Searches for the tsconfig.json file starting from the given directory.
 * If not found, it moves to the parent directory and repeats the search
 * until the root of the filesystem is reached.
 *
 * @param startDir The starting directory for the search.
 * @param filename
 * @returns The path to the tsconfig.json file if found, otherwise null.
 */
export function findTsConfigFilename(startDir: string = process.cwd()): TFileFindResult {
	let config: TFileFindResult = null;

	try {
		config = findFileUp(startDir, 'tsconfig.json');

	}
	catch (err) {
		console.error(`Error reading tsconfig.json: ${ err }`);
	}

	return config
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
		console.error(`Error reading tsconfig.json: ${ err }`);
	}

	return result;
}
