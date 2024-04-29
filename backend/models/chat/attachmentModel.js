module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Attachment = sequelize.define(
    "Attachment",
    {
      attachmentId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        len: 36,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      attachmentType: {
        type: DataTypes.ENUM("image", "file"),
        allowNull: false,
      },
      attachmentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return Attachment;
};