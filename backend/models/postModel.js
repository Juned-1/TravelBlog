module.exports = (sequelize, DataTypes, UUIDV4) => {
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
  return Post;
};

