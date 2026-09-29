"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static ok(statusCode, message, data = {}) {
        const response = { statusCode, message, data };
        return response;
    }
}
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=response-handler.js.map