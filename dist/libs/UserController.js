"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserError_1 = __importDefault(require("./UserError"));
const typeControll = ["login", "register"];
class UserController {
    constructor(controllType) {
        this.controllType = controllType;
        if (!typeControll.includes(controllType.toLowerCase())) {
            throw new UserError_1.default("[INVALID_TYPE]", `"${typeControll.join(", ")}" is exists!`);
        }
    }
    _add(data) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.sign(data, data.password, { expiresIn: "365 days" }, function (error, token) {
                if (error) {
                    const struct = {
                        success: false,
                        message: error.message
                    };
                    reject(struct);
                }
                else {
                    const struct = {
                        success: true,
                        result: { data, token }
                    };
                    resolve(struct);
                }
            });
        });
    }
}
exports.default = UserController;
