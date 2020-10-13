"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserError_1 = __importDefault(require("./UserError"));
const fs_1 = __importDefault(require("fs"));
class UserSession {
    constructor(path) {
        this.path = path;
        if (!require(path)) {
            throw new UserError_1.default("[USER_SESSION]", "Invalid path");
        }
    }
    _update(token) {
        const file = require(this.path);
        return new Promise((resolve, reject) => {
            if (file[token] == true) {
                reject(`Session for ${token} has active session!`);
            }
            else {
                file[token] = true;
                fs_1.default.writeFile(this.path.replace("../routes/", "./routes/"), JSON.stringify(file, null, 2), { encoding: "utf-8" }, (error) => {
                    if (error) {
                        reject(error.message);
                    }
                    else {
                        resolve(true);
                    }
                });
            }
        });
    }
}
exports.default = UserSession;
