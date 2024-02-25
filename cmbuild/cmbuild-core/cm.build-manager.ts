/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-22
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
import { ITSConfig }             from "../../src/lib/cm.tslang/tsconfig.type";
import { ICMBuildBundleOptions } from "./types/cm.build-bundle.options";
import { TCMBuildFilenames }     from "./types/cm.filenames.const";
import { grabConfig }            from "../../src/lib/cm.tslang/tsconfig.finder";
import { TCMBuildModuleFormat }  from "./types/cm.module-format.type";
import { rollup }                from "rollup";

export interface IBundleInputOptions {
	input: string | string[];
	plugins: Plugin[];
}

export interface ICMBuildHooks {
	onStart?: (name: string) => void;
	onSuccess?: (name: string) => void;
	onFailure?: (name: string, error: Error) => void;
}

export type TCPlugin = Partial<Plugin>;

export class CMBuildManager {
	private _tsConfig: ITSConfig;
	private configurations: ICMBuildBundleOptions[] = [];
	private hooks: ICMBuildHooks;

	constructor(hooks?: ICMBuildHooks) {
		this.hooks          = hooks || {};

		this._tsConfig = grabConfig<ITSConfig>(TCMBuildFilenames.TSConfig);
	}

	get tsConfig(): ITSConfig {
		return this._tsConfig || {};
	}

	public addConfiguration(config: ICMBuildBundleOptions): void {
		this.configurations.push(config);
	}

	/**
	 * Run all configurations
	 *
	 * @returns {Promise<void>}
	 */
	public async run(): Promise<void> {
		for (const config of this.configurations) {
			try {
				this.hooks.onStart("config?.input?.name");
				await this.buildBundle(config);
				this.hooks.onSuccess?.("config.name");
			}
			catch (error) {
				this.hooks.onFailure?.("config.name", error as Error);
			}
		}
		console.log('All builds completed.');
	}

	/**
	 * Encapsulated cmbuild-core logic into a separate async
	 * function for clarity and reusability
	 *
	 * @param {IBundleOptions} options
	 * @returns {Promise<void>}
	 */
	async buildBundle(options: ICMBuildBundleOptions): Promise<void> {
		// Validate IIFE output name
		if (options.output.format === TCMBuildModuleFormat.IIFE && !options.output.name) {
			throw new Error(`Output name is required for IIFE format in ${ options.input.input }`);
		}

		const bundle = await rollup(options.input);
		await bundle.write(options.output);
	}

	/**
	 * Encapsulated cmbuild-core logic into a separate async
	 * function for clarity and reusability
	 *
	 * @param {IBundleOptions} options
	 * @returns {Promise<void>}
	 *
	async buildBundle(options: ICMBuildBundleOptions): Promise<void> {
		// Validate IIFE output name
		if (options.output.format === TCMBuildModuleFormat.IIFE && !options.output.name) {
			throw new Error(`Output name is required for IIFE format in ${ options.input.input }`);
		}

		const bundle = await rollup(options.input);
		await bundle.write(options.output);
	}
	*/

	/*
	private async buildBundle(config: ICMBuildBundleOptions): Promise<void> {
		const bundle = await rollup(
			{
				input  : config.input,
				plugins: [ ...config. .plugins ],
			})

		await bundle.write(config.output);
	}
*/
	/*/ Create a wrapper plugin to listen for plugin events
	 private createPluginHooks(name: string): TCPlugin {
	 return {

	 name: `plugin-hooks-${ name }`,
	 buildStart() {
	 console.log(`[${ name }] Build started`);
	 // Implement custom behavior for buildStart or call a hook
	 },
	 buildEnd(error) {
	 if (error) {
	 console.log(`[${ name }] Build ended with error: ${ error.message }`);
	 // Implement custom behavior for buildEnd with error
	 }
	 else {
	 console.log(`[${ name }] Build ended successfully`);
	 // Implement custom behavior for successful buildEnd
	 }
	 },
	 // Implement additional lifecycle hooks as needed
	 // renderStart, renderEnd, writeBundle, etc.
	 };
	 }*/
}
