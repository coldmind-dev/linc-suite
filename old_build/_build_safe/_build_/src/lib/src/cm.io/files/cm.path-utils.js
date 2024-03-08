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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * Determines if two paths refer to the same directory.
 *
 * @param fromPath The source path.
 * @param toPath The destination path.
 * @returns true if both paths refer to the same directory, false otherwise.
 */
function isSameDirectory(fromPath, toPath) {
    try {
        // Resolve paths to their absolute paths, normalizing any relative paths or '..' segments
        const resolvedFromPath = path_1.default.resolve(fromPath);
        const resolvedToPath = path_1.default.resolve(toPath);
        // Resolve any symbolic links to their final destination paths
        const realFromPath = (0, fs_1.realpathSync)(resolvedFromPath);
        const realToPath = (0, fs_1.realpathSync)(resolvedToPath);
        // Compare the real paths
        return realFromPath === realToPath;
    }
    catch (error) {
        console.error(`Error comparing paths: ${error}`);
        return false; // Return false or handle the error as needed
    }
}
