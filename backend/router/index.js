import { Router } from "express";
import { userSignup } from "./signup.js";
import { userLogin } from "./login.js";
import { verifyToken } from "../utils/token-manager.js";
import { signUpValidator,loginValidator,validate } from "../utils/validators.js";
import { userlogout } from "./logout.js";
import { writePost } from "./post.js";
import { getPost } from "./getPost.js";
import { userPost } from "./userPost.js";
import { getSpecificPost } from "./getSpecificPost.js";
import { deletePost } from "./deletePost.js";
import { editPost } from "./editPost.js";
import { likedislike } from "./likedislike.js";
const appRouter = Router();

appRouter.post("/signup",validate(signUpValidator),userSignup);
appRouter.post("/login",validate(loginValidator),userLogin);
appRouter.get("/auth-status",verifyToken); //if logged we will verify token using verifyToken
appRouter.get("/logout",userlogout);
appRouter.post("/writePost",writePost);
appRouter.get("/getPost",getPost);
appRouter.get("/userPost",userPost);
appRouter.get("/getSpecificPost",getSpecificPost);
appRouter.get("/deletePost",deletePost);
appRouter.post("/editPost",editPost);
appRouter.post("/likedislike",likedislike);
export default appRouter;