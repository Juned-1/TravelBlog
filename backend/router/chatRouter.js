const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager");
const chatController = require("../controllers/chatController");
const catchAsync = require("../utils/catchAsync");
module.exports = (io, getReceiverSocketId) => {
  const router = Router();
  router.use(verifyToken);
  router.post(
    "/individualconversation",
    chatController.craeteIndividualConversation
  );
  router.delete(
    "/deleteconversation/:convid",
    chatController.deleteConversation
  );
  router.post(
    "/sendmessage/:convid",
    chatController.uploadAttachment,
    async (req, res, next) =>
      catchAsync(chatController.sendMessage(req, res, next, io, getReceiverSocketId))
    
  );
  router.get("/allconversation", chatController.getAllConversation);
  router.get("/receivemessage/:convid", chatController.getMessage);
  router.delete(
    "/deleteattachment/:attachmentId",
    async (req, res, next) => 
      catchAsync(chatController.deleteAttachment(req, res, next, io, getReceiverSocketId))
  );
  router.delete(
    "/deletemessage/:messageId",
    async (req, res, next) => 
      catchAsync(chatController.deleteMessage(req, res, next, io, getReceiverSocketId))
  );
  router.patch(
    "/editmessage/:messageId",
    async(req, res, next) => 
      catchAsync(chatController.editMessage(req, res, next, io, getReceiverSocketId))
  );
  return router;
};
