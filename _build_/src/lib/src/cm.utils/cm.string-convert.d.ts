/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-21
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
export interface IConversionResult<T> {
    success: boolean;
    result?: T;
    error?: any;
}
/**
 * Converts any input to a string.
 *
 * @param {any} input - The input to be converted.
 * @returns {{ success: boolean, result: string, error: any }} - An object containing a success flag, the resulting string, and an error property if the conversion failed.
 */
/**
 * Converts any input to a string.
 *
 * @param {any} input - The input to be converted.
 * @returns {{ success: boolean, result: string, error: any }} - An object containing a success flag, the resulting string, and an error property if the conversion failed.
 * @throws {Error} - When the CmStringBuffer class doesn't exist in the scope or doesn't have `compileToString` method.
 */
export declare const convertToString: (input: any) => IConversionResult<string>;
