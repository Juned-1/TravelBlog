const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const appRouter = require("./router/index.js");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const { cookieSecret, environment } = require("./configuration");
require("./models");
const app = express();
//cross site request
app.use(cors({ credentials: true, origin: "http://localhost:8100" }));
//setting engine
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//serving static file
app.use(express.static(path.join(__dirname,'public')));
//bdoy parsing
app.use(express.json({ limit: "50mb" }));
//form parsing
app.use(express.urlencoded({extended: false, limit: '50mb'}));

//cookie Parser
app.use(cookieParser(cookieSecret));

//passport session set up
//app.use(passport.initialize());
//app.use(passport.session());

app.use("/api/v1", appRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404));
});
//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
