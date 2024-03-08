/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
/**
 * Synchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns boolean True if the path exists and is a file, false otherwise.
 */
export declare function cmFileExistsSync(...paths: string[]): boolean;
/**
 * Asynchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns Promise<boolean> Resolves to true if the path exists and is a file, false otherwise.
 */
export declare function cmFileExistsAsync(...paths: string[]): Promise<boolean>;
