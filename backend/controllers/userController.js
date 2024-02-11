const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
exports.getUserDetails = catchAsync(async (req, res, next) => {
  const uid = req.tokenData.id; //req.body.id;
  const userDetails = await User.findOne({
    attributes: ["email","firstName", "lastName", "dob", "gender"],
    where: {
      id: uid,
    },
  });
  if (!userDetails) {
    return next(new AppError("User does not exist", 400)); //bad request
  }
  return res.status(200).json({
    status: "success",
    data: {
      userDetails,
    },
  });
});

exports.setUserDetails = catchAsync(async (req, res, next) => {
  const uid = req.tokenData.id; //req.body.id;
  const updatedData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dob: req.body.dob,
    gender: req.body.gender,
  };
  const result = await User.update(updatedData, {
    where: {
      id: uid,
    },
    individualHooks: true,
  });
  if (!result) {
    return next(new AppError("User does not exist with given ID", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      userDetails: updatedData
    }
  });
});
