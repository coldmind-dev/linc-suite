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
exports.CMSignalHub = void 0;
/**
 * Implements a simple subject that allows observers to subscribe and receive
 * updates, errors, and completion notifications. It can also be consumed as a promise.
 * @class EnhancedSubject
 * @template T The type of items that the subject can emit.
 */
class CMSignalHub {
    constructor() {
        this.observers = [];
        this.errorCallbacks = [];
        this.completeCallbacks = [];
        this.isCompleted = false;
        this.hasErrored = false;
        this.promiseResolve = null;
        this.promiseReject = null;
    }
    subscribe(observer, error, complete) {
        if (this.isCompleted || this.hasErrored) {
            return { unsubscribe: () => { } };
        }
        this.observers.push(observer);
        if (error)
            this.errorCallbacks.push(error);
        if (complete)
            this.completeCallbacks.push(complete);
        return {
            unsubscribe: () => {
                this.observers = this.observers.filter(obs => obs !== observer);
                this.errorCallbacks = this.errorCallbacks.filter(errCb => errCb !== error);
                this.completeCallbacks = this.completeCallbacks.filter(compCb => compCb !== complete);
            },
        };
    }
    asPromise() {
        return new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
    }
    next(value) {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.lastValue = value;
        this.observers.forEach(observer => observer(value));
        if (this.promiseResolve) {
            this.promiseResolve(value);
            this.clearPromiseHandlers();
        }
    }
    error(errorValue) {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.errorCallbacks.forEach(errorCb => errorCb(errorValue));
        this.hasErrored = true;
        if (this.promiseReject) {
            this.promiseReject(errorValue);
            this.clearPromiseHandlers();
        }
        this.clearObservers();
    }
    complete() {
        if (this.isCompleted || this.hasErrored) {
            return;
        }
        this.completeCallbacks.forEach(completeCb => completeCb());
        this.isCompleted = true;
        this.clearObservers();
    }
    /**
     * Clears all observers and their associated callbacks
     *
     * @private
     */
    clearObservers() {
        this.observers = [];
        this.errorCallbacks = [];
        this.completeCallbacks = [];
    }
    /**
     * Resets the promise handlers to null after resolving or rejecting
     *
     * @private
     */
    clearPromiseHandlers() {
        this.promiseResolve = null;
        this.promiseReject = null;
    }
    clear() {
        this.clearObservers();
        this.clearPromiseHandlers();
    }
}
exports.CMSignalHub = CMSignalHub;
