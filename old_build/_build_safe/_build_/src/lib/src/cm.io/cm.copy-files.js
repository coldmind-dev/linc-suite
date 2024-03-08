"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFilesWithStructure = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
/**
 * Copies a list of files to a specified target directory, preserving the directory structure.
 *
 * @param files An array of paths to the source files.
 * @param sourceBase The base directory of the source files, used to calculate subdirectories.
 * @param target The target directory where files will be copied, preserving the structure.
 */
async function copyFilesWithStructure(files, sourceBase, target) {
    try {
        for (const file of files) {
            // Calculate the relative path from the source base to the file
            const relativePath = path_1.default.relative(sourceBase, file);
            // Construct the target path by combining the target directory with the relative path
            const targetPath = path_1.default.join(target, relativePath);
            // Ensure the target subdirectory exists
            await (0, fs_extra_1.ensureDir)(path_1.default.dirname(targetPath));
            // Copy the file to the target path
            await (0, fs_extra_1.copy)(file, targetPath);
        }
        console.log('Files copied successfully with directory structure preserved.');
    }
    catch (error) {
        console.error(`Error copying files: ${error}`);
        throw error; // Allows for further handling or logging by the caller
    }
}
exports.copyFilesWithStructure = copyFilesWithStructure;
