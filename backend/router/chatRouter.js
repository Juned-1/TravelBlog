const { Router } = require("express");
const { verifyToken } = require("../utils/token-manager");
const chatController = require("../controllers/chatController");
const catchAsync = require("../utils/catchAsync");
module.exports = (io) => {
  const userSocketMap = {}; // {userId: socketId}

  const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
  };

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
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
      chatController.sendMessage(req, res, next, io)
    )
  );
  router.get("/allconversation", chatController.getAllConversation);
  router.get("/receivemessage/:convid", chatController.getMessage);
  router.delete(
    "/deleteattachment/:attachmentId",
    chatController.deleteAttachment
  );
  router.delete("/deletemessage/:messageId", chatController.deleteMessage);
  router.patch("/editmessage/:messageId", chatController.editMessage);
  return router;
};
