module.exports = (sequelize, DataTypes, UUIDV4) => {
  const SocialAccount = sequelize.define(
    "SocialAccount",
    {
      socialId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allownull: false,
        len: 36,
      },
      userId: {
        type: DataTypes.UUID,
        allownull: false,
        len: 36,
      },
      socialAccountType: {
        type: DataTypes.STRING,
      },
      socialAccountLink: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );
  return SocialAccount;
};
