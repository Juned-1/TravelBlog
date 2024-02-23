const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const appRouter = require("./router/index.js");
const sequelize = require("./utils/dbConnection.js");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const { cookieSecret, environment } = require("./configuration");
const User = require("./models/userModel.js");
const app = express();

//setting engine
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//serving static file
app.use(express.static(path.join(__dirname,'public')));
//bdoy parsing
app.use(express.json({ limit: "50mb" }));
//form parsing
app.use(express.urlencoded({extended: true, limit: '10kb'}));
//cross site request
app.use(cors({ credentials: true, origin: "http://localhost:8100" }));
//cookie Parser
app.use(cookieParser(cookieSecret));
app.use("/api/v1", appRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404));
});
//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
