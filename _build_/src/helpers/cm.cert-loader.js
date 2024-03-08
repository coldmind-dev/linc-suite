"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMCertLoader = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const CONFIG_FILE = 'coldmind.json';
const cache = {};
class CMCertLoader {
    constructor(useCache = false) {
        this.useCache = useCache;
    }
    /**
     * Searches for the configuration file named coldmind.json starting from startPath.
     * @param startPath The path from where to start the search.
     * @returns The path to the configuration file if found, null otherwise.
     */
    static findConfigFile(startPath) {
        let currentDir = startPath;
        while (currentDir !== (0, path_1.dirname)(currentDir)) {
            const configFile = (0, path_1.join)(currentDir, CONFIG_FILE);
            if ((0, fs_1.existsSync)(configFile)) {
                return configFile;
            }
            currentDir = (0, path_1.dirname)(currentDir);
        }
        return null;
    }
    /**
     * Loads the server SSL options from the coldmind.json configuration for a given environment.
     * @param environment The target environment for which to load configuration.
     * @param startPath The directory to start searching for the coldmind.json file.
     * @returns An object containing the SSL certificate and key if found, or an empty object.
     */
    static loadServerOptions(environment = 'development', startPath = __dirname) {
        const configFile = this.findConfigFile(startPath);
        if (!configFile) {
            console.error("coldmind.json not found.");
            return {};
        }
        const config = JSON.parse((0, fs_1.readFileSync)(configFile, 'utf-8'));
        const envConfig = config[environment];
        if (!envConfig || !envConfig.rootDir || !envConfig.tls) {
            console.error(`Invalid or missing configuration for environment: ${environment}.`);
            return {};
        }
        const certPath = (0, path_1.join)(envConfig.rootDir, envConfig.tls.certDir, envConfig.tls.certFile);
        const keyPath = (0, path_1.join)(envConfig.rootDir, envConfig.tls.certDir, envConfig.tls.keyFile);
        if (!(0, fs_1.existsSync)(certPath) || !(0, fs_1.existsSync)(keyPath)) {
            console.error("SSL files not found.");
            return {};
        }
        return {
            cert: (0, fs_1.readFileSync)(certPath),
            key: (0, fs_1.readFileSync)(keyPath)
        };
    }
    loadServerOptions(...args) {
        throw new Error("Method not implemented.");
    }
}
exports.CMCertLoader = CMCertLoader;
