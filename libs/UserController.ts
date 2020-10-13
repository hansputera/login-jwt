import jwt from "jsonwebtoken";
import UserError from "./UserError";
import type { registerData } from "./UserTypes";

const typeControll = ["login", "register"];

export default class UserController {
    constructor(readonly controllType: string) {
        if (!typeControll.includes(controllType.toLowerCase())) {
            throw new UserError("[INVALID_TYPE]", `"${typeControll.join(", ")}" is exists!`);
        }
    }

    _add(data: registerData) {
        return new Promise((resolve, reject) => {
        jwt.sign(data, data.password, { expiresIn: "1M" }, function(error, token) {
            if (error) {
                const struct = {
                    success: false,
                    message: error.message
                };
                reject(struct);
            } else {
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