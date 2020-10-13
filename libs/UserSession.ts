import UserError from "./UserError";
import fs from "fs";
import { sessionData } from "./UserTypes";

export default class UserSession {
    constructor(readonly path: string) {
        if (!require(path)) {
            throw new UserError("[USER_SESSION]", "Invalid path");
        }
    }

    _update(token: string) {
        const file: sessionData = require(this.path);
        return new Promise((resolve, reject) => {
            if (file[token] == true) {
                reject(`Session for ${token} has active session!`);
            } else {
                file[token] = true;
                fs.writeFile(this.path.replace("../routes/", "./routes/"), JSON.stringify(file, null,2), { encoding: "utf-8" }, (error) => {
                    if (error) {
                        reject(error.message);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    }
}