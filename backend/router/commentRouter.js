const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager");
const commentController = require("../controllers/commentController");
const router = Router();

router.post(
  "/writecomment/:postid",
  verifyToken,
  commentController.writeComment
);

router.get("/getcomments/:postid", commentController.getComments);
router.get(
  "/getspecificcomment/:commentid",
  verifyToken,
  commentController.getSpecificComment
);
router.patch(
  "/editcomment/:commentid",
  verifyToken,
  commentController.editComment
);

router.delete(
  "/deletecomment/:commentid",
  verifyToken,
  commentController.deleteComment
);
module.exports = router;
