const multer = require("multer");
const path = require("path");;
const fs = require("fs");
const { promisify } = require("util");
const { Sequelize, Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const {
  Participant,
  Conversation,
  Message,
  Attachment,
  User,
  sequelize,
} = require("../models");
const AppError = require("../utils/appError");
const { encryptAES, decryptAES } = require("../utils/encrypt");

//creating file if does not exist
const uploadDirectory = path.join("public", "chat-attachment");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
//multer storage set up
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); //first argument is error -- if no error then null
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `attachment-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });
exports.uploadAttachment = upload.array("attachments", 3);

//helper function


//controlllers
exports.craeteIndividualConversation = catchAsync(async (req, res, next) => {
  let senderId = req.tokenData.id;
  let recipientId = req.body.recipientId;
  let conversation = await Conversation.findAll({
    where: {
      conversationType: "individual",
    },
    include: [
      {
        model: Participant,
        where: {
          userId: senderId,
        },
        attributes: [],
      },
    ],
  });
  if (conversation) {
    conversation = await Promise.all(
      conversation.map(async (conv) => {
        conv = conv.toJSON();
        let participant;
        participant = await Participant.findOne({
          where: {
            userId: recipientId,
            conversationId: conv.conversationId,
          },
        });
        if (participant) {
          participant = participant.toJSON();
          conv.participants = [{ userId: participant.userId }];
        } else {
          conv.participants = null;
        }
        return conv;
      })
    );
    conversation = conversation.filter((conv) => conv.participants !== null);
  }
  if (!conversation || conversation.length === 0) {
    conversation = await Conversation.create({
      conversationType: "individual",
    });
    let participant = await Participant.bulkCreate([
      {
        conversationId: conversation.toJSON().conversationId,
        userId: senderId,
      },
      {
        conversationId: conversation.toJSON().conversationId,
        userId: recipientId,
      },
    ]);
    if (!participant) {
      conversation.destroy();
      return next(new AppError("Failed to create conversation", 400));
    }
    conversation = conversation.toJSON();
    participant = participant
      .map((el) => el.toJSON())
      .filter((el) => el.userId !== senderId);
    conversation.participants = participant;
    conversation = [{ ...conversation }];
  }
  let user = await User.findOne({
    attributes: ["firstName", "lastName"],
    where: {
      id: recipientId,
    },
  });
  if (!user) {
    return next(
      new AppError(
        "Server error loading conversation. Try Loading conversation list again",
        500
      )
    );
  }
  conversation[0].participants = [
    { userId: conversation[0].participants[0].userId, User: user },
  ];
  return res.status(201).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  let conversation = await Conversation.destroy({
    where: {
      conversationId: req.params.convid,
    },
  });
  console.log(conversation);
  if (!conversation) {
    return next(new AppError(`No Conversation is found with that ID`, 404));
  }
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllConversation = catchAsync(async (req, res, next) => {
  const limitQuery = 20;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  const userid = req.tokenData.id;
  let conversation = await Conversation.findAll({
    include: [
      {
        model: Participant,
        attributes: [],
        where: {
          userId: userid,
        },
      },
    ],
    limit: limitQuery,
    offset: offsetVal,
  });
  if (!conversation) {
    return next(new AppError("No conversation found", 400));
  }
  conversation = conversation.map((el) => el.toJSON());
  if (conversation) {
    conversation = await Promise.all(
      conversation.map(async (conv) => {
        let participants = await Participant.findAll({
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName"],
            },
          ],
          where: {
            conversationId: conv.conversationId,
          },
        });
        participants = participants
          .map((el) => {
            el = el.toJSON();
            return { userId: el.userId, User: el.User };
          })
          .filter((el) => el.userId !== userid);
        conv.participants = participants;
        return conv;
      })
    );
  }
  return res.status(200).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

exports.sendMessage = async (req, res, next, io) => {
  //console.log(io);
  const convid = req.params.convid;
  const { messageText } = req.body;
  console.log(messageText,convid);
  const senderId = req.tokenData.id;
  let conversation = await Conversation.findOne({
    where: {
      conversationId: convid,
    },
  });
  if (!conversation) {
    return next(new AppError("Failed to send in conversation!", 400));
  }
  const key = senderId.slice(0, 32);
  const encryptedMessage = await encryptAES(messageText, key);
  //console.log(encryptedMessage);
  message = await Message.create({
    conversationId: conversation.conversationId,
    senderId,
    messageText: encryptedMessage,
  });
  //save attachments in databases
  let attachments;
  if (req.files && req.files.length > 0) {
    attachments = await Promise.all(
      req.files.map(async (file) => {
        let attachment = await Attachment.create({
          messageId: message.messageId,
          attachmentType: file.mimetype.startsWith("image/") ? "image" : "file",
          attachmentName: file.filename,
        });
        return attachment.toJSON();
      })
    );
  }
  if (!message) {
    return next(new AppError("Fialed to send message!", 400));
  }
  message = message.toJSON();
  message.messageText = messageText;
  let user = await User.findOne({
    where: {
      id: senderId,
    },
    attributes: ["firstName", "lastName"],
  });
  if (!user) {
    return next(new AppError("Failed to retrieve user!", 400));
  }
  user = user.toJSON();
  message.Attachments = attachments === undefined ? [] : attachments;
  message.User = user;
  io.to(convid).emit('newMessage', message);
  //message = [{...message}];
  return res.status(201).json({
    status: "succcess",
    data: {
      message,
    },
  });
};

exports.getMessage = catchAsync(async (req, res, next) => {
  
  const convid = req.params.convid;
  const limitQuery = 50;
  const offsetVal = req.query.page ? (+req.query.page - 1) * limitQuery : 0;
  let message = await Message.findAll({
    include: [
      {
        model: Attachment,
        attributes: [
          "attachmentId",
          "messageId",
          "attachmentType",
          "attachmentName",
        ],
      },
      {
        model: User,
        attributes: ["firstName", "lastName"],
      },
    ],
    where: {
      conversationId: convid,
    },
    order: [["timestamp", "DESC"]],
    limit: limitQuery,
    offset: offsetVal,
  });
  message = await Promise.all(
    message.map(async (el) => {
      el = el.toJSON();
      const key = el.senderId.slice(0, 32);
      el.messageText = await decryptAES(el.messageText, key);
      return el;
    })
  );
  return res.status(200).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.deleteAttachment = catchAsync(async (req, res, next) => {
  let attachment = await Attachment.findOne({
    include: [
      {
        model: Message,
        attributes: ["senderId"],
      },
    ],
    where: {
      attachmentId: req.params.attachmentId,
    },
  });
  if (!attachment) {
    return next(new AppError("No attachment is found with given id", 404));
  }
  if (attachment.Message.senderId !== req.tokenData.id) {
    return next(new AppError("You are not authorize to perform deletion!", 401));
  }
  const attachmentPath = path.join(uploadDirectory, attachment.attachmentName);
  await promisify(fs.unlink)(attachmentPath);
  await attachment.destroy();
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  let message = await Message.findOne({
    include: [
      {
        model: Attachment,
        attributes: ["attachmentId", "attachmentName"],
      },
    ],
    where: {
      messageId: req.params.messageId,
    },
  });
  if (!message) {
    return next(new AppError("No message is found with given id", 404));
  }
  if (message.senderId == req.tokenData.id) {
    return next(new AppError("You are not authorize to perform deletion!", 401));
  }
  if (message.Attachments.length > 0) {
    await Promise.all(
      message.Attachments.map(async (attachment) => {
        const attachmentPath = path.join(
          uploadDirectory,
          attachment.attachmentName
        );
        await promisify(fs.unlink)(attachmentPath);
      })
    );
  }
  await message.destroy();
  return res.status(204).json({
    status : "success",
    data : null,
  });
});

exports.editMessage = catchAsync(async (req, res, next) => {
  const { messageText } = req.body;
  let message = await Message.findOne({
    include : [
      {
        model : Attachment,
        attributes : ["attachmentId", "messageId", "attachmentType", "attachmentName"],
      },
      {
        model : User,
        attributes : ["firstName", "lastName"]
      },
    ],
    where : {
      messageId : req.params.messageId,
    },
  });
  if(!message){
    return next(new AppError("No message is found with given id", 404));
  }
  if(message.senderId !== req.tokenData.id){
    return next(new AppError("You are not authorized to perform updation!", 401));
  }
  const key = message.senderId.slice(0,32);
  const encryptedMessage = await encryptAES(messageText,key);
  message = await message.update({messageText : encryptedMessage});
  message = message.toJSON();
  message.messageText = await decryptAES(message.messageText, key);
  res.status(201).json({
    status : "success",
    data : {
      message,
    }
  })
});