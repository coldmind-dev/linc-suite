"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const cm_error_1 = require("~/error/cm.error");
const cm_error_types_1 = require("~/error/cm.error.types");
class SimpleCancellationToken {
    constructor() {
        this.isCancellationRequested = false;
        this.callbacks = [];
    }
    register(callback) {
        this.callbacks.push(callback);
    }
    cancel() {
        this.isCancellationRequested = true;
        this.callbacks.forEach(cb => cb());
    }
}
// ... Other types and interfaces remain the same
class NanoEngine extends events_1.EventEmitter {
    // ... Other members remain the same
    async runMiddleware(nanoWare, taskInfo, context, next, cancellationToken) {
        const middlewarePromise = new Promise((resolve, reject) => {
            cancellationToken.register(() => reject(new cm_error_1.CMError(cm_error_types_1.TErrorCodes.NANO_PROCESS_TIMEOUT, "Operation cancelled")));
            const result = nanoWare(taskInfo, context, next, cancellationToken);
            if (result instanceof Promise) {
                result.then(resolve).catch(reject);
            }
            else {
                resolve();
            }
        });
        await middlewarePromise;
    }
    async run(taskInfo, context) {
        const result = {};
        const cancellationToken = new SimpleCancellationToken();
        if (this.config.processTimeout) {
            setTimeout(() => cancellationToken.cancel(), this.config.processTimeout);
        }
        let current = this.pipeline.head;
        while (current !== null && !cancellationToken.isCancellationRequested) {
            const { middleware } = current.data;
            await this.runMiddleware(middleware, taskInfo, context, (err) => {
                if (err) {
                    this.config.globalLogger?.error(`Error: ${err.message}`);
                    throw new Error(err.message);
                }
            }, cancellationToken);
            current = current.next;
        }
        return result;
    }
}
// ... Remaining code for configuring and running the NanoEngine stays the same
