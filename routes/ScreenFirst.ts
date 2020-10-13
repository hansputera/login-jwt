import { Router } from "express";
import moment from "moment";
import UserController from "../libs/UserController";
import config from "../config.json";
import session from "express-session";
import { json, urlencoded } from "body-parser";
const router = Router();


router.use(json());
router.use(urlencoded({ extended: false }));

router.use(session({
    secret: "guy-guy-guy",
    resave: false,
    saveUninitialized: true
}));

router.get("/", (req, res) => {
    res.render(
        "index", { req, isLogged: req.session!.isLogged, config }
    );
});

router.post("/inputUser", (req, res) => {
   const userName = req.query.username as string;
   const userPassword = req.query.password as string;
   const email = req.query.email as string;

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
    } else {
        const userID = Math.floor(Math.random() * 100000000);
        const userControll = new UserController("register");
        userControll._add({
            userID,
            userName,
            password: userPassword,
            email,
            registeredAt: moment().utcOffset("+0700").format("LLL")
        }).then((x) => {
            req.session!.isLogged = true;
            res.status(200).json(x);
        }).catch((e) => {
            res.status(200).json(e);
        });
    }
});

router.get("/logout", (req, res) => {
    if (!req.session!.isLogged) return res.status(403).json({
        success: false,
        message: 'Invalid session!'
    });
    else {
        req.session!.isLogged = false;
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

export = router;