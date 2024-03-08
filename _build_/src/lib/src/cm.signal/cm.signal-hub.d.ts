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
/**
 * Type definition for observer functions.
 * @callback Observer
 * @param {T} value The value emitted by the subject.
 */
type Observer<T> = (value: T) => void;
/**
 * Type definition for error callback functions.
 * @callback ErrorCallback
 * @param {any} error The error emitted by the subject.
 */
type ErrorCallback = (error: any) => void;
/**
 * Type definition for complete callback functions.
 * @callback CompleteCallback
 * Signals the completion of the subject's emissions.
 */
type CompleteCallback = () => void;
/**
 * Interface for subscription objects returned by the subscribe method.
 * @interface Subscription
 */
interface Subscription {
    /**
     * Unsubscribes from the subject to stop receiving notifications.
     */
    unsubscribe: () => void;
}
export { Observer, ErrorCallback, CompleteCallback, Subscription };
export interface ICMSignalHub<T> {
    /**
     * Subscribes an observer to this subject.
     * @param {Observer<T>} observer The observer function to notify on new emissions.
     * @param {ErrorCallback} [error] Optional error handler for receiving error notifications.
     * @param {CompleteCallback} [complete] Optional complete handler for receiving completion signal.
     * @returns {Subscription} An object that can be used to unsubscribe the observer from the subject.
     */
    subscribe(observer: Observer<T>, error?: ErrorCallback, complete?: CompleteCallback): Subscription;
    /**
     * Emits a value to all subscribed observers.
     * @param {T} value The value to emit.
     */
    next(value: T): void;
    /**
     * Converts the subject into a promise that resolves with the next emitted value or rejects if the subject errors.
     * @returns {Promise<T>} A promise representing the next emitted value.
     */
    asPromise(): Promise<T>;
    /**
     * Signals that an Error have been encountered and stops any further emissions.
     */
    error(errorValue: any): void;
    /**
     * Signals completion to all observers and stops any further emissions.
     */
    complete(): void;
    /**
     * Clears all observers and their associated callbacks as well
     * as setting any promise handlers to null after resolving or rejecting.
     * @private
     */
    clear(): void;
}
/**
 * Implements a simple subject that allows observers to subscribe and receive
 * updates, errors, and completion notifications. It can also be consumed as a promise.
 * @class EnhancedSubject
 * @template T The type of items that the subject can emit.
 */
export declare class CMSignalHub<T> implements ICMSignalHub<T> {
    private observers;
    private errorCallbacks;
    private completeCallbacks;
    private isCompleted;
    private hasErrored;
    private lastValue;
    private promiseResolve;
    private promiseReject;
    subscribe(observer: Observer<T>, error?: ErrorCallback, complete?: CompleteCallback): Subscription;
    asPromise(): Promise<T>;
    next(value: T): void;
    error(errorValue: any): void;
    complete(): void;
    /**
     * Clears all observers and their associated callbacks
     *
     * @private
     */
    private clearObservers;
    /**
     * Resets the promise handlers to null after resolving or rejecting
     *
     * @private
     */
    private clearPromiseHandlers;
    clear(): void;
}
