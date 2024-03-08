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

import * as path                  from "path";
import { resolve as resolvePath } from "path";
import * as fs                    from "fs";
import { existsSync }             from 'fs';
import { ITSConfig }              from "./types/tsconfig.type";
import { CMBuildManager }         from "./cm.build-manager";
import tsRollup                   from "rollup-plugin-ts";
import { CMBuildModuleFormat }    from "./types/cm.module-format.type";
import { TModuleFormat }          from "./types/cm.module-format.type";
import { ICMBuildBundleOptions }  from "./types/cm.build-bundle.options";
import { CMBuildManifest }        from "./cm.build.types";
import { cmFileExistsSync }       from "./utils/file.utils";
import { exec }                   from "child_process";
import { execAsync }              from "./utils/build.exec";
import { fileToString }           from "./utils/cm.string-file";
import { IStdBuildSpec }          from "./types/cm.json-buildspec.type";
import { CMBuildType }            from "./types/cm.json-buildspec.type";
import ts                         from "typescript";

/**
 * Manages project configuration and paths based on the settings defined in tsconfig.json,
 * including custom "coldmind" section overrides.
 */
export class CMProjectManager {
	private static _instance: CMProjectManager;
	private _buildManager: CMBuildManager;
	private config: ITSConfig

	public static instance(): CMProjectManager {
		if ( !CMProjectManager._instance) {
			CMProjectManager._instance = new CMProjectManager();
		}
		return this._instance;
	}

	private constructor() {
	}

	/**
	 * Converts a string to a module format.
	 *
	 * @param {string} str
	 * @returns {CMBuildModuleFormat}
	 */
	strToModuleFormat(str: string): CMBuildModuleFormat {
		str = str.toLowerCase();

		for (const key in TModuleFormat) {
			if (TModuleFormat[ key ].aliases.includes(str)) {
				return TModuleFormat[ key ].name;
			}
		}

		return CMBuildModuleFormat.ES;
	}

	public async init(dir: string): Promise<void> {
		const buildManager = this.initBuildManager();

		console.log("Init in directory ::", dir);

		let errors = []

		try {
			if ( !this.isCMBuildRoot(dir)) {
				throw new Error(`Directory "<b>${ dir }</b>" is not a valid CMBuild project`);
			}

			dir                = resolvePath(dir, CMBuildManifest.projectDir);
			const specJsFile   = path.join(dir, CMBuildManifest.buildSpecJs);
			const specJsonFile = path.join(dir, CMBuildManifest.buildSpecJson);

			if ( !cmFileExistsSync(specJsonFile)) {
				throw new Error(`Missing build spec file "<b>${ CMBuildManifest.buildSpecJson }</b>"`);
			}

			const buildSpecRes = JSON.parse(fileToString(specJsonFile));

			let buildSpecs: IStdBuildSpec[] = [];

			if ( !Array.isArray(buildSpecRes)) {
				buildSpecs.push(buildSpecRes);
			}
			else {
				buildSpecs = buildSpecRes;
			}

			console.log("Build Spec", buildSpecs);

			buildSpecs.forEach((buildSpec: IStdBuildSpec) => {

				buildSpec.builds.forEach((spec) => {

					console.log("Spec ::", spec);
					console.log("Spec ::", spec);

					const tsCompilerOpt: Partial<ts.CompilerOptions> = {}

					const bundleOptions: ICMBuildBundleOptions = {
						builds: [
							{
								input : {
									input  : spec.source,
									plugins: [ tsRollup() ]
								},
								output: {
									name   : spec.output?.globalVar,
									file   : spec.output.bundleName,
									format : CMBuildModuleFormat.ES,
									globals: spec.output.globals
								}
							}
						]
					};

					console.log("Bundle Options", bundleOptions);

					if (spec?.type === CMBuildType.NpmModule) {
						// TODO: Add NPM Module build support
						buildManager.buildCMBundle(bundleOptions).then(res => {
							const data = res; //.data;

							console.log("NPM Module Build Result ::", res);
							/*let output = ( data as any )?.output as [];

							output.forEach((out: any) => {
								console.log("Output ::", out);
							});*/

						}).catch(error => {
							console.error('Global process failed for ::', error)
						});

					}
					else {
						buildManager.addConfiguration(bundleOptions);
					}

					//buildManager.addConfiguration(bundleOptions);
				});
			});

			await buildManager.run().catch(error => {
				console.error('Global cmbuild-core process failed:', error)
			});

			/*
			 const buildManager = new CMBuildManager(
			 {
			 onStart  : (name) => console.log(`Starting build for ${ name }...`),
			 onSuccess: (name) => console.log(`Successfully completed build for ${ name }.`),
			 onFailure: (name, error) => console.error(`Build for ${ name } failed with error: ${ error.message }`),
			 });

			 buildManager.addConfiguration(
			 new CMBuildBundleOptions(
			 {
			 input  : 'src/linc.client-cmbuild.ts',
			 plugins: [ ts() ],
			 },
			 {
			 name  : 'LincClient',
			 file  : 'client-bundle.js',
			 format: TCMBuildModuleFormat.ES,
			 }
			 )
			 );
			 buildManager.run().catch(error => {
			 console.error('Global cmbuild-core process failed:', error)
			 });
			 */

		}
		catch (err) {
			console.log(err);
		}
	}

	/**
	 * Initializes the build manager.
	 *
	 * @returns {CMBuildManager}
	 */
	public initBuildManager = (): CMBuildManager => {
		if ( !this._buildManager) {
			this._buildManager = new CMBuildManager();
		}

		return this._buildManager;
	}

	public isCMBuildRoot = (dir: string): boolean => {
		dir = path.resolve(dir, CMBuildManifest.projectDir);

		console.log("isCMBuildRoot ::", dir);

		return existsSync(dir);
	}
}

/**
 * Copies template files to the output directory and updates version in config files.
 * @param {string} version - The current version of the package.
 */
function prepareDist(version) {
	const outDir      = ""; //getOutDir();
	const templateDir = path.resolve(__dirname, '../template');

	// Ensure output directory exists
	if ( !fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}

	// Copy template files
	fs.readdirSync(templateDir).forEach(file => {
		const srcPath  = path.join(templateDir, file);
		const destPath = path.join(outDir, file);
		fs.copyFileSync(srcPath, destPath);
		console.log(`Copied ${ file } to ${ outDir }.`);
	});

	// Update version in a specific config file as an example
	const configPath = path.join(outDir, 'config.json');
	if (fs.existsSync(configPath)) {
		const config   = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		config.version = version;
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		console.log(`Updated version in config.json to ${ version }.`);
	}
}

/**
 * Main function to orchestrate version bumping, building, and preparing the output directory.
 * @param {string} versionType - The type of version bump (patch, minor, major).
 */
async function main(versionType) {
	// Bump version and capture the new version number
	console.log(`Bumping version: ${ versionType }`);
	const version = await execAsync(`npm version ${ versionType } --no-git-tag-version`);
	console.log(`New version: ${ version }`);

	// Build the project
	console.log('Building project...');
	exec('npm run build');

	// Prepare the output directory
	console.log('Preparing output directory...');
	prepareDist(version);

	console.log('Build and release preparation complete.');
}

/*buildManager.addConfiguration(
 new CMBuildBundleOptions({
 input  : 'src/linc.server-cmbuild.ts',
 plugins: [ ts() ],
 },
 {
 file  : 'linc-server.js',
 format: TCMBuildModuleFormat.CommonJS,
 }
 )
 );
 */


