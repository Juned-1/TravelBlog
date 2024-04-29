const crypto = require("crypto");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { COOKIE_NAME } = require("../utils/constants.js");
const { createToken } = require("../utils/token-manager.js");
const { cookieDomain, jwtSecret, environment, googleClientID, googleClientSecret } = require("../configuration.js");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appError.js");
const Email = require("../utils/email.js");
const { User, Token } = require("../models");
const { Strategy } = require("passport-google-oauth20");
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

const createVerificationToken = () => {
  const token = crypto.randomBytes(16).toString("hex");
  return token;
};
exports.signupAuthorization = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return next();
  const result = user.toJSON();
  if (!result.isVerified) {
    const token = createVerificationToken();
    const findToken = await Token.findOne({
      where: { userId: result.id },
    });

    if (!findToken) {
      return next(new AppError("User is not signed Up!", 400));
    }
    const curDate = new Date();
    const updateToken = await Token.update(
      {
        token,
        time: new Date(curDate.setMinutes(curDate.getMinutes() + 10)),
      },
      {
        where: { userId: result.id },
      }
    );
    if (!updateToken) {
      return next(new AppError("Verification failed! Please Try again!", 400));
    }
    const updatedUser = User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dob: req.body.dob,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      },
      {
        where: { id: result.id },
        individualHooks: true,
      }
    );
    if (!updatedUser) {
      return next(new AppError("Server is unable to process data.", 400));
    }
    delete result.password;
    delete result.isVerified;
    await new Email(result, token).sendEmailVerificationCode();
    return res.status(200).json({
      status: "success",
      data: {
        id: result.id,
      },
    });
  } else {
    //user exists and verified
    return next(
      new AppError("User with given email is already registered!", 409)
    );
  }
});
exports.userSignup = catchAsync(async (req, res, next) => {
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
  if (newUser) {
    const token = createVerificationToken();
    const curDate = new Date();
    const sendToken = await Token.create({
      userId: result.id,
      token,
      time: new Date(curDate.setMinutes(curDate.getMinutes() + 10)),
    });
    if (!sendToken) {
      return next(new AppError("Verification failed! Please Try again!", 409));
    }
    delete result.password;
    delete result.passwordConfirm;
    delete result.isVerified;
    await new Email(result, token).sendEmailVerificationCode();
    return res.status(201).json({
      status: "success",
      data: {
        id: result.id,
      },
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Something wrong!",
  });
});
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.userid);
  const result = user.toJSON();
  if (!user) {
    return next(new AppError("User is not signed up! Please sign up.", 401));
  } else if (result.isVerified) {
    return res.status(200).json({
      status: "success",
      message: "User with given email is already registered!",
    });
  }
  const token = req.body.token;
  const usertoken = await Token.findOne({
    where: {
      userId: req.params.userid,
    },
  });
  if (!usertoken) {
    return next(
      new AppError(
        "Your verification token is expired. Please click Resend",
        400
      )
    );
  }
  if (token !== usertoken.toJSON().token || new Date() > usertoken.time) {
    return next(
      new AppError("Invalid Token or Expired! Click Resend to get Token", 400)
    );
  }
  const updatedUser = await User.update(
    {
      isVerified: true,
    },
    {
      where: {
        id: usertoken.toJSON().userId,
      },
    }
  );
  if (!updatedUser) {
    return res.status(500).send({ message: error.message });
  }
  delete result.password;
  delete result.isVerified;
  await new Email(user, "http://127.0.0.1:8100").sendWelcome();
  createAndSendToken(result, 200, res);
});
exports.resendSignUpToken = catchAsync(async (req, res, next) => {
  const token = createVerificationToken();
  const curDate = new Date();
  const updateToken = await Token.update(
    { token, time: new Date(curDate.setMinutes(curDate.getMinutes() + 10)) },
    {
      where: { userId: req.params.userid },
    }
  );
  if (!updateToken) {
    return next(new AppError("Verification failed! Please Try again!", 400));
  }
  const user = await User.findOne({
    where: { id: req.params.userid },
  });
  if (!user) {
    return next(new AppError("Invalid User. Try agin!", 400));
  }
  const result = user.toJSON();
  delete result.password;
  delete result.isVerified;
  await new Email(result, token).sendEmailVerificationCode();
  return res.status(200).json({
    status: "success",
    message: "Email is sent to your email.",
  });
});
exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: [
      "id",
      "email",
      "password",
      "firstName",
      "lastName",
      "isVerified",
    ],
  });
  if (!user || !(await user.verifyPassword(password))) {
    return next(new AppError("Incorrect email or password", 401)); //401 means unauthorised
  }
  const result = user.toJSON();
  if (!result.isVerified) {
    return next(new AppError("User is not verified! Signup Properly.", 400));
  }
  delete result.password;
  delete result.isVerified;
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
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if (!user) {
    return next(new AppError("User email is inavlid!", 404));
  }
  const result = user.toJSON();
  if (!result.isVerified) {
    return next(new AppError("Unauthenticated user, Sign Up first!", 401));
  }
  let token = "TB-" + crypto.randomBytes(4).toString("hex");
  const curDate = new Date();
  const updateToken = await Token.update(
    { token, time: new Date(curDate.setMinutes(curDate.getMinutes() + 10)) },
    {
      where: { userId: result.id },
    }
  );
  if (!updateToken) {
    return next(new AppError("Verification failed! Please Try again!", 400));
  }
  delete result.password;
  delete result.isVerified;
  await new Email(user, token).sendPasswordReset();
  return res.status(200).json({
    status: "success",
    id: result.id,
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.body.token;
  let userToken = await Token.findOne({
    where: { userId: req.params.userid },
  });
  if (!userToken) {
    return next(new AppError("Invalid Token!", 400));
  }
  userToken = userToken.toJSON();
  if (new Date() > userToken.time || userToken.token !== token) {
    return next(
      new AppError(
        "Token Expired or Invalid! Please click resend to get new token.",
        400
      )
    );
  }
  const updated = await User.update(
    {
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    },
    {
      where: { id: req.params.userid },
      individualHooks: true,
    }
  );
  if (!updated) {
    return next(new AppError("Password Reset Failed! Try again.", 400));
  }
  return res.status(200).json({
    status: "success",
    message: "Password is Reset! You may log in Now.",
  });
});
exports.updatePasswordVerification = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if (!user) {
    return next(new AppError("User email is inavlid!", 404));
  }
  return res.status(200).json({
    status: "success",
    value: true,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const update = await User.update(
    {
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    },
    {
      where: { id: userid },
      individualHooks: true,
    }
  );
  if (!update) {
    return next(new AppError("Unable to modify password", 400));
  }
  return res.status(200).json({
    status: "success",
    message: "Password is updated successfully",
  });
});

