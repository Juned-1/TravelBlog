const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onUpdate: "cascade",
      onDelete: "cascade",
      references: { model: "Users", key: "id" },
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

Token.sync()
  .then(() => console.log("Token schema is ready"))
  .catch((err) => {});
module.exports = Token;