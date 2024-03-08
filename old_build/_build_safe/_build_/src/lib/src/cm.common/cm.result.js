"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMResult = void 0;
class CMResult {
    constructor(success, data, error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}
exports.CMResult = CMResult;
