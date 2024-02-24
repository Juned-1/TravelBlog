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
} = require("../controllers/authController");
const {
  getUserDetails,
  setUserDetails,
} = require("../controllers/userController");
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

router.post("/login", validate(validators.loginValidator), userLogin);
router.get("/logout", userLogout);
router.get("/getuserdetails", verifyToken, getUserDetails);
router.patch("/setuserdetails", verifyToken, setUserDetails);
router.get("/authstatus", authorize);

module.exports = router;
