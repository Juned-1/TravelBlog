const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Followship = sequelize.define(
  "Followship",
  {
    followerId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      len: 36,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    followingId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      len: 36,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);


Followship.sync({})
  .then(() => console.log("Followship schema is ready"))
  .catch((err) => {
    console.log(err);
  });
module.exports = Followship;