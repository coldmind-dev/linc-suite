"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareError = exports.MiddlewareErrorType = void 0;
const middleware_status_1 = require("@middleware/middleware.status");
var MiddlewareErrorType;
(function (MiddlewareErrorType) {
    MiddlewareErrorType["Client"] = "client";
    MiddlewareErrorType["Server"] = "server";
})(MiddlewareErrorType || (exports.MiddlewareErrorType = MiddlewareErrorType = {}));
class MiddlewareError {
    constructor(type, ctx, message, statusCode, error) {
        this.type = type;
        this.ctx = ctx;
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
    /**
     * Constructs a new MiddlewareError instance from an error object
     */
    static fromError(error, ctx, type = MiddlewareErrorType.Server) {
        return new MiddlewareError(type, ctx, error.message, middleware_status_1.MiddlewareStatus.Failure, error);
    }
}
exports.MiddlewareError = MiddlewareError;
