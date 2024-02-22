const { COOKIE_NAME } = require("../utils/constants.js");
const { createToken } = require("../utils/token-manager.js");
const { cookieDomain, jwtSecret, environment } = require("../configuration.js");
const { promisify } = require("util");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const createAndSendToken = (user, statusCode, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    //domain: cookieDomain,
    //signed: true, -- only for deployment works for browser not postman
    //path: "/",
  });
  //create token and cookies as response
  const token = createToken(
    user.id.toString(),
    user.email,
    user.firstName + " " + user.lastName,
    "7d"
  );
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  //sending cookie HHTP only cookie from backend to front end, first parameter name of cookie, into root directories of cookies we want to show the cookies
  res.cookie(COOKIE_NAME, token, {
    //path: "/",  -- for deployment
    //domain: cookieDomain,
    expires,
    httpOnly: true,
    //signed: true,
  });
  return res.status(statusCode).json({
    status: "success",
    data: {
      //result: req.body.firstName + " " + req.body.lastName
      user,
    },
  });
};
exports.userSignup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dob: req.body.dob,
      gender: req.body.gender,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const result = newUser.toJSON();
    delete result.password;
    delete result.passwordConfirm;
    createAndSendToken(result, 201, res);
  } else {
    //user already exist
    return next(
      new AppError("User with given email is already registered!", 409)
    );
  }
});

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: ["id", "email", "password", "firstName", "lastName"],
  });
  if (!user || !(await user.verifyPassword(password))) {
    return next(new AppError("Incorrect email or password", 401)); //401 means unauthorised
  }
  const result = user.toJSON();
  delete result.password;
  createAndSendToken(result, 200, res);
});

exports.userLogout = catchAsync(async (req, res, next) => {
  //clear cookies if user login again
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    //domain: cookieDomain,
    //signed: true,
    //path: "/",
  });
  return res
    .status(200)
    .json({ status: "success", message: "logout successful" });
});

//protection of resources
exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it exists
  const token = req.signedCookies[`${COOKIE_NAME}`];
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in first.", 401)
    ); //401 - unauthorised, data sent is correct but user is not authorised
  }
  //2. Verification of token
  const decoded = await promisify(jwt.verify)(token, jwtSecret); //non async function which takes call back can be promisified
  //3. Check if user still exist
  const currentUser = await User.findByPk(decoded.id + 0);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }
  //4. If User changed password after JWT is issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please login again', 401),
  //   );
  // }
  //grant access to protected route
  req.user = currentUser;
  next();
});
