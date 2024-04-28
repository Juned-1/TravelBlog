module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Conversation = sequelize.define(
    "Conversation",
    {
      conversationId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
        len: 36,
      },
      conversationType: {
        type: DataTypes.ENUM("individual", "group"),
        allowNull: false,
      },
      conversationName : {
        type : DataTypes.STRING,
        allowNull : true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate : DataTypes.NOW,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return Conversation;
};