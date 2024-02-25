"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTsConfig = exports.findTsConfigFilename = void 0;
const cm_file_find_up_1 = require("@lib/cm.io/cm.file-find-up");
const cm_string_file_1 = require("@lib/cm.io/cm.string-file");
/**
 * Searches for the tsconfig.json file starting from the given directory.
 * If not found, it moves to the parent directory and repeats the search
 * until the root of the filesystem is reached.
 *
 * @param startDir The starting directory for the search.
 * @param filename
 * @returns The path to the tsconfig.json file if found, otherwise null.
 */
function findTsConfigFilename(startDir = process.cwd()) {
    let config = null;
    try {
        const tsConfigPath = (0, cm_file_find_up_1.findFileUp)(startDir, 'tsconfig.json');
    }
    catch (err) {
        console.error(`Error reading tsconfig.json: ${err}`);
    }
    return null;
}
exports.findTsConfigFilename = findTsConfigFilename;
function findTsConfig(startDir = process.cwd()) {
    let config = null;
    try {
        const tsConfigPath = findTsConfigFilename();
        const tsConfig = JSON.parse((0, cm_string_file_1.fileToString)(tsConfigPath));
    }
    catch (err) {
        console.error(`Error reading tsconfig.json: ${err}`);
    }
    return null;
}
exports.findTsConfig = findTsConfig;
