const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../utils/dbConnection");
const Conversation = require("./conversationModel");
const User = require("../userModel");
const Participant = sequelize.define(
  "Participant",
  {
    participantId: {
      types: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      len: 36,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
      references: {
        model: Conversation,
        key: "conversationId",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: false }
);

//synchronize

module.exports = Participant;