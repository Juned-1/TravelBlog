module.exports = (sequelize, DataTypes, UUIDV4, compare) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
        len: 36,
      },
      firstName: {
        type: DataTypes.STRING(100), //500
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(100), //500
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(200), //1000
        allowNull: false,
        unique: true,
      },
      dob: {
        type: DataTypes.DATE,
      },
      gender: {
        type: DataTypes.STRING(30),
      },
      password: {
        type: DataTypes.STRING(300),
        //allowNull: false,
      },
      bio : {
        type : DataTypes.TEXT
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lockProfile : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
      },
    },
    {
      //tableName: 'users',
      timestamps: false,
    }
  );
  // Add an instance method for password verification
  User.prototype.verifyPassword = async function (password) {
    return await compare(password, this.password);
  };
  return User;
};
