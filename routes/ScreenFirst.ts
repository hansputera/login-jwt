import { Router } from "express";
import moment from "moment";
import UserController from "../libs/UserController";
import config from "../config.json";
import session from "express-session";
import { json, urlencoded } from "body-parser";
import { verify } from "jsonwebtoken";
import { registerData } from "../libs/UserTypes";
const router = Router();
import banList from "../banlist.json";
import fs from "fs";
import UserError from "../libs/UserError";


router.use(json());
router.use(urlencoded({ extended: false }));

router.use(session({
    secret: "guy-guy-guy",
    resave: false,
    saveUninitialized: false
}));

router.get("/", (req, res) => {
    console.log(`[STATUS]: ${req.session!.isLogged}`);
    return res.render(
        "index", { req, isLogged: req.session!.isLogged, config }
    );
});

router.post("/verify_token", (req, res) => {
    try {
        if (req.session!.isLogged) return res.status(500).json({
            success: false,
            message: "This session is already signed!"
        });
    const token = req.query.token as string;
    const password = req.query.password as string;
    const usr = req.query.user as string;

    if (!token || !password || !usr) {
        return res.json({ success: false, message: "Missing authenticate!" });
    }
    const result = verify(token, password);
    if ((result as registerData).userAgent != usr) {
        (banList as any)[token] = true;
        fs.writeFile("./banlist.json",
        JSON.stringify(banList, null, 2), (error) => {
            if (error) {
                throw new UserError('[BAN]', error.message);
            }
            return res.status(500).json({
                success: false,
                message: "We have ban your token, you can't use one token in another devices!"
            });
        });
    }
    if ((banList as any)[token]) {
        return res.status(500).json({
            success: false,
            message: "Your token has been banned!"
        });
    }
    req.session!.isLogged = true;
    return res.status(200).json({
        success: true,
        result
    });
}catch(e) {
   return res.status(500).json({ success: false, message: e });
}
});

router.post("/granted_login", (req, res) => {
    try {
        if (req.session!.isLogged) return res.status(500).json({
            success: false,
            message: "This session is already signed!"
        });
        const result = verify(req.query.token as string, req.query.password as string);
        return res.status(200).json({
            success: true,
            result
        });
    } catch(e) {
        return res.status(500).json({
            success: false,
            message: e
        });
    }
});

router.post("/inputUser", (req, res) => {
   const userName = req.query.username as string;
   const userPassword = req.query.password as string;
   const email = req.query.email as string;
   const userAgent = req.query.useragent as string;

   if (!userName) {
       return res.status(403).json({
           success: false,
           message: "Missing queries."
       });
   } else if (!userPassword) {
       return res.status(403).json({
           success: false,
           message: "Missing queries."
       });
    } else if (!email) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    } else if (!userAgent) {
        return res.status(403).json({
            success: false,
            message: "Missing queries."
        });
    } else {
        const userID = Math.floor(Math.random() * 100000000);
        const userControll = new UserController("register");
        userControll._add({
            userID,
            userName,
            password: userPassword,
            email,
            registeredAt: moment().utcOffset("+0700").format("LLL"),
            userAgent: userAgent
        }).then((x) => {
            req.session!.isLogged = true;
            res.status(200).json(x);
            console.log(verify((x as { success: boolean; result: { data: registerData, token: string; }}).result.token, userPassword));
        }).catch((e) => {
            res.status(200).json(e);
        });
    }
});

router.get("/logout", (req, res) => {
    if (!req.session) return res.status(403).json({
        success: false,
        message: 'Invalid session!'
    });
    else {
        req.session!.destroy(function(err: Error) {
            if (err) return res.status(403).json({
                success: false,
                message: err.message
            });
            else res.redirect("/");
        });
    }    
});

export = router;