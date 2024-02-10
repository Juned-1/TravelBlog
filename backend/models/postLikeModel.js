const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const User = require("./userModel");
const Post = require("./postModel");

const PostLike = sequelize.define("PostLike", {
  likeId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reactionType: {
    type: DataTypes.ENUM("like", "dislike"),
    allowNull: false,
  },
},{
  timestamps: false
});
PostLike.sync()
  .then(() => console.log("PostLike schema is ready"))
  .catch((err) => {});
module.exports = PostLike;