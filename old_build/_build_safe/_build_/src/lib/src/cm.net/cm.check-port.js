"use strict";
/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptToBindPort = exports.scanForOpenPort = exports.promptForPortChange = void 0;
const net_1 = require("net");
const readline = __importStar(require("readline"));
/**
 * Prompts the user to decide if they want to try another port when the current one is in use.
 * @returns Promise<boolean> True if the user wants to try another port; false otherwise.
 */
const promptForPortChange = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => {
        rl.question('Do you want to try another port? (y/n) ', (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === 'y');
        });
    });
};
exports.promptForPortChange = promptForPortChange;
/**
 * Checks if a given port is available for binding.
 * @param port The port to check.
 * @returns A promise that resolves to a TCheckPortResult indicating the check result.
 */
const checkPortAvailable = (port) => {
    return new Promise(resolve => {
        const server = (0, net_1.createServer)();
        server.listen(port, () => {
            server.close(() => resolve({ success: true, port }));
        });
        server.on('error', (error) => {
            resolve({ success: false, error });
        });
    });
};
/**
 * Scans for an open port within a given range.
 * @param startPort The starting port number to scan.
 * @param endPort The ending port number to scan.
 * @returns A promise that resolves to a TCheckPortResult indicating the first open port found or an error if none are available.
 */
const scanForOpenPort = async (startPort, endPort) => {
    for (let port = startPort; port <= endPort; port++) {
        const result = await checkPortAvailable(port);
        if (result.success)
            return result;
    }
    return { success: false, error: new Error('No available port found within the specified range.') };
};
exports.scanForOpenPort = scanForOpenPort;
/**
 * Attempts to bind to a specified port and optionally scans for an open port within a fallback range if the initial attempt fails.
 * @param port The port to attempt to bind to initially.
 * @param promptForFallback Whether to prompt the user for fallback if the initial port is in use.
 * @param fallbackRange Optional range to search for an open port if the initial port is in use.
 * @returns A promise that resolves to a TCheckPortResult indicating the outcome.
 */
const attemptToBindPort = async (port, promptForFallback = false, fallbackRange) => {
    let result = await checkPortAvailable(port);
    if (result.success)
        return result;
    if (promptForFallback && !result.success) {
        const userConsent = await (0, exports.promptForPortChange)();
        if (!userConsent)
            return { success: false, error: new Error('User opted not to try another port.'), usedFallback: false };
    }
    if (fallbackRange) {
        result = await (0, exports.scanForOpenPort)(fallbackRange.startPort, fallbackRange.endPort);
        if (result.success) {
            result.usedFallback = true;
            return result;
        }
    }
    return { success: false, error: new Error('No available port found within the specified range or user opted out.'), usedFallback: false };
};
exports.attemptToBindPort = attemptToBindPort;
