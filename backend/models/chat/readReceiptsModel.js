module.exports = (sequelize, DataTypes, UUIDV4) => {
  const ReadReceipt = sequelize.define(
    "ReadReceipt",
    {
      readReceiptId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
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
  return ReadReceipt;
};