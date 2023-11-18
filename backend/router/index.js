import { Router } from "express";
import { userSignup } from "./signup.js";
import { userLogin } from "./login.js";
import { verifyToken } from "../utils/token-manager.js";
import { signUpValidator,loginValidator,validate } from "../utils/validators.js";
import { userlogout } from "./logout.js";
const appRouter = Router();

appRouter.post("/signup",validate(signUpValidator),userSignup);
appRouter.post("/login",validate(loginValidator),userLogin);
appRouter.get("/auth-status",verifyToken); //if logged we will verify token using verifyToken
appRouter.get("/logout",userlogout);
export default appRouter;