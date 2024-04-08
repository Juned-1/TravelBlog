const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../utils/dbConnection");
const Message = require("./messageModel");
const User = require("../userModel");

const ReadReceipt = sequelize.define(
  "ReadReceipt",
  {
    readReceiptId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Message,
        key: "messageId",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
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

module.exports = ReadReceipt;