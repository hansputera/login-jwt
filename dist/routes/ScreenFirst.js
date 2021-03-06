"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const moment_1 = __importDefault(require("moment"));
const UserController_1 = __importDefault(require("../libs/UserController"));
const config_json_1 = __importDefault(require("../config.json"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = require("body-parser");
const jsonwebtoken_1 = require("jsonwebtoken");
const router = express_1.Router();
const banlist_json_1 = __importDefault(require("../banlist.json"));
const fs_1 = __importDefault(require("fs"));
const UserError_1 = __importDefault(require("../libs/UserError"));
router.use(body_parser_1.json());
router.use(body_parser_1.urlencoded({ extended: false }));
router.use(express_session_1.default({
    secret: "guy-guy-guy",
    resave: false,
    saveUninitialized: false
}));
router.get("/", (req, res) => {
    console.log(`[STATUS]: ${req.session.isLogged}`);
    return res.render("index", { req, isLogged: req.session.isLogged, config: config_json_1.default });
});
router.post("/verify_token", (req, res) => {
    try {
        if (req.session.isLogged)
            return res.status(500).json({
                success: false,
                message: "This session is already signed!"
            });
        const token = req.query.token;
        const password = req.query.password;
        if (!token || !password) {
            return res.json({ success: false, message: "Missing authenticate!" });
        }
        const result = jsonwebtoken_1.verify(token, password);
        if (result.userAgent != req.headers["user-agent"] ? req.headers["user-agent"] : result.userAgent) {
            banlist_json_1.default[token] = true;
            fs_1.default.writeFile("./banlist.json", JSON.stringify(banlist_json_1.default, null, 2), (error) => {
                if (error) {
                    throw new UserError_1.default('[BAN]', error.message);
                }
                return res.status(500).json({
                    success: false,
                    message: "We have ban your token, you can't use one token in another devices!"
                });
            });
        }
        req.session.isLogged = true;
        return res.status(200).json({
            success: true,
            result
        });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e });
    }
});
router.post("/granted_login", (req, res) => {
    try {
        if (req.session.isLogged)
            return res.status(500).json({
                success: false,
                message: "This session is already signed!"
            });
        const result = jsonwebtoken_1.verify(req.query.token, req.query.password);
        return res.status(200).json({
            success: true,
            result
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e
        });
    }
});
router.post("/inputUser", (req, res) => {
    const userName = req.query.username;
    const userPassword = req.query.password;
    const email = req.query.email;
    const userAgent = req.query.useragent;
    if (!userName) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    }
    else if (!userPassword) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    }
    else if (!email) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    }
    else if (!userAgent) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    }
    else {
        const userID = Math.floor(Math.random() * 100000000);
        const userControll = new UserController_1.default("register");
        userControll._add({
            userID,
            userName,
            password: userPassword,
            email,
            registeredAt: moment_1.default().utcOffset("+0700").format("LLL"),
            userAgent: userAgent
        }).then((x) => {
            req.session.isLogged = true;
            res.status(200).json(x);
            console.log(jsonwebtoken_1.verify(x.result.token, userPassword));
        }).catch((e) => {
            res.status(200).json(e);
        });
    }
});
router.get("/logout", (req, res) => {
    if (!req.session)
        return res.status(403).json({
            success: false,
            message: 'Invalid session!'
        });
    else {
        req.session.destroy(function (err) {
            if (err)
                return res.status(403).json({
                    success: false,
                    message: err.message
                });
            else
                res.redirect("/");
        });
    }
});
module.exports = router;
