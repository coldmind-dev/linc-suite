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
import { TMiddleware } from "@middleware/middleware.type";
import { IMiddlewareContext } from "@middleware/middleware-context";
import { IMiddlewareError } from "@middleware/middleware-error";
export interface IMiddlewareResult {
    context: IMiddlewareContext;
    error?: IMiddlewareError;
}
/**
 * Middleware result object, containing the context and/or
 * a potential optional error
 */
export declare class MiddlewareResult implements IMiddlewareResult {
    private _context;
    private _error;
    get success(): boolean;
    set context(value: IMiddlewareContext);
    constructor(context?: IMiddlewareContext, error?: IMiddlewareError);
}
export declare type TProcessorArray = Array<TMiddleware>;
export declare class ProcessorArray extends Array<TMiddleware> {
}
export declare class MiddlewareManager {
    private middlewares;
    use(middleware: TMiddleware): void;
    /**
     * Compose middleware into a single callable function
     *
     * @returns {(ctx: IMiddlewareContext) => Promise<IMiddlewareContext>}
     */
    compose(): (ctx: IMiddlewareContext) => Promise<IMiddlewareContext>;
    processMessage(initialContext: IMiddlewareContext): Promise<IMiddlewareContext>;
}
