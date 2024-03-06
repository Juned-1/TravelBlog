const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Comment = require("./commentModel");
const User = require("./userModel");
const PostLike = require("./postLikeModel");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
      len: 36,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.BLOB("long"),
      get() {
        const contentBuffer = this.getDataValue("content");
        return contentBuffer ? contentBuffer.toString("utf-8") : null;
      },
    },
    time: {
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
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });
Post.hasMany(PostLike, { foreignKey: "postId", onDelete: "CASCADE" });
PostLike.belongsTo(Post, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});
Post.sync()
  .then(() => console.log("Post schema is ready"))
  .catch((err) => {});
module.exports = Post;
