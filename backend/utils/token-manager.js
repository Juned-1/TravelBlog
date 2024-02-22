const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./appError");
const { COOKIE_NAME } = require("./constants");
const { jwtSecret, environment } = require("../configuration");
const catchAsync = require("./catchAsync");
const { cookie } = require("express-validator");

exports.createToken = (id, email, name, expiresIn) => {
  const payload = { id, email, name };
  const tokens = jwt.sign(payload, jwtSecret, {
    expiresIn, //expires time
  });
  return tokens;
};
exports.verifyToken = catchAsync(async (req, res, next) => {
  let token
  // if(environment === 'production'){
  //   token = req.signedCookies[`${COOKIE_NAME}`]; //-- only for deployment signed cookie work with browser not with postman
  // }else{
  //   token = req.cookies.auth_token;
  // }
  token = req.cookies.auth_token;
  //2. Verification of token
  const decoded = await promisify(jwt.verify)(token, jwtSecret); //non async function which takes call back can be promisified
  req.tokenData = decoded;
  next();

});

//authorization with token
exports.authorize = catchAsync(async (req, res, next) => {
  let token
  // if(environment === 'production'){
  //   token = req.signedCookies[`${COOKIE_NAME}`]; //-- only for deployment signed cookie work with browser not with postman
  // }else{
  //   token = req.cookies.auth_token;
  // }
  token = req.cookies.auth_token;
  await promisify(jwt.verify)(token, jwtSecret);
  //res.locals.jwtData = "success";
  return res.status(200).json({
    status: "success",
    message : "Token verified",
  });
});
