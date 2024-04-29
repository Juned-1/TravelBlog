const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { jwtSecret, environment } = require("../configuration");
const { encryptAES, decryptAES } = require("../utils/encrypt");
const { User, Photo, Followship, SocialAccount } = require("../models");

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const uid = req.params.userid || req.tokenData.id;
  let userDetails = await User.findOne({
    attributes: [
      "id",
      "email",
      "firstName",
      "lastName",
      "dob",
      "gender",
      "lockProfile",
    ],
    where: {
      id: uid,
    },
  });
  if (!userDetails) {
    return next(new AppError("User does not exist", 400)); //bad request
  }
  userDetails = userDetails.toJSON();
  let mod = false;
  let self = false;
  let following = false;
  if (req.tokenData && req.tokenData.id) {
    mod = true;
    self = userDetails.id === req.tokenData.id;
  }
  const token = req.cookies.auth_token;
  let decoded;
  if (token) {
    decoded = await promisify(jwt.verify)(token, jwtSecret);
    let follow = await Followship.findOne({
      where: { followingId: uid, followerId: decoded.id },
    });
    if (follow) {
      following = true;
    }
  }
  userDetails.modification = mod;
  userDetails.self = self;
  userDetails.following = following;
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
    req.body.mimeType = file.mimetype.split("/")[0];
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
    req.files = await Promise.all(
      req.files.map(async (file, i) => {
        const extension = file.mimetype.split("/")[1];
        const filename = `user-${req.body.photoType}-${
          req.tokenData.id
        }-${new Date()}-${i + 1}.${extension}`;
        await sharp(file.buffer)
          .toFormat(`${extension}`)
          .toFile(path.join("public", "images", filename)); //`public/images/${filename}`
        return filename;
      })
    );
    return next(); //without return, after finishing next middleware it will again and execute rest body andd try to send response
  }
  let [width, height] = req.body.size.split("x");
  if (!width || !height) {
    width = 2000;
    height = 1333;
  }
  req.files = await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-${req.body.photoType}-${
        req.tokenData.id
      }-${new Date()}-${i + 1}.webp`;
      await sharp(file.buffer)
        .resize(+width, +height)
        .toFormat("webp")
        .webp({ quality: 100 })
        .toFile(path.join("public", "images", filename)); //`public/images/${filename}`
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
exports.getPhotos = catchAsync(async (req, res, next) => {
  const type = req.params.photoType;
  const userid = req.params.userid || req.tokenData.id;
  const limitQuery = 10;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  let clause = { photoType: type, userId: userid };
  if (!req.tokenData || !req.tokenData.id) {
    clause.lock = false;
  }
  let album = await Photo.findAll({
    where: clause,
    attributes: { exclude: ["lock"] },
    order: [["createdAt", "DESC"]],
    offset: offsetVal,
    limit: limitQuery,
  });
  if (!album || album.length === 0) {
    return next(new AppError("Failed to find album!", 404));
  }
  album = album.map((photo) => {
    photo = photo.toJSON();
    if (!req.tokenData || !req.tokenData.id) {
      photo.modification = false;
    } else {
      photo.modification = photo.userId === req.tokenData.id;
    }
    return photo;
  });
  res.status(200).json({
    status: "success",
    resultLength: album.length,
    data: {
      album,
    },
  });
});
exports.getPhoto = catchAsync(async (req, res, next) => {
  let photo = await Photo.findOne({
    where: { photoId: req.params.photoid },
    attributes: { exclude: ["lock"] },
  });

  if (!photo) {
    return next(new AppError("No photo found with given id!", 404));
  }
  photo = photo.toJSON();
  if (!req.tokenData || !req.tokenData.id) {
    photo.modification = false;
  } else {
    photo.modification = photo.userId === req.tokenData.id;
  }
  res.status(200).json({
    status: "success",
    data: {
      photo,
    },
  });
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  const photo = await Photo.findByPk(req.params.photoid);
  if (!photo) {
    return next(new AppError("No photo found with given id!", 404));
  }
  if (photo.userId !== req.tokenData.id) {
    return next(
      new AppError("You are not authorized to perform deletion!", 401)
    );
  }
  //create delete path of photo
  const photoFilePath = path.join("public", "images", photo.photoName); //`public/images/${photo.photoName}`;
  await promisify(fs.unlink)(photoFilePath);
  await photo.destroy();
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.activatePhoto = catchAsync(async (req, res, next) => {
  const oldphoto = await Photo.findByPk(req.params.photoid);
  if (!oldphoto) {
    return next(new AppError("No photo found with given id!", 404));
  }
  if (oldphoto.userId !== req.tokenData.id) {
    return next(
      new AppError(
        `You are not authorized to set photo as ${req.body.photoType}!`,
        401
      )
    );
  }
  if (req.body.photoType === "other") {
    return next(new AppError("Only Profile and Cover photo can be set!", 400));
  }
  const change = await Photo.update(
    {
      isActive: false,
    },
    {
      where: { userId: req.tokenData.id, photoType: req.body.photoType },
      individualHooks: true,
    }
  );
  if (!change) {
    return next(new AppError(`Failed to set ${req.body.photoType} photo`, 404));
  }
  const update = await Photo.update(
    { isActive: true },
    {
      where: {
        userId: req.tokenData.id,
        photoType: req.body.photoType,
        photoId: req.params.photoid,
      },
      individualHooks: true,
    }
  );
  if (!update) {
    return next(new AppError(`Failed to set ${req.body.photoType} photo`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `${req.body.photoType} photo is set!`,
  });
});

exports.getActivatedPhoto = catchAsync(async (req, res, next) => {
  const type = req.params.photoType;
  const userid = req.params.userid || req.tokenData.id;
  let clause = { userId: userid, photoType: type, isActive: true };
  if (!req.tokenData || !req.tokenData.id) {
    clause.lock = false;
  }
  let photo = await Photo.findOne({
    where: clause,
    attributes: { exclude: ["lock"] },
  });
  if (!photo) {
    return next(new AppError("No photo found with id!", 404));
  }
  photo = photo.toJSON();
  if (!req.tokenData || !req.tokenData.id) {
    photo.modification = false;
  } else {
    photo.modification = photo.userId === req.tokenData.id;
  }
  res.status(200).json({
    status: "success",
    data: {
      photo,
    },
  });
});

exports.changePhotoType = catchAsync(async (req, res, next) => {
  const oldphoto = await Photo.findByPk(req.params.photoid);
  if (!oldphoto) {
    return next(new AppError("No photo found with given id!", 404));
  }
  if (oldphoto.userId !== req.tokenData.id) {
    return next(
      new AppError(
        `You are not authorized to set change photo as ${req.body.photoType}!`,
        401
      )
    );
  }
  const update = await Photo.update(
    { photoType: req.body.photoType },
    { where: { userId: req.tokenData.id, photoId: req.params.photoid } }
  );
  if (!update) {
    return next(new AppError("Photo is unable to modify", 404));
  }
  res.status(200).json({
    status: "success",
    message: `Photo moved to ${req.body.photoType} album`,
  });
});
exports.lockAlbum = catchAsync(async (req, res, next) => {
  const type = req.body.photoType;
  const update = await Photo.update(
    { lock: true },
    { where: { photoType: type, userId: req.tokenData.id } }
  );
  if (!update) {
    return next(new AppError(`Unable to lock ${type} album`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `${type} album is locked`,
  });
});
exports.unlockAlbum = catchAsync(async (req, res, next) => {
  const type = req.body.photoType;
  const update = await Photo.update(
    { lock: false },
    { where: { photoType: type, userId: req.tokenData.id } }
  );
  if (!update) {
    return next(new AppError(`Unable to unlock ${type} album`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `${type} album is unlocked`,
  });
});

exports.lockPhoto = catchAsync(async (req, res, next) => {
  const type = req.body.photoType;
  const update = await Photo.update(
    { lock: true },
    {
      where: {
        photoType: type,
        photoId: req.params.photoid,
        userId: req.tokenData.id,
      },
    }
  );
  if (!update) {
    return next(new AppError(`Unable to unlock ${type} album`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `${type} photo is locked`,
  });
});

exports.unlockPhoto = catchAsync(async (req, res, next) => {
  const type = req.body.photoType;
  const update = await Photo.update(
    { lock: false },
    {
      where: {
        photoType: type,
        userId: req.tokenData.id,
        photoId: req.params.photoid,
      },
    }
  );
  if (!update) {
    return next(new AppError(`Unable to unlock ${type} album`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `${type} photo is unlocked`,
  });
});

exports.follows = catchAsync(async (req, res, next) => {
  const following = req.params.userid;
  const exist = await Followship.findOne({
    where: { followerId: req.tokenData.id, followingId: following },
  });
  if (exist) {
    await exist.destroy();
    return res.status(200).json({
      status: "success",
      message: "Unfollowed successfully",
      follow: false,
    });
  }
  const follow = await Followship.create({
    followerId: req.tokenData.id,
    followingId: following,
  });
  if (!follow) {
    return next(new AppError("Failed to follow!", 400));
  }
  return res.status(200).json({
    status: "success",
    message: "Followed successfully",
    follow: true,
  });
});

exports.followerList = catchAsync(async (req, res, next) => {
  const userid = req.params.userid || req.tokenData.id;
  const follower = await Followship.findAll({
    attributes: [
      "followerId",
      [
        Sequelize.literal(
          `(SELECT firstName FROM Users WHERE Users.id = Followship.followerId)`
        ),
        "firstName",
      ],
      [
        Sequelize.literal(
          `(SELECT lastName FROM Users WHERE Users.id = Followship.followerId)`
        ),
        "lastName",
      ],
      [
        Sequelize.literal(
          `(SELECT photoName FROM Photos WHERE Photos.userId = Followship.followerId AND Photos.photoType = 'profile' AND Photos.isActive = 1)`
        ),
        "profilePhoto",
      ],
      [
        Sequelize.literal(
          `(SELECT photoId FROM Photos WHERE Photos.userId = Followship.followerId AND Photos.photoType = 'profile' AND Photos.isActive = 1)`
        ),
        "profilePhotoId",
      ],
    ],
    where: { followingId: userid },
  });
  if (!follower) {
    return next(new AppError("No follower found!", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      followers: follower,
    },
  });
});

exports.followingList = catchAsync(async (req, res, next) => {
  const userid = req.params.userid || req.tokenData.id;
  const following = await Followship.findAll({
    attributes: [
      "followingId",
      [
        Sequelize.literal(
          `(SELECT firstName FROM Users WHERE Users.id = Followship.followingId)`
        ),
        "firstName",
      ],
      [
        Sequelize.literal(
          `(SELECT lastName FROM Users WHERE Users.id = Followship.followingId)`
        ),
        "lastName",
      ],
      [
        Sequelize.literal(
          `(SELECT photoName FROM Photos WHERE Photos.userId = Followship.followingId AND Photos.photoType = 'profile' AND Photos.isActive = 1)`
        ),
        "profilePhoto",
      ],
      [
        Sequelize.literal(
          `(SELECT photoId FROM Photos WHERE Photos.userId = Followship.followingId AND Photos.photoType = 'profile' AND Photos.isActive = 1)`
        ),
        "profilePhotoId",
      ],
    ],
    where: { followerId: userid },
  });
  if (!following) {
    return next(new AppError("No Following!", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      followings: following,
    },
  });
});

exports.isFollowed = catchAsync(async (req, res, next) => {
  const userid = req.params.userid;
  const follow = await Followship.findOne({
    where: { followerId: req.tokenData.id, followingId: userid },
  });
  if (!follow) {
    return res.status(200).json({
      status: "success",
      follow: false,
    });
  }
  return res.status(200).json({
    status: "success",
    follow: true,
  });
});

exports.lockProfile = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const update = await User.update(
    { lockProfile: true },
    { where: { id: userid } }
  );
  if (!update) {
    return next(new AppError("Unable to lock", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      lockProfile: true,
    },
  });
});

exports.unlockProfile = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const update = await User.update(
    { lockProfile: false },
    { where: { id: userid } }
  );
  if (!update) {
    return next(new AppError("Unable to lock", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      lockProfile: false,
    },
  });
});

exports.addBio = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const key = userid.slice(0, 32);
  const userbio = await encryptAES(req.body.bio, key);
  const update = await User.update({ bio: userbio }, { where: { id: userid } });
  if (!update) {
    return next(new AppError("Failed to update bio", 404));
  }
  return res.status(201).json({
    status: "success",
    data: {
      bio: req.body.bio,
      modification: true,
    },
  });
});

exports.getBio = catchAsync(async (req, res, next) => {
  const userid = req.params.userid || req.tokenData.id;
  const userBio = await User.findOne({
    attributes: ["bio"],
    where: {
      id: userid,
    },
  });
  if (!userBio) {
    return next(new AppError("Failed to find bio", 404));
  }
  const key = userid.slice(0, 32);
  const bio = await decryptAES(userBio.toJSON().bio, key);
  let modification = true;
  if (!req.tokenData || !req.tokenData.id) {
    modification = false;
  }
  return res.status(200).json({
    status: "success",
    data: {
      bio,
      modification,
    },
  });
});

exports.removeBio = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const update = await User.update({ bio: null }, { where: { id: userid } });
  if (!update) {
    return next(new AppError("Failed to remove bio", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      bio: "",
      modification: true,
    },
  });
});

exports.addSocialAccount = catchAsync(async (req, res, next) => {
  const userid = req.tokenData.id;
  const key = userid.slice(0, 32);
  //socialType = await encryptAES(req.body.socialAccountType, key);
  socialLink = await encryptAES(req.body.socialAccountLink, key);
  let social = await SocialAccount.findOne({
    where: { userId: userid, socialAccountType: req.body.socialAccountType },
  });
  if (!social) {
    social = await SocialAccount.create({
      userId: userid,
      socialAccountType: req.body.socialAccountType,
      socialAccountLink: socialLink,
    });
  } else {
    await social.update({ socialAccountLink: socialLink });
  }
  social = social.toJSON();
  social.socialAccountLink = req.body.socialAccountLink;
  return res.status(201).json({
    status: "success",
    data: {
      modification : true,
      social,
    },
  });
});

exports.getSocialAccount = catchAsync(async (req, res, next) => {
  const userid = req.params.userid || req.tokenData.id;
  const type = req.params.type;
  const key = userid.slice(0, 32);
  let social = await SocialAccount.findOne({
    where: { userId: userid, socialAccountType: type },
  });
  if (!social) {
    return next(new AppError(`No ${type} account link is found`, 400));
  }
  social = social.toJSON();
  social.socialAccountLink = await decryptAES(social.socialAccountLink, key);
  let modification = true;
  if(!req.tokenData || !req.tokenData.id){
    modification = false;
  }
  return res.status(200).json({
    status: "success",
    data: {
      modification,
      social,
    },
  });
});

exports.deleteSocialAccount = catchAsync(async (req, res, next) => {
  const social = await SocialAccount.destroy({
    where : {
      socialId : req.params.socialid
    }
  });
  if(!social){
    return next(new AppError(`Failed to delete social account!`,400));
  }
  return res.status(204).json({
    status : 'success',
    data : {
      modification : true
    }
  });
})