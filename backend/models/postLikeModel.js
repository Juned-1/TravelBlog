module.exports = (sequelize, DataTypes, UUIDV4) => {
  const PostLike = sequelize.define(
    "PostLike",
    {
      likeId: {
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
