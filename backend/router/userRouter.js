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
} = require("../controllers/authController");
const userController = require("../controllers/userController");
const { verifyToken, authorize } = require("../utils/token-manager.js");
const router = Router();

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
router.get("/getuserdetails", verifyToken, userController.getUserDetails);
router.patch("/setuserdetails", verifyToken, userController.setUserDetails);
router.get("/authstatus", authorize);
router.post("/uploadphoto/:userid", userController.uploadPhoto);
module.exports = router;
