/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-11
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
/// <reference types="node" />
import { EventEmitter } from "events";
import { TErrorCodes } from "./error/cm.error.types";
interface ICMError {
    message: string;
    code: TErrorCodes;
    error?: ICMError | any;
}
declare type TNextFunction = (err?: ICMError) => void;
/**888ö
 * Type for the next function, optionally accepting an error.
 */
declare type TCMNextFunc = (err?: ICMError) => void;
/**
 * Type for a middleware function.
 */
declare type TCMNanoWare<Task = {}, Context = {}> = (taskInfo: Task, context: Context, next: TCMNextFunc) => Promise<void> | void;
/**
 * Configuration for middleware.
 */
interface INanoEngineConfig {
    debugMode?: boolean;
    continueOnError?: boolean;
    muteErrors?: boolean;
    processTimeout?: number;
}
declare enum TNanoWareOrder {
    runFirst = 0,
    runLast = 1,
    runAfter = 2,
    runBefore = 3
}
/**
 * @interface NanoCoreTaskSlot
 * Defines a slot for holding middleware, its position, and reference.
 */
interface INanoTaskSlot<Task, Context> {
    middleware: TCMNanoWare<Task, Context>;
    position: TNanoWareOrder | null;
    reference: TCMNanoWare<Task, Context> | null;
}
/**
 * @class NanoEngine
 * @classdesc NanoEngine is a base engine for management of small and
 * specialized tasks.
 */
declare abstract class NanoEngine<Task = any, Context = any> extends EventEmitter {
    private pipeline;
    private config;
    constructor(config: INanoEngineConfig);
    private insertMiddleware;
    /**
     * Add a middleware function to the pipeline.
     *
     * @param {TCMNanoWare<Task, Context>} middleware
     * @param {TNanoWareOrder} position
     * @param {TCMNanoWare<Task, Context>} reference
     */
    use(middleware: TCMNanoWare<Task, Context>, position?: TNanoWareOrder, reference?: TCMNanoWare<Task, Context>): void;
    /**
     * Register one or more middleware functions.
     * @param {TMiddleware<Task, Context>} middlewares
     */
    register(...middlewares: TCMNanoWare<Task, Context>[]): void;
    /**
     * Runs a single nanoWare function.
     * @param {TMiddleware<Task, Context>} nanoWare - The nanoWare function.
     * @param {Task} taskInfo - The task information.
     * @param {Context} context - The context.
     * @param {TNextFunction} next - The next function in the nanoWare chain.
     */
    private runMiddleware;
    /**
     * Emits a specified event if it is enabled in the configuration.
     * @param {TEvents} eventName - The name of the event to emit.
     * @param {...any[]} args - Additional arguments to pass to the event listeners.
     */
    private emitEvent;
    /**
     * Handles the middleware execution timeout.
     * @param {Promise<void>} middlewarePromise - The middleware promise.
     */
    private timeoutPromise;
    /**
     * Handles the middleware execution timeout.
     * @param {Promise<void>} middlewarePromise - The middleware promise.
     */
    private handleTimeout;
    /**
     * @method execute
     * Executes the middleware pipeline.
     * @private
     * @param {number} index
     * @param {Task} taskInfo
     * @param {Context} context
     * @returns {Promise<void>}
     */
    private execute;
    /**
     * @method handleTask
     * Handles task execution through middleware pipeline.
     * @param {Task} taskInfo
     * @param {Context} context
     * @returns {Promise<void>}
     */
    handleTask(taskInfo: Task, context: Context): Promise<void>;
}
export { TCMNanoWare, TNextFunction, INanoEngineConfig, INanoTaskSlot, TNanoWareOrder, NanoEngine };
