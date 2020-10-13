"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const moment_1 = __importDefault(require("moment"));
const UserController_1 = __importDefault(require("../libs/UserController"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_json_1 = __importDefault(require("./session.json"));
const config_json_1 = __importDefault(require("../config.json"));
const UserSession_1 = __importDefault(require("../libs/UserSession"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = require("body-parser");
const router = express_1.Router();
router.use(body_parser_1.json());
router.use(body_parser_1.urlencoded({ extended: false }));
router.use(express_session_1.default({
    secret: "guy-guy-guy",
    resave: false,
    saveUninitialized: true
}));
router.post("/session_list", (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Missing body'
        });
    }
    if (token !== config_json_1.default.env.password) {
        return res.status(403).json({
            success: false,
            message: 'Invalid Password'
        });
    }
    else {
        res.status(200).json(session_json_1.default);
    }
});
router.get("/", (req, res) => {
    res.render("index", { req, isLogged: req.session.isLogged, config: config_json_1.default });
});
router.post("/inputUser", (req, res) => {
    const userName = req.query.username;
    const userPassword = req.query.password;
    const email = req.query.email;
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
    else {
        const userID = Math.floor(Math.random() * 100000000);
        const userControll = new UserController_1.default("register");
        userControll._add({
            userID,
            userName,
            password: userPassword,
            email,
            registeredAt: moment_1.default().utcOffset("+0700").format("LLL")
        }).then((x) => {
            res.status(200).json(x);
        }).catch((e) => {
            res.status(200).json(e);
        });
    }
});
router.get("/logout", (req, res) => {
    if (!req.session.isLogged)
        return res.status(403).json({
            success: false,
            message: 'Invalid session!'
        });
    else {
        req.session.isLogged = false;
        res.status(200).json({
            success: true,
            result: {
                failure_code: null,
                ok: true,
                status: 'Logout'
            }
        });
    }
});
router.post("/changeSession", (req, res) => {
    try {
        const token = req.body.token;
        const password = req.body.password;
        jsonwebtoken_1.default.verify(token, password);
        const sessionControll = new UserSession_1.default("../routes/session.json");
        sessionControll._update(token).then((val) => {
            res.status(200).json({
                success: val,
                result: 'Successfuly updated session'
            });
            req.session.isLogged = true;
        }).catch((er) => {
            res.status(200).json({
                success: false,
                message: er
            });
        });
    }
    catch (e) {
        res.status(200).json({
            success: false,
            message: e
        });
    }
});
module.exports = router;
