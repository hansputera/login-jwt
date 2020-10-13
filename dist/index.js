"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.set("view engine", "ejs");
app.use('/', require("./routes/ScreenFirst"));
const listener = app.listen(process.env.PORT ? process.env.PORT : 7777, () => {
    console.info(`Listening to ${listener.address().port}`);
});
