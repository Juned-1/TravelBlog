const { Router } = require("express");
const { validate, validators } = require("../utils/validators");
const {
  userLogin,
  userSignup,
  userLogout,
  signupAuthorization,
  verifyEmail,
  resendSignUpToken,
  forgotPassword,
  resetPassword,
  updatePasswordVerification,
  updatePassword,
  updateEmailVerification,
  emailUpdate,
  googleLogin,
} = require("../controllers/authController");
const userController = require("../controllers/userController");
const { verifyToken, authorize } = require("../utils/token-manager.js");
const router = Router();

//authorization
router.post(
  "/signup",
  validate(validators.signUpValidator),
  signupAuthorization,
  userSignup
);
router.patch("/authenticateEmail/:userid", verifyEmail);
router.get("/rsendsignuptoken/:userid", resendSignUpToken);

router.post("/forgotpassword", forgotPassword);
router.patch(
  "/resetpassword/:userid",
  validate(validators.passwordValidator),
  resetPassword
);

router.post(
  "/updatepasswordverification",
  verifyToken,
  updatePasswordVerification
);
router.patch(
  "/updatepassword",
  validate(validators.passwordValidator),
  verifyToken,
  updatePassword
);

router.post(
  "/updateemailverification",
  validate(validators.emailUpdateValitor),
  verifyToken,
  updateEmailVerification
);
router.patch("/updateemail", verifyToken, emailUpdate);

router.post("/login", validate(validators.loginValidator), userLogin);
router.get("/logout", userLogout);
router.get("/getuserdetails/:userid", userController.getUserDetails);
router.get("/getmydetails", verifyToken, userController.getUserDetails);
router.patch("/setuserdetails", verifyToken, userController.setUserDetails);
router.get("/authstatus", authorize);

//photo
router.post(
  "/uploadphoto",
  verifyToken,
  userController.uploadImages,
  userController.resizePhoto,
  userController.uploadPhoto
);
router.get("/getalbum/:photoType/:userid", userController.getPhotos);
router.get("/getmyalbum/:photoType", verifyToken, userController.getPhotos);
router.get("/getphoto/:photoid", userController.getPhoto);
router.get("/getmyphoto/:photoid", verifyToken, userController.getPhoto);
router.delete("/deletephoto/:photoid", verifyToken, userController.deletePhoto);
router.patch(
  "/activatephoto/:photoid",
  verifyToken,
  userController.activatePhoto
);
router.get(
  "/getactivatedphoto/:photoType/:userid",
  userController.getActivatedPhoto
);
router.get(
  "/getmyactivatedphoto/:photoType",
  verifyToken,
  userController.getActivatedPhoto
);
router.patch(
  "/changephototype/:photoid",
  verifyToken,
  userController.changePhotoType
);
router.patch("/lockalbum", verifyToken, userController.lockAlbum);
router.patch("/unlockalbum", verifyToken, userController.unlockAlbum);
router.patch("/lockphoto/:photoid", verifyToken, userController.lockPhoto);
router.patch("/unlockphoto/:photoid", verifyToken, userController.unlockPhoto);

//following
router.post("/follow/:userid", verifyToken, userController.follows);
router.get("/followerlist/:userid", userController.followerList);
router.get("/myfollowerlist", verifyToken, userController.followerList);
router.get("/followinglist/:userid", userController.followingList);
router.get("/myfollowinglist", verifyToken, userController.followingList);
router.get("/isfollowed/:userid", verifyToken, userController.isFollowed);

//lock profile
router.patch("/lockpofile", verifyToken, userController.lockProfile);
router.patch("/unlockpofile", verifyToken, userController.unlockProfile);

//bio
router.patch("/addbio", verifyToken, userController.addBio);
router.get("/getmybio", verifyToken, userController.getBio);
router.get("/getbio/:userid", userController.getBio);
router.patch("/removebio", verifyToken, userController.removeBio);

//social Link
router.patch("/addsocial", verifyToken, userController.addSocialAccount);
router.get("/getmysocial/:type", verifyToken, userController.getSocialAccount);
router.get("/getsocial/:type/:userid", userController.getSocialAccount);
router.delete(
  "/deletesocial/:socialid",
  verifyToken,
  userController.deleteSocialAccount
);
module.exports = router;
