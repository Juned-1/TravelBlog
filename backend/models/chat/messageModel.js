const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../utils/dbConnection");
const Conversation = require("./conversationModel");
const User = require("../userModel");

const Message = sequelize.define(
  "Message",
  {
    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      len: 36,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Conversation,
        key: "conversationId",
      },
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
      references: {
        model: User,
        key: "id",
      },
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

//synchronize

module.exports = Message;