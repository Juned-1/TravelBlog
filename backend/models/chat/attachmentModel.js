const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../utils/dbConnection");
const Message = require("./messageModel");

const Attachment = sequelize.define(
  "Attachment",
  {
    attachmentId: {
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
    attachmentType: {
      type: DataTypes.ENUM("image", "file"),
      allowNull: false,
    },
    attachmentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { timestamps: false }
);

//synchronize

module.exports = Attachment;