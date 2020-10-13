"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
exports.default = UserError;
