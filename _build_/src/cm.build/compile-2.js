"use strict";
/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2024-02-21 21:36
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleFormat = void 0;
const rollup_plugin_ts_1 = __importDefault(require("rollup-plugin-ts"));
const rollup_1 = require("rollup");
// Define supported module formats
var ModuleFormat;
(function (ModuleFormat) {
    ModuleFormat["AMD"] = "amd";
    ModuleFormat["CommonJS"] = "cjs";
    ModuleFormat["ES"] = "es";
    ModuleFormat["IIFE"] = "iife";
    ModuleFormat["System"] = "system";
    ModuleFormat["UMD"] = "umd";
})(ModuleFormat = exports.ModuleFormat || (exports.ModuleFormat = {}));
// Class for managing and running builds
class BuildManager {
    constructor(hooks) {
        this.configurations = [];
        this.hooks = hooks || {};
    }
    // Add a new configuration
    addConfiguration(config) {
        this.configurations.push(config);
    }
    // Run all configurations
    async run() {
        for (const config of this.configurations) {
            try {
                this.hooks.onStart?.(config.name);
                await this.buildBundle(config);
                this.hooks.onSuccess?.(config.name);
            }
            catch (error) {
                this.hooks.onFailure?.(config.name, error);
            }
        }
        console.log('All builds completed.');
    }
    // Build a single bundle based on provided configuration
    async buildBundle(config) {
        const bundle = await (0, rollup_1.rollup)({
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
        plugins: [(0, rollup_plugin_ts_1.default)()],
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
        plugins: [(0, rollup_plugin_ts_1.default)()],
    },
    outputOptions: {
        file: 'dist/server-bundle.js',
        format: ModuleFormat.CommonJS,
    }
});
// Execute the cmbuild-core
buildManager.run().catch(error => console.error('Global cmbuild-core process failed:', error));
