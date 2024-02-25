"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-09
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileTypeScript = void 0;
const ts = __importStar(require("typescript"));
const rollup_1 = require("rollup");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
// Function to compile TypeScript code using the TypeScript Compiler API
function compileTypeScript() {
    // Load your tsconfig.json file
    const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
    // Compile the project
    const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
    for (let sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            console.log('Compiling', sourceFile.fileName);
        }
    }
    const emitResult = program.emit();
    // Check for and report compiler errors
    const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    });
    if (emitResult.emitSkipped) {
        console.log('TypeScript compilation failed');
        return false;
    }
    console.log('TypeScript compilation completed successfully');
    return true;
}
exports.compileTypeScript = compileTypeScript;
// Function to bundle compiled code using Rollup
async function bundleCode() {
    // Assuming you have a rollup.config.js or you can define your config here
    const bundle = await (0, rollup_1.rollup)({
        input: './dist/main.js',
        plugins: [(0, plugin_node_resolve_1.default)(), (0, plugin_commonjs_1.default)()],
    });
    await bundle.write({
        file: './cmbuild-core/bundle.js',
        format: 'cjs',
    });
    console.log('Bundling completed successfully');
}
// Main cmbuild-core function
async function main() {
    if (compileTypeScript()) {
        await bundleCode();
    }
    else {
        console.error('Build failed');
    }
}
main().catch(console.error);
/*
let tw = new CMCliTextWriter();

cp kalle = `
            <icon="star" />
            <color="yellow">
            Hello
            </color>
            <color="red">
            World
            </color>
            <br />
`;
tw.write(kalle);

//Create a "StripeService" something like constructor(settings: IStripeSettings)
interface IStripeSettings {
    apiKey: string;
    successUrl: string;
    redirectUrl: string;
    cancelUrl: string;
}

apiKey: string) ,
*/
