module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Followship = sequelize.define(
    "Followship",
    {
      followerId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        len: 36,
        allowNull: false,
        primaryKey: true,
      },
      followingId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        len: 36,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return Followship;
};
