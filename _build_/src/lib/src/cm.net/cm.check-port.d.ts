/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
 */
export type TCheckPortResult = {
    success: boolean;
    port?: number;
    error?: Error | Error[];
    usedFallback?: boolean;
};
/**
 * Prompts the user to decide if they want to try another port when the current one is in use.
 * @returns Promise<boolean> True if the user wants to try another port; false otherwise.
 */
export declare const promptForPortChange: () => Promise<boolean>;
/**
 * Scans for an open port within a given range.
 * @param startPort The starting port number to scan.
 * @param endPort The ending port number to scan.
 * @returns A promise that resolves to a TCheckPortResult indicating the first open port found or an error if none are available.
 */
export declare const scanForOpenPort: (startPort: number, endPort: number) => Promise<TCheckPortResult>;
/**
 * Attempts to bind to a specified port and optionally scans for an open port within a fallback range if the initial attempt fails.
 * @param port The port to attempt to bind to initially.
 * @param promptForFallback Whether to prompt the user for fallback if the initial port is in use.
 * @param fallbackRange Optional range to search for an open port if the initial port is in use.
 * @returns A promise that resolves to a TCheckPortResult indicating the outcome.
 */
export declare const attemptToBindPort: (port: number, promptForFallback?: boolean, fallbackRange?: {
    startPort: number;
    endPort: number;
}) => Promise<TCheckPortResult>;
