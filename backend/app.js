const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const appRouter = require("./router/index.js");
const AppError = require("./utils/appError.js");
const { crossOrigin } = require("./configuration.js");
const { cookieSecret } = require("./configuration");
require("./models");
const app = express();
//cross site request
//app.use(cors({ credentials: true, origin: crossOrigin }));
//setting engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//serving static file
app.use(express.static(path.join(__dirname, "..", "frontEnd","www")));
//bdoy parsing
app.use(express.json({ limit: "50mb" }));
//form parsing
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//cookie Parser
app.use(cookieParser(cookieSecret));

//testing route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"..","frontEnd","www","index.html"));
});
app.use("/api/v1", appRouter);

module.exports = app;
