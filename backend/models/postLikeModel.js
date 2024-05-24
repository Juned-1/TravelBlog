module.exports = (sequelize, DataTypes, UUIDV4) => {
  const PostLike = sequelize.define(
    "PostLike",
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
        primaryKey : true,
      },
      postId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
        primaryKey : true,
      },
      reactionType: {
        type: DataTypes.ENUM("like", "dislike"),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return PostLike;
};
