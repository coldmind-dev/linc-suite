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

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Represents the structure of the `coldmind.json` configuration file.
 *
 * @interface
 * @property {string} rootDir - The root directory of the project or configuration.
 * @property {Object} tls - An object containing TLS configuration.
 * @property {string} tls.certDir - The directory, relative to rootDir, where TLS certificates are located.
 * @property {string} tls.keyFile - The filename of the TLS private key file within certDir.
 * @property {string} tls.certFile - The filename of the TLS certificate file within certDir.
 */
export interface IColdmindConfig {
	[environment: string]: {
		rootDir: string;
		tls: {
			certDir: string;
			keyFile: string;
			certFile: string;
		};
	};
}

const CONFIG_FILE = 'coldmind.json';
const cache: { [environment: string]: { cert?: Buffer; key?: Buffer } } = {};

export class CMCertLoader {
	constructor(
		public useCache: boolean = false
	) {}

	/**
	 * Searches for the configuration file named coldmind.json starting from startPath.
	 * @param startPath The path from where to start the search.
	 * @returns The path to the configuration file if found, null otherwise.
	 */
	private static findConfigFile(startPath: string): string | null {
		let currentDir = startPath;
		while (currentDir !== dirname(currentDir)) {
			const configFile = join(currentDir, CONFIG_FILE);
			if (existsSync(configFile)) {
				return configFile;
			}
			currentDir = dirname(currentDir);
		}

		return null;
	}

	/**
	 * Loads the server SSL options from the coldmind.json configuration for a given environment.
	 * @param environment The target environment for which to load configuration.
	 * @param startPath The directory to start searching for the coldmind.json file.
	 * @returns An object containing the SSL certificate and key if found, or an empty object.
	 */
	static loadServerOptions(environment: string = 'development', startPath: string = __dirname): { cert?: Buffer; key?: Buffer } {
		const configFile = this.findConfigFile(startPath);
		if (!configFile) {
			console.error("coldmind.json not found.");
			return {};
		}

		const config: IColdmindConfig = JSON.parse(readFileSync(configFile, 'utf-8'));
		const envConfig = config[environment];
		if (!envConfig || !envConfig.rootDir || !envConfig.tls) {
			console.error(`Invalid or missing configuration for environment: ${environment}.`);
			return {};
		}

		const certPath = join(envConfig.rootDir, envConfig.tls.certDir, envConfig.tls.certFile);
		const keyPath = join(envConfig.rootDir, envConfig.tls.certDir, envConfig.tls.keyFile);

		if (!existsSync(certPath) || !existsSync(keyPath)) {
			console.error("SSL files not found.");
			return {};
		}

		return {
			cert: readFileSync(certPath),
			key: readFileSync(keyPath)
		};
	}

	public loadServerOptions(...args: any[]): any {
		throw new Error("Method not implemented.");
	}
}
