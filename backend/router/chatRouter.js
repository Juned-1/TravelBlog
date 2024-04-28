const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager");
const chatController = require("../controllers/chatController");
const router = Router();
router.use(verifyToken);
router.post(
  "/individualconversation",
  chatController.craeteIndividualConversation
);
router.delete("/deleteconversation/:convid", chatController.deleteConversation);
router.post(
  "/sendmessage/:convid",
  chatController.uploadAttachment,
  chatController.sendMessage
);

router.get("/allconversation", chatController.getAllConversation);
router.get("/receivemessage/:convid", chatController.getMessage);
router.delete("/deleteattachment/:attachmentId", chatController.deleteAttachment);
router.delete("/deletemessage/:messageId",chatController.deleteMessage);
router.patch("/editmessage/:messageId",chatController.editMessage);
module.exports = router;