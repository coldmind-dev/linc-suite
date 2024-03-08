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

import { grabConfig }            from "./utils/file.utils";
import { ITSConfig }             from "./types/tsconfig.type";
import { ICMBuildBundleOptions } from "./types/cm.build-bundle.options";
import { ICMBuildHooks }         from "./types/cm.build-hooks";
import { TCMBuildFilenames }     from "./types/cm.filenames.const";
import { CMBuildModuleFormat }   from "./types/cm.module-format.type";
import { rollup }                from "rollup";
import * as path                 from "path";
import { RollupOutput }          from "rollup";
import { ICMBuildBundleOption }  from "./types/cm.build-bundle.options";

export interface IBundleInputOptions {
	input: string | string[];
	plugins: Plugin[];
}

export type TCPlugin = Partial<Plugin>;

export type TBundleBuildResult = {
	success: boolean;
	data?: RollupOutput;
	error?: Error;
}

export class CMBuildManager {
	private _tsConfig: ITSConfig                    = {};
	private _packageConfig: any                     = {};
	private configurations: ICMBuildBundleOptions[] = [];
	private hooks: ICMBuildHooks;

	constructor(hooks?: ICMBuildHooks) {
		this.hooks = hooks || {};
		this.loadConfigFiles();
	}

	/**
	 * Load configuration files
	 */
	async loadConfigFiles(): Promise<void> {
		try {
			this._tsConfig      = grabConfig<ITSConfig>(TCMBuildFilenames.TSConfig);
			this._packageConfig = grabConfig<ITSConfig>(TCMBuildFilenames.PackageJson);
			this._packageConfig = grabConfig<ITSConfig>(TCMBuildFilenames.PackageJson);

		}
		catch (err) {
			console.log('Error', err);
			throw err;
		}
	}

	get tsConfig(): ITSConfig {
		return this._tsConfig || {};
	}

	get packageConfig(): ITSConfig {
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
		console.log("RUN!!!");
		for (const config of this.configurations) {
			console.log("RUN!!! ::", config);

			try {
				//	this.hooks.onStart("config?.input?.name");
				await this.buildCMBundle(config);
				//	this.hooks.onSuccess?.("config.name");
			}
			catch (error) {
				console.log("run() ERROR ::", error);
				//this.hooks.onFailure?.("config.name", error as Error);
			}
		}

		console.log('All builds completed.');
	}

	/**
	 * Determines the source directory for the project, prioritizing the "coldmind" configuration.
	 * @returns The path to the source directory.
	 */
	public getSourceDir(): string {
		console.log("COLDMIND CONFIG ::", this.tsConfig.coldmind);
		return this.tsConfig.coldmind?.projectSourceDir || this.tsConfig.compilerOptions?.rootDir || '';
	}

	/**
	 * Determines the distribution directory for the project, prioritizing the "coldmind" configuration.
	 * @returns The path to the distribution directory.
	 */
	public getDistDir(): string {
		return this.tsConfig.coldmind?.projectDistDir || this.tsConfig.compilerOptions?.outDir || 'dist';
	}

	async buildCMBundle(config: ICMBuildBundleOptions): Promise<TBundleBuildResult[]> {
		const results: TBundleBuildResult[] = [];
		for (let build of config.builds) {
			const res = await this.buildCMSingleBundle(build)
			results.push(res);
		}

		return results;
	}

	/**
	 * Encapsulated cmbuild-core logic into a separate async
	 * function for clarity and reusability
	 *
	 * @param {ICMBuildBundleOptions} options
	 * @returns {Promise<void>}
	 */
	async buildCMSingleBundle(options: ICMBuildBundleOption): Promise<TBundleBuildResult> {

		console.log("------------------------------- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BUILD BUNDLE :::", options);

		// Validate IIFE output name
		if (options.output.format === CMBuildModuleFormat.IIFE && !options.output.name) {
			throw new Error(`Output name is required for IIFE format in ${ options.input.input }`);
		}

		const ensureArray = (input: string | string[]): string[] => {
			return ( ( input && !Array.isArray(input) ) ? [ input ] : input ) as Array<string>;
		}

		//
		// Prepare the bundle
		//
		let inputSrc = ensureArray(options.input?.input);

		console.log("OPTIOPNS INPUT ::",
					options.input?.input
		);

		inputSrc.forEach((src: string) => {
			src = path.resolve(this.getSourceDir(), src);

			console.log("------------ sourceDir ::", this.getSourceDir());
			console.log('src', src);

		});

		options.output.file = path.resolve(
			this.getDistDir(),
			options.output.file
		);

		try {
			const bundle   = await rollup(options.input);
			const writeRes = await bundle.write(options.output);

			return {
				success: true,
				data: writeRes
			}

		} catch (err) {
			return {
				success: false,
				error: err
			}
		}
	}


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
