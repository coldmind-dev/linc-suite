"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-12
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callFunctionAsync = exports.getFunctionInfo = void 0;
/**
 * Retrieves detailed information about a function within an untyped object, including its name,
 * whether it is asynchronous, and its argument names.
 * @param obj The untyped object containing the function.
 * @param functionName The name of the function to retrieve information for.
 * @returns An object with details about the function or null if the function does not exist.
 */
function getFunctionInfo(obj, functionName) {
    const func = obj[functionName];
    if (typeof func === 'function') {
        // Use toString method to check if function is async and to extract argument names
        const funcStr = func.toString();
        const isAsync = funcStr.startsWith('async ');
        // Extract argument names using regular expression
        const argNames = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).match(/([^\s,]+)/g) || [];
        return { name: functionName, isAsync, argNames };
    }
    else {
        return null;
    }
}
exports.getFunctionInfo = getFunctionInfo;
/**
 * Calls a specified function by name on an untyped object asynchronously, ensuring that the function
 * is indeed asynchronous before calling.
 * @param obj The untyped object containing the function.
 * @param functionName The name of the function to call.
 * @param args Arguments to pass to the function.
 * @returns A Promise that resolves with the return value of the called function.
 * @throws Error if the specified function does not exist or is not asynchronous.
 */
async function callFunctionAsync(obj, functionName, ...args) {
    const funcInfo = getFunctionInfo(obj, functionName);
    if (funcInfo && funcInfo.isAsync) {
        return obj[functionName](...args);
    }
    else if (funcInfo && !funcInfo.isAsync) {
        throw new Error(`Function ${functionName} is not asynchronous.`);
    }
    else {
        throw new Error(`Function ${functionName} does not exist.`);
    }
}
exports.callFunctionAsync = callFunctionAsync;