exports.updateEmailVerification = catchAsync(async (req, res, next) => {
  const oldEmail = req.body.oldEmail;
  const newEmail = req.body.newEmail;
  const user = await User.findOne({
    where: { email: oldEmail },
  });
  if (!user) {
    return next(new AppError("Invalid User Email", 404));
  }
  let token = "TB-" + crypto.randomBytes(4).toString("hex");
  const curDate = new Date();
  const updateToken = await Token.update(
    { token, time: new Date(curDate.setMinutes(curDate.getMinutes() + 10)) },
    {
      where: { userId: req.tokenData.id },
    }
  );
  if (!updateToken) {
    return next(new AppError("Verification failed! Please Try again!", 400));
  }
  await new Email(
    {
      email: newEmail,
      firstName: user.toJSON().firstName,
    },
    token
  ).sendEmailUpdate();
  res.status(200).json({
    status: "success",
    message: `Verification code is sent to ${newEmail}`,
    data: {
      id: req.tokenData.id,
      newEmail,
    },
  });
});

exports.emailUpdate = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const token = req.body.token;
  let userToken = await Token.findOne({
    where: { userId: req.tokenData.id },
  });
  if (!userToken) {
    return next(new AppError("Invalid Token!", 400));
  }
  userToken = userToken.toJSON();
  if (new Date() > userToken.time || userToken.token !== token) {
    return next(
      new AppError(
        "Token Expired or Invalid! Please click resend to get new token.",
        400
      )
    );
  }
  const updated = await User.update(
    { email },
    {
      where: { id: req.tokenData.id },
      individualHooks: true,
    }
  );
  if (!updated) {
    return next(new AppError("Email Updation Failed! Try again.", 400));
  }
  return res.status(200).json({
    status: "success",
    message: "Email is Updated",
  });
});

/*exports.googleLogin = catchAsync(async (req, res, next) => {
  const strategy = new GoogleStrategy({
    clientID : googleClientID,
    clientSecret : googleClientSecret,
    callbackURL : 'http://localhost:8081'
  });
  passport.use(strategy, function (accessToken, refreshToken, profile, done){
    console.log(profile);
    done(null,profile);
  });
  //console.log(val);
  res.status(200).json({
    status : 'successful',
    data : {
      val
    }
  });
});*/