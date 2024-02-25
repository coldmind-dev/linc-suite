/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-25
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

import * as fs       from 'fs';
import * as path     from 'path';
import { ITSConfig } from "../../src/lib/cm.tslang/tsconfig.type";

/**
 * Manages project configuration and paths based on the settings defined in tsconfig.json,
 * including custom "coldmind" section overrides.
 */
export class CMProjectManager {

	/**
	 * Initializes a new instance of the project manager using the specified tsconfig.json path.
	 * @param config
	 */
	constructor(private config: ITSConfig) {
	}

	/**
	 * Loads and parses the TypeScript configuration from the specified file path.
	 * @param tsConfigPath Path to the tsconfig.json file.
	 * @returns The TypeScript configuration object including any custom "coldmind" settings.
	 */
	private loadTsConfig(tsConfigPath: string): ITSConfig {
		const configText = fs.readFileSync(tsConfigPath, 'utf8');
		const config: ITSConfig = JSON.parse(configText);
		return config;
	}

	/**
	 * Determines the source directory for the project, prioritizing the "coldmind" configuration.
	 * @returns The path to the source directory.
	 */
	public getSourceDir(): string {
		return this.config.coldmind?.projectSourceDir || this.config.compilerOptions?.rootDir || 'src';
	}

	/**
	 * Determines the distribution directory for the project, prioritizing the "coldmind" configuration.
	 * @returns The path to the distribution directory.
	 */
	public getDistDir(): string {
		return this.config.coldmind?.projectDistDir || this.config.compilerOptions?.outDir || 'dist';
	}
}
