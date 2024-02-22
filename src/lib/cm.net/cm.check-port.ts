/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
 */

import { createServer } from 'net';
import * as readline from 'readline';

export type TCheckPortResult = {
	success: boolean;
	port?: number;
	error?: Error | Error[];
	usedFallback?: boolean; // Indicates if fallback strategy was employed
};

/**
 * Prompts the user to decide if they want to try another port when the current one is in use.
 * @returns Promise<boolean> True if the user wants to try another port; false otherwise.
 */
export const promptForPortChange = async (): Promise<boolean> => {
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

/**
 * Checks if a given port is available for binding.
 * @param port The port to check.
 * @returns A promise that resolves to a TCheckPortResult indicating the check result.
 */
const checkPortAvailable = (port: number): Promise<TCheckPortResult> => {
	return new Promise(resolve => {
		const server = createServer();
		server.listen(port, () => {
			server.close(() => resolve({ success: true, port }));
		});
		server.on('error', (error: NodeJS.ErrnoException) => {
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
export const scanForOpenPort = async (startPort: number, endPort: number): Promise<TCheckPortResult> => {
	for (let port = startPort; port <= endPort; port++) {
		const result = await checkPortAvailable(port);
		if (result.success) return result;
	}
	return { success: false, error: new Error('No available port found within the specified range.') };
};

/**
 * Attempts to bind to a specified port and optionally scans for an open port within a fallback range if the initial attempt fails.
 * @param port The port to attempt to bind to initially.
 * @param promptForFallback Whether to prompt the user for fallback if the initial port is in use.
 * @param fallbackRange Optional range to search for an open port if the initial port is in use.
 * @returns A promise that resolves to a TCheckPortResult indicating the outcome.
 */
export const attemptToBindPort = async (port: number, promptForFallback: boolean = false, fallbackRange?: { startPort: number, endPort: number }): Promise<TCheckPortResult> => {
	let result = await checkPortAvailable(port);
	if (result.success) return result;

	if (promptForFallback && !result.success) {
		const userConsent = await promptForPortChange();
		if (!userConsent) return { success: false, error: new Error('User opted not to try another port.'), usedFallback: false };
	}

	if (fallbackRange) {
		result = await scanForOpenPort(fallbackRange.startPort, fallbackRange.endPort);
		if (result.success) {
			result.usedFallback = true;
			return result;
		}
	}

	return { success: false, error: new Error('No available port found within the specified range or user opted out.'), usedFallback: false };
}
