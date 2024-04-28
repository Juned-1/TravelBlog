module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Message = sequelize.define(
    "Message",
    {
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: UUIDV4,
        len: 36,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
        len : 36,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
      },
      messageText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    { timestamps: false }
  );
  return Message;
};
