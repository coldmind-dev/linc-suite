"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleFormat = void 0;
const rollup_plugin_ts_1 = __importDefault(require("rollup-plugin-ts"));
const rollup_1 = require("rollup");
var ModuleFormat;
(function (ModuleFormat) {
    ModuleFormat["AMD"] = "amd";
    ModuleFormat["CommonJS"] = "cjs";
    ModuleFormat["ES"] = "es";
    ModuleFormat["IIFE"] = "iife";
    ModuleFormat["System"] = "system";
    ModuleFormat["UMD"] = "umd";
})(ModuleFormat = exports.ModuleFormat || (exports.ModuleFormat = {}));
class BuildManager {
    constructor(hooks) {
        this.configurations = [];
        this.hooks = hooks || {};
    }
    addConfiguration(config) {
        this.configurations.push(config);
    }
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
    async buildBundle(config) {
        const bundle = await (0, rollup_1.rollup)({
            input: config.inputOptions.input,
            plugins: [...config.inputOptions.plugins],
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
