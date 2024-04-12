const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager");
const postController = require("../controllers/blogController");
const router = Router();
//router.post("/writePost",verifyToken,postController.writePost);
router.post("/writepost",verifyToken,postController.writePost);
router.get("/getspecificpost/:id",postController.getSpecificPost);
router.patch("/editpost/:id",verifyToken,postController.editPost);
router.delete("/deletepost/:id",verifyToken,postController.deletePost);
router.patch("/likedislike/:id",verifyToken,postController.likedislike);
router.get("/getpost",postController.getPost);
router.get("/getmypost",verifyToken,postController.getUserPost);
router.get("/userpost/:userid", postController.getUserPost);
//router.get("/searchpost",postController.searchPost);
module.exports = router;
