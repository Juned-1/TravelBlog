const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../utils/dbConnection");
const Conversation = sequelize.define(
  "Conversation",
  {
    conversationId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      len: 36,
    },
    conversationType: {
      type: DataTypes.ENUM("individual", "group"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { timestamps: false }
);

//synchronize

module.exports = Conversation;