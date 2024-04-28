module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Participant = sequelize.define(
    "Participant",
    {
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
        primaryKey : true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        len: 36,
        primaryKey : true,
      },
    },
    { timestamps: false }
  );
  return Participant
};