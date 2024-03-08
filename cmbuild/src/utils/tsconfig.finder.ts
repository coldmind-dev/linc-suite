/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { TFileFindResult }   from "../core/cm.file-find.type";
import { findFileUp }       from "../core/cm.file-find-up";
import { cmFileExistsSync } from "./file.utils";
import { fileToString }     from "./cm.string-file";
import { TCMBuildFilenames } from "../types/cm.filenames.const";

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
