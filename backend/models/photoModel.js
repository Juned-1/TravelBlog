const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Photo = sequelize.define(
  "Photo",
  {
    photoId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      len: 36,
    },
    photoType: {
      type: DataTypes.ENUM("profile", "cover", "other"),
      allowNull: false,
    },
    photoName : {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

Photo.sync({})
  .then(() => console.log("Photo schema is ready"))
  .catch((err) => console.log(err));
module.exports = Photo;