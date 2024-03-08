"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoEngine = exports.TNanoWareOrder = void 0;
const events_1 = require("events");
const cm_error_1 = require("~/error/cm.error");
const cm_error_types_1 = require("~/error/cm.error.types");
const cm_middleware_types_1 = require("~/cm.middleware.types");
var TNanoWareOrder;
(function (TNanoWareOrder) {
    TNanoWareOrder[TNanoWareOrder["runFirst"] = 0] = "runFirst";
    TNanoWareOrder[TNanoWareOrder["runLast"] = 1] = "runLast";
    TNanoWareOrder[TNanoWareOrder["runAfter"] = 2] = "runAfter";
    TNanoWareOrder[TNanoWareOrder["runBefore"] = 3] = "runBefore";
})(TNanoWareOrder || (TNanoWareOrder = {}));
exports.TNanoWareOrder = TNanoWareOrder;
class NanoTaskSlot {
    constructor(middleware, position, reference) {
        this.middleware = middleware;
        this.position = position;
        this.reference = reference;
    }
}
/////////////////////////////////////////////////////////
// IMPLEMENTATION
////////////////////////////////////////////////////////
/**
 * @class NanoEngine
 * @classdesc NanoEngine is a base engine for management of small and
 * specialized tasks.
 */
class NanoEngine extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.pipeline = [];
        this.config = config;
    }
    insertMiddleware(middleware, order, reference) {
        const item = new NanoTaskSlot(middleware, order, reference);
        const index = this.pipeline.findIndex(m => m.middleware === reference);
        if (order === TNanoWareOrder.runFirst) {
            this.pipeline.unshift(item);
        }
        else if (order === TNanoWareOrder.runLast) {
            this.pipeline.push(item);
        }
        else if (order === TNanoWareOrder.runAfter || order === TNanoWareOrder.runBefore) {
            if (index !== -1) {
                this.pipeline.splice(order === TNanoWareOrder.runBefore ? index : index + 1, 0, item);
            }
            else {
                throw cm_error_1.CMError.fromCode(cm_error_types_1.TErrorCodes.errRefMissing);
            }
        }
        else {
            this.pipeline.push(item);
        }
    }
    /**
     * Add a middleware function to the pipeline.
     *
     * @param {TCMNanoWare<Task, Context>} middleware
     * @param {TNanoWareOrder} position
     * @param {TCMNanoWare<Task, Context>} reference
     */
    use(middleware, position, reference) {
        this.insertMiddleware(middleware, position || TNanoWareOrder.runLast, reference || null);
    }
    /**
     * Register one or more middleware functions.
     * @param {TMiddleware<Task, Context>} middlewares
     */
    register(...middlewares) {
        middlewares.forEach(middleware => this.use(middleware));
    }
    /**
     * Runs a single nanoWare function.
     * @param {TMiddleware<Task, Context>} nanoWare - The nanoWare function.
     * @param {Task} taskInfo - The task information.
     * @param {Context} context - The context.
     * @param {TNextFunction} next - The next function in the nanoWare chain.
     */
    async runMiddleware(nanoWare, taskInfo, context, next) {
        const middlewarePromise = nanoWare(taskInfo, context, next);
        if (middlewarePromise instanceof Promise) {
            await this.handleTimeout(middlewarePromise);
        }
    }
    /**
     * Emits a specified event if it is enabled in the configuration.
     * @param {TEvents} eventName - The name of the event to emit.
     * @param {...any[]} args - Additional arguments to pass to the event listeners.
     */
    emitEvent(eventName, ...args) {
        if (this.config[`emit${eventName.charAt(0).toUpperCase()}${eventName.slice(1).toLowerCase()}`]) {
            this.emit(eventName, ...args);
        }
    }
    /**
     * Handles the middleware execution timeout.
     * @param {Promise<void>} middlewarePromise - The middleware promise.
     */
    timeoutPromise() {
        return new Promise((_, reject) => {
            setTimeout(() => reject(cm_error_1.CMError.create(cm_error_types_1.TErrorCodes.errTimeOut, "Middleware timeout")), this.config.processTimeout);
        });
    }
    /**
     * Handles the middleware execution timeout.
     * @param {Promise<void>} middlewarePromise - The middleware promise.
     */
    async handleTimeout(middlewarePromise) {
        await Promise.race([
            middlewarePromise,
            this.timeoutPromise()
        ]);
    }
    /**
     * @method execute
     * Executes the middleware pipeline.
     * @private
     * @param {number} index
     * @param {Task} taskInfo
     * @param {Context} context
     * @returns {Promise<void>}
     */
    async execute(index, taskInfo, context) {
        if (index >= this.pipeline.length) {
            this.emit(cm_middleware_types_1.TNanoEvent.END, taskInfo, context);
            return;
        }
        let nextCalled = false;
        const next = async (err) => {
            if (nextCalled)
                return;
            nextCalled = true;
            if (err && !this.config.muteErrors)
                this.emit(cm_middleware_types_1.TNanoEvent.ERROR, err, taskInfo, context);
            if (this.config.continueOnError || !err)
                await this.execute(index + 1, taskInfo, context);
        };
        let timeOut = this.config.processTimeout || 5000;
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(cm_error_1.CMError.create(cm_error_types_1.TErrorCodes.errTimeOut)), timeOut));
        try {
            const middlewarePromise = this.pipeline[index].middleware(taskInfo, context, next);
            if (middlewarePromise instanceof Promise) {
                await Promise.race([middlewarePromise, timeoutPromise]);
            }
        }
        catch (err) {
            if (!nextCalled && !this.config.muteErrors)
                this.emit(cm_middleware_types_1.TNanoEvent.ERROR, err, taskInfo, context);
            if (!nextCalled && this.config.continueOnError)
                await this.execute(index + 1, taskInfo, context);
        }
    }
    /**
     * @method handleTask
     * Handles task execution through middleware pipeline.
     * @param {Task} taskInfo
     * @param {Context} context
     * @returns {Promise<void>}
     */
    async handleTask(taskInfo, context) {
        this.emit(cm_middleware_types_1.TNanoEvent.BEGIN, taskInfo, context);
        await this.execute(0, taskInfo, context);
    }
}
exports.NanoEngine = NanoEngine;
class CMNanoMiddleware extends NanoEngine {
    constructor(config) {
        super(config);
    }
}
const config = {
    continueOnError: true,
    muteErrors: false,
    processTimeout: 2000,
};
const middleware1 = async (taskInfo, context, next) => {
    console.log("Middleware 1");
    console.log("Task Info:", taskInfo);
    console.log("Context:", context);
    next();
};
const middleware2 = async (taskInfo, context, next) => {
    console.log("Middleware 2");
    if (taskInfo.id < 0) {
        next(cm_error_1.CMError.create(cm_error_types_1.TErrorCodes.errNoTask, "Negative ID found"));
    }
    next();
};
const middleware3 = async (taskInfo, context, next) => {
    console.log("Middleware 3");
    console.log("Task Info:", taskInfo);
    console.log("Context:", context);
    next();
};
const nanoEngine = new CMNanoMiddleware(config);
nanoEngine.on("start", (taskInfo, context) => {
    console.log("Start event emitted");
});
nanoEngine.on("end", (taskInfo, context) => {
    console.log("End event emitted");
});
nanoEngine.on("error", (err, taskInfo, context) => {
    console.log("Error event emitted");
    console.log(err);
});
nanoEngine.register(middleware1, middleware2, middleware3);
const task = {
    id: 1,
    name: "First Task",
};
const context = {
    timestamp: Date.now(),
};
nanoEngine.handleTask(task, context).catch(err => {
    console.error("Error in pipeline:", err);
});
