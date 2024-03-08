"use strict";
/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-12
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
exports.CMError = void 0;
const cm_error_types_1 = require("./cm.error.types");
/**
 * Represents a custom error type designed for handling middleware-related errors in applications.
 * This error class extends the built-in Error class and provides additional functionality for error handling.
 *
 * @class
 * @extends Error
 *
 * @param {string} [message] - An optional error message to describe the error.
 * @param {TErrorCodes} [code=TErrorCodes.UNKNOWN] - An optional error code associated with the error.
 *
 * @example
 * // Creating a CMError instance with a custom error message and code:
 * const error = new CMError('Custom error message', TErrorCodes.CUSTOM_ERROR);
 */
class CMError extends Error {
    /**
     * Creates a new CMError instance with an optional error code and message.
     *
     * @constructor
     *
     * @param {string} [message] - An optional error message to describe the error.
     * @param {TErrorCodes} [code=TErrorCodes.UNKNOWN] - An optional error code associated with the error.
     */
    constructor(message = cm_error_types_1.ErrorCodes[cm_error_types_1.ErrorCodes.errUnknown], code = cm_error_types_1.ErrorCodes.errUnknown) {
        super(message);
        this.code = code;
        this.name = 'CMError';
    }
    /**
     * Creates a new CMError instance with an optional error code and message.
     *
     * @static
     *
     * @param {TErrorCodes} [code=TErrorCodes.UNKNOWN] - An optional error code associated with the error.
     * @param {string} [message] - An optional error message to describe the error.
     * @returns {CMError} - A new CMError instance.
     *
     * @example
     * // Creating a CMError instance with a custom error message and code:
     * const error = CMError.create(TErrorCodes.CUSTOM_ERROR, 'Custom error message');
     */
    static create(code = cm_error_types_1.ErrorCodes.errUnknown, message) {
        message = message || cm_error_types_1.ErrorCodes[cm_error_types_1.ErrorCodes.errUnknown];
        return new CMError(message, code);
    }
    /**
     * Creates a new CMError instance based on an error code.
     *
     * @static
     *
     * @template {keyof TErrorCodes | TErrorCode} Code - The type of error code, which can be a keyof TErrorCodes or TErrorCode.
     * @param {Code} code - The error code to associate with the CMError instance.
     * @returns {CMError} - A new CMError instance with the specified error code.
     *
     * @example
     * // Creating a CMError instance based on a predefined error code:
     * const error = CMError.fromCode(TErrorCodes.PREDEFINED_ERROR);
     */
    static fromCode(code) {
        // Create a new CMError instance and set its code.
        const error = new CMError();
        error.code = code; // Ensure 'code' is a keyof TErrorCodes.
        return error;
    }
    /**
     * Creates a new CMError instance from an existing error.
     *
     * @static
     *
     * @param {Error} error - The existing error to create a CMError from.
     * @param {TErrorCodes} [errorCode=TErrorCodes.UNKNOWN] - An optional error code to associate with the CMError instance.
     * @returns {CMError} - A new CMError instance.
     *
     * @example
     * // Creating a CMError instance from an existing error:
     * const existingError = new Error('Existing error');
     * const error = CMError.createFromError(existingError, TErrorCodes.CUSTOM_ERROR);
     */
    static createFromError(error, errorCode = cm_error_types_1.ErrorCodes.errUnknown) {
        return new CMError(error.message, errorCode);
    }
}
exports.CMError = CMError;
