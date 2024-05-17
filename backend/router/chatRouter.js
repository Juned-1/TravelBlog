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
    catchAsync(async (req, res, next) =>
      chatController.sendMessage(req, res, next, io, getReceiverSocketId)
    )
  );
  router.get("/allconversation", chatController.getAllConversation);
  router.get("/receivemessage/:convid", chatController.getMessage);
  router.delete(
    "/deleteattachment/:attachmentId",
    catchAsync(async (req, res, next) => {
      chatController.deleteAttachment(req, res, next, io, getReceiverSocketId);
    })
  );
  router.delete(
    "/deletemessage/:messageId",
    catchAsync((req, res, next) => {
      chatController.deleteMessage(req, res, next, io, getReceiverSocketId);
    })
  );
  router.patch(
    "/editmessage/:messageId",
    catchAsync((req, res, next) => {
      chatController.editMessage(req, res, next, io, getReceiverSocketId);
    })
  );
  return router;
};
