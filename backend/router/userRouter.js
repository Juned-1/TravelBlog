const { Router } = require("express");
const { validate, validators } = require("../utils/validators");
const {userLogin, userSignup, userLogout} = require("../controllers/authController");
const { getUserDetails } = require("../controllers/userController");
const { verifyToken, authorize } = require("../utils/token-manager.js");
const router = Router();

router.post("/signup", validate(validators.signUpValidator), userSignup);
router.post("/login", validate(validators.loginValidator), userLogin);
router.get("/logout", userLogout);
router.get("/userdetails",verifyToken,getUserDetails);
router.get("/authstatus",authorize);
module.exports = router;