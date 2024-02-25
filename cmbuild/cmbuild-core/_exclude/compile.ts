/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
 */

import "reflect-metadata"
import ts                        from 'rollup-plugin-ts';
import { rollup }                from "rollup";
import { container }             from "tsyringe";
import { CMBuildManager }        from "../cm.build-manager";
import { IManifestEntry }        from "../types/cm.build-manifest";
import { IBundleOptions }        from "../types/cm.build-manifest";
import { TCMBuildModuleFormat }  from "../types/cm.module-format.type";
import { ICMBuildBundleOptions } from "../types/cm.build-bundle.options";

/**
 * Build function
 * @param {boolean} bailOnError
 * @returns {Promise<void>}
 */
async function build(bailOnError?: boolean): Promise<void> {
	const buildManager = container.resolve(CMBuildManager);
	const errors: any[] = [];

	const buildManifest: IManifestEntry[] = [
		{
			name   : "LincClient",
			options: {
				input : {
					input  : 'src/linc.client-cmbuild.ts',
					plugins: [ ts() ],
				},
				output: {
					name   : 'LincClient',
					file   : 'dist/client-bundle.js',
					format : TCMBuildModuleFormat.IIFE,
					globals: {
						'tsyringe': 'tsyringe'
					}
				}
			}
		},
		{
			name   : "Server Bundle",
			options: {
				input : {
					input  : 'src/linc.server-cmbuild.ts',
					plugins: [ ts() ]
				},
				output: {
					name   : "GlobalVarLinc",
					file   : 'dist/linc.server-build.js',
					format : TCMBuildModuleFormat.CommonJS,
					globals: {
						'tsyringe': 'tsyringe'
					}
				}
			}
		}
	];

	/**
	 * Encapsulated cmbuild-core logic into a separate async
	 * function for clarity and reusability
	 *
	 * @param {IBundleOptions} options
	 * @returns {Promise<void>}
	 */
	const buildBundle = async (options: ICMBuildBundleOptions) => {
		// Validate IIFE output name
		if (options.output.format === TCMBuildModuleFormat.IIFE && !options.output.name) {
			throw new Error(`Output name is required for IIFE format in ${ options.input.input }`);
		}

		const bundle = await rollup(options.input);
		await bundle.write(options.output);
	};

	// Implemented error handling for each bundle cmbuild-core process
	for (const entry of buildManifest) {
		try {
			console.log(`Building ${ entry.name }...`);
			await buildBundle(entry.options);
			console.log(`${ entry.name } build completed.`);
		}
		catch (error) {
			console.error(`Build failed for ${ entry.name }:`, error);

			// Bail with a code signaling controlled exit
			if (bailOnError) {
				process.exit(0);
			}

			errors.push(error);
		}
	}

	if (errors.length) {
		console.log("Builds completed with errors.");
	}
	else {
		console.log('All builds completed successfully.');
	}
}

//
// Wrapped the cmbuild-core function call in an IIFE to handle async operations
//
( async () => {
	try {
		await build();
	}
	catch (error) {
		console.error('Build process encountered an error:', error);
	}
} )();
