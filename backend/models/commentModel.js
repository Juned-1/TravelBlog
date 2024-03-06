const { DataTypes, UUIDV4, Sequelize } = require("sequelize");
const sequelize = require("../utils/dbConnection");
const Comment = sequelize.define(
  "Comment",
  {
    commentId: {
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      len: 36,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Comments",
        key: "commentId",
      },
    },
    commentText: {
      type: DataTypes.BLOB("medium"),
      allowNull: false,
      get() {
        const contentBuffer = this.getDataValue("commentText");
        return contentBuffer ? contentBuffer.toString("utf-8") : null;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
  }
);
Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId" }); //as provides an alias
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });

Comment.sync({})
  .then(() => console.log("Comment Schema is ready"))
  .catch((err) => {
    console.log(err);
  });
module.exports = Comment;