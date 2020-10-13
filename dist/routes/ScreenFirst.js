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
const router = express_1.Router();
router.use(body_parser_1.json());
router.use(body_parser_1.urlencoded({ extended: false }));
router.use(express_session_1.default({
    secret: "guy-guy-guy",
    resave: false,
    saveUninitialized: true
}));
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
            req.session.isLogged = true;
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
module.exports = router;
