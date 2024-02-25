/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2024-02-21 21:36
 */

import ts from 'rollup-plugin-ts';
import { rollup, RollupOptions, OutputOptions, Plugin } from 'rollup';

// Define supported module formats
export enum ModuleFormat {
	AMD = 'amd',
	CommonJS = 'cjs',
	ES = 'es',
	IIFE = 'iife',
	System = 'system',
	UMD = 'umd'
}

// Interface for input options
interface BundleInputOptions {
	input: string | string[];
	plugins: Plugin[];
}

// Interface for output options
interface BundleOutputOptions extends OutputOptions {
	file: string;
	format: ModuleFormat;
}

// Interface for a complete bundle configuration
interface BundleConfiguration {
	name: string;
	inputOptions: BundleInputOptions;
	outputOptions: BundleOutputOptions;
}

// Hooks for custom actions during the cmbuild-core process
54

// Class for managing and running builds
class BuildManager {
	private configurations: BundleConfiguration[];
	private hooks: BuildHooks;

	constructor(hooks?: BuildHooks) {
		this.configurations = [];
		this.hooks = hooks || {};
	}

	// Add a new configuration
	public addConfiguration(config: BundleConfiguration): void {
		this.configurations.push(config);
	}

	// Run all configurations
	public async run(): Promise<void> {
		for (const config of this.configurations) {
			try {
				this.hooks.onStart?.(config.name);
				await this.buildBundle(config);
				this.hooks.onSuccess?.(config.name);
			} catch (error) {
				this.hooks.onFailure?.(config.name, error as Error);
			}
		}
		console.log('All builds completed.');
	}

	// Build a single bundle based on provided configuration
	private async buildBundle(config: BundleConfiguration): Promise<void> {
		const bundle = await rollup({
										input: config.inputOptions.input,
										plugins: config.inputOptions.plugins,
									});
		await bundle.write(config.outputOptions);
	}
}

// Example usage
const buildManager = new BuildManager({
										  onStart: (name) => console.log(`Starting build for ${name}...`),
										  onSuccess: (name) => console.log(`Successfully completed build for ${name}.`),
										  onFailure: (name, error) => console.error(`Build for ${name} failed with error: ${error.message}`),
									  });

// Adding configurations
buildManager.addConfiguration({
								  name: "Client Bundle",
								  inputOptions: {
									  input: 'src/linc.client-cmbuild.ts',
									  plugins: [ts()],
								  },
								  outputOptions: {
									  file: 'dist/client-bundle.js',
									  format: ModuleFormat.IIFE,
								  }
							  });

buildManager.addConfiguration({
								  name: "Server Bundle",
								  inputOptions: {
									  input: 'src/server.ts',
									  plugins: [ts()],
								  },
								  outputOptions: {
									  file: 'dist/server-bundle.js',
									  format: ModuleFormat.CommonJS,
								  }
							  });

// Execute the cmbuild-core
buildManager.run().catch(error => console.error('Global cmbuild-core process failed:', error));
