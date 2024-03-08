"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
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
exports.MiddlewareManager = exports.ProcessorArray = exports.MiddlewareResult = void 0;
/**
 * Middleware result object, containing the context and/or
 * a potential optional error
 */
class MiddlewareResult {
    get success() {
        return this._error !== undefined;
    }
    set context(value) {
        this._context = value;
    }
    constructor(context, error) {
        this._context = context;
        this._error = error;
    }
}
exports.MiddlewareResult = MiddlewareResult;
class ProcessorArray extends Array {
}
exports.ProcessorArray = ProcessorArray;
class MiddlewareManager {
    constructor() {
        this.middlewares = [];
    }
    // Add middleware to the stack
    use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Compose middleware into a single callable function
     *
     * @returns {(ctx: IMiddlewareContext) => Promise<IMiddlewareContext>}
     */
    compose() {
        return async (ctx) => {
            const dispatch = async (index) => {
                if (index < this.middlewares.length) {
                    const nextMiddleware = this.middlewares[index];
                    await nextMiddleware(ctx, () => dispatch(index + 1));
                }
            };
            await dispatch(0);
            return ctx; // Return the modified context after running through the middleware
        };
    }
    // Process message using the composed middleware stack
    async processMessage(initialContext) {
        const composedMiddleware = this.compose();
        try {
            const finalContext = await composedMiddleware(initialContext);
            return finalContext;
        }
        catch (error) {
            // Handle or rethrow error according to your error handling strategy
            console.error('Middleware processing error:', error);
            throw error; // Rethrowing for external handling, if necessary
        }
    }
}
exports.MiddlewareManager = MiddlewareManager;
