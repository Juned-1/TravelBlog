const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./appError");
const { COOKIE_NAME } = require("./constants");
const { jwtSecret } = require("../configuration");
const catchAsync = require("./catchAsync");

exports.createToken = (id, email, name, expiresIn) => {
  const payload = { id, email, name };
  const tokens = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn, //expires time
  });
  return tokens;
};
exports.verifyToken = catchAsync(async (req, res, next) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  // if (!token || token.trim() == "") {
  //   return next(new AppError("Token not received", 401));
  // }
  //2. Verification of token
  const decoded = await promisify(jwt.verify)(token, jwtSecret); //non async function which takes call back can be promisified
  req.tokenData = decoded;
  next();
  //res.locals.jwtData = "success";

});

//authorization with token
exports.authorize = catchAsync(async (req, res, next) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  // if (!token || token.trim() == "") {
  //   return next(new AppError("Token not received", 401));
  // }
  //2. Verification of token
  await promisify(jwt.verify)(token, jwtSecret); //non async function which takes call back can be promisified
  //next();
  //res.locals.jwtData = "success";
  return res.status(200).json({
    status: "success",
    message : "Token verified",
  });
});
