"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuedMessage = void 0;
/**
 * Represents a message that is queued for sending
 */
class QueuedMessage {
    constructor(data, resolve, reject) {
        this.data = data;
        this.resolve = resolve;
        this.reject = reject;
    }
    /**
     * Creates a new QueuedMessage instance from a Promise, using the specified data and promise.
     *
     * @param {string} data
     * @param {Promise<any>} promise
     * @returns {QueuedMessage}
     */
    static fromPromise(data, promise) {
        return new QueuedMessage(data, () => promise, () => promise);
    }
}
exports.QueuedMessage = QueuedMessage;
