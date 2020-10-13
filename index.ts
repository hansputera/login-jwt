import express from "express";
const app = express();

app.set("view engine", "ejs");

app.use('/', require("./routes/ScreenFirst"));

const listener = app.listen(process.env.PORT ? process.env.PORT : 7777, () => {
    console.info(`Listening to ${(listener.address() as any).port}`);
});