import ts from 'rollup-plugin-ts';
import { rollup, Plugin } from "rollup";

export enum TModuleFormat {
	AMD = 'amd',
	CommonJS = 'cjs',
	ES = 'es',
	IIFE = 'iife', // Corrected typo: ImeInvFuncExp -> IIFE for consistency
	System = 'system',
	UMD = 'umd'
};


export interface IBundleOptions {
	input: {
		input: string | string[],
		plugins: Plugin[];
	},
	output: {
		name?: string,
		file: string;
		format: TModuleFormat;
		globals?: { [id: string]: string }| ((id: string) => string)
	}
}

export interface IManifestEntry {
	name: string;
	options: IBundleOptions;
}

export type TBundleOptions = IManifestEntry[];

async function build(bailOnError?: boolean): Promise<void> {
	const errors = new Array<any>();

	const buildManifest: IManifestEntry[] = [
		{
			name: "LincClient",
			options: {
				input: {
					input: 'src/client.ts',
					plugins: [ts()],
				},
				output: {
					name: 'LincClient',
					file: 'dist/client-bundle.js',
					format: TModuleFormat.IIFE,
					globals: {
						'tsyringe': 'tsyringe'
					}
				}
			}
		},
		{
			name: "Server Bundle",
			options: {
				input: {
					input: 'src/server-build.ts',
					plugins: [ts()]
				},
				output: {
					file: 'dist/server-bundle.js',
					format: TModuleFormat.CommonJS,
					globals: {
						'tsyringe': 'tsyringe'
					}
				}
			}
		}
	];

	/*
	const buildBundle = async (options: IBundleOptions) => {
		const bundle = await rollup(options.input);
		await bundle.write(options.output);
	};

	for (const entry of buildManifest) {
		console.log(`Building ${entry.name}...`);
		await buildBundle(entry.options); // Corrected to pass correct options
	}
	*/

	// Encapsulated build logic into a separate async function for clarity and reusability
	const buildBundle = async (options: IBundleOptions) => {
		// Validate IIFE output name
		if (options.output.format === TModuleFormat.IIFE && !options.output.name) {
			throw new Error(`Output name is required for IIFE format in ${options.input.input}`);
		}

		const bundle = await rollup(options.input);
		await bundle.write(options.output);
	};

	// Implemented error handling for each bundle build process
	for (const entry of buildManifest) {
		try {
			console.log(`Building ${entry.name}...`);
			await buildBundle(entry.options);
			console.log(`${entry.name} build completed.`);
		} catch (error) {
			console.error(`Build failed for ${entry.name}:`, error);

			// Bail with a code signaling controlled exit
			if (bailOnError) {
				process.exit(0);
			}

			errors.push(error);
		}
	}

	if (errors.length) {
		console.log("Builds completed with errors.");
	} else {
		console.log('All builds completed successfully.');
	}
}

//build().catch(error => console.error('Build failed:', error));

// Wrapped the build function call in an IIFE to handle async operations
(async () => {
	try {
		await build();
	} catch (error) {
		console.error('Build process encountered an error:', error);
	}
})();
