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

import ts                                from 'rollup-plugin-ts';
import { OutputOptions, Plugin, rollup } from 'rollup';

export enum ModuleFormat {
	AMD      = 'amd',
	CommonJS = 'cjs',
	ES       = 'es',
	IIFE     = 'iife',
	System   = 'system',
	UMD      = 'umd'
}

interface BundleInputOptions {
	input: string | string[];
	plugins: Plugin[];
}

interface BundleOutputOptions extends OutputOptions {
	file: string;
	format: ModuleFormat;
}

interface BundleConfiguration {
	name: string;
	inputOptions: BundleInputOptions;
	outputOptions: BundleOutputOptions;
}

interface BuildHooks {
	onStart?: (name: string) => void;
	onSuccess?: (name: string) => void;
	onFailure?: (name: string, error: Error) => void;
	// Define additional hooks for plugin events if necessary
}

export type TCPlugin = Partial<Plugin>;

class BuildManager {
	private configurations: BundleConfiguration[];
	private hooks: BuildHooks;

	constructor(hooks?: BuildHooks) {
		this.configurations = [];
		this.hooks          = hooks || {};
	}

	public addConfiguration(config: BundleConfiguration): void {
		this.configurations.push(config);
	}

	public async run(): Promise<void> {
		for (const config of this.configurations) {
			try {
				this.hooks.onStart?.(config.name);
				await this.buildBundle(config);
				this.hooks.onSuccess?.(config.name);
			}
			catch (error) {
				this.hooks.onFailure?.(config.name, error as Error);
			}
		}
		console.log('All builds completed.');
	}

	private async buildBundle(config: BundleConfiguration): Promise<void> {
		const bundle = await rollup(
			{
				input  : config.inputOptions.input,
				plugins: [ ...config.inputOptions.plugins ],
			});
		await bundle.write(config.outputOptions);
	}

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

// Example usage
const buildManager = new BuildManager(
	{
		onStart  : (name) => console.log(`Starting build for ${ name }...`),
		onSuccess: (name) => console.log(`Successfully completed build for ${ name }.`),
		onFailure: (name,
					error
		) => console.error(`Build for ${ name } failed with error: ${ error.message }`),
	});

// Adding configurations
buildManager.addConfiguration(
	{
		name         : "Client Bundle",
		inputOptions : {
			input  : 'src/client.ts',
			plugins: [ ts() ],
		},
		outputOptions: {
			file  : 'dist/client-bundle.js',
			format: ModuleFormat.IIFE,
		}
	});

buildManager.addConfiguration(
	{
		name         : "Server Bundle",
		inputOptions : {
			input  : 'src/server.ts',
			plugins: [ ts() ],
		},
		outputOptions: {
			file  : 'dist/server-bundle.js',
			format: ModuleFormat.CommonJS,
		}
	});

// Execute the build
buildManager.run().catch(error => console.error('Global build process failed:', error));
