module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Followship = sequelize.define(
    "Followship",
    {
      followerId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        len: 36,
        allowNull: false,
      },
      followingId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        len: 36,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Followship;
};
