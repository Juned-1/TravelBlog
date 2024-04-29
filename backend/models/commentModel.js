module.exports = (sequelize, DataTypes, UUIDV4) => {
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
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );
  return Comment;
};
