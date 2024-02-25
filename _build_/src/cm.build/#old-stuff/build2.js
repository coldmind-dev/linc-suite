"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
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
const ts = __importStar(require("typescript"));
const rollup_1 = require("rollup");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const chalk_1 = __importDefault(require("chalk"));
// Function to compile TypeScript code using the TypeScript Compiler API
function compileTypeScript() {
    const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
    let program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
    let emitResult = program.emit();
    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${chalk_1.default.red(diagnostic.file.fileName)} (${line + 1},${character + 1}): ${chalk_1.default.yellow(message)}`);
        }
        else {
            console.log(chalk_1.default.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
        }
    });
    if (emitResult.emitSkipped) {
        console.log(chalk_1.default.bgRed('TypeScript compilation failed'));
        return false;
    }
    console.log(chalk_1.default.bgGreen('TypeScript compilation completed successfully'));
    return true;
}
// Function to bundle compiled code using Rollup
async function bundleCode() {
    const bundle = await (0, rollup_1.rollup)({
        input: './dist/main.js',
        plugins: [(0, plugin_node_resolve_1.default)(), (0, plugin_commonjs_1.default)()],
    });
    await bundle.write({
        file: './cmbuild-core/bundle.js',
        format: 'cjs',
    });
    console.log(chalk_1.default.bgGreen('Bundling completed successfully'));
}
// Main cmbuild-core function
async function main() {
    if (compileTypeScript()) {
        await bundleCode();
    }
    else {
        console.error(chalk_1.default.bgRed('Build failed'));
    }
}
main().then(res => {
    console.log(chalk_1.default.bgGreen('Build completed successfully'));
}).catch(error => {
    console.error(chalk_1.default.bgRed(error.message));
});
