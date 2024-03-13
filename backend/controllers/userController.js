const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Photo = require("../models/photoModel");
const multer = require("multer");
const sharp = require("sharp");
exports.getUserDetails = catchAsync(async (req, res, next) => {
  const uid = req.tokenData.id; //req.body.id;
  const userDetails = await User.findOne({
    attributes: ["email", "firstName", "lastName", "dob", "gender"],
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
      userDetails: updatedData,
    },
  });
});

//user photo APIs
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    req.body.mimeType = file.mimetype;
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only image.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (req.files.length <= 0)
    return next(new AppError("No image is uploaded!", 400));
  if (req.body.size === "original") {
    req.files = req.files.map((file) => file.buffer);
    return next(); //without return, after finishing next middleware it will again and execute rest body andd try to send response
  }
  let [width, height] = req.body.size.split("x");
  if (!width || !height) {
    width = 2000;
    height = 1333;
  }
  req.body.mimeType = req.body.mimeType.split('/')[0] + '/webp';
  req.files = await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-${req.body.photoType}-${
        req.tokenData.id
      }-${new Date()}-${i + 1}.webp`;
      await sharp(file.buffer)
        .resize(+width, +height)
        .toFormat("webp")
        .webp({ quality: 100 })
        .toFile(`public/images/${filename}`);
      return filename;
    })
  );
  next();
});
exports.uploadImages = upload.array("images", 3);
exports.uploadPhoto = catchAsync(async (req, res, next) => {
  const upload = await Promise.all(
    req.files.map(async (file) => {
      return await Photo.create({
        userId: req.tokenData.id,
        photoType: req.body.photoType,
        photoName: file,
        mimeType: req.body.mimeType,
      });
    })
  );

  if (upload.length <= 0) {
    return next(new AppError("Failed to upload!", 400));
  }
  res.status(200).json({
    status: "success",
    message: "successfully uploaded",
  });
});
exports.getPhotos = catchAsync(async(req,res,next) => {
  const type = req.params.photoType;
  const album = await Photo.findAll({
    where: {photoType: type, userId : req.tokenData.id}
  });
});