const { DataTypes, UUIDV4 } = require("sequelize");
const { hash, compare } = require("bcrypt");
const sequelize = require("../utils/dbConnection");
const Post = require("./postModel");
const PostLike = require("./postLikeModel");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(1000),
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
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isPasswordMatch(value) {
          if (value !== this.password) {
             throw new Error("Password confirmation does not match password");
          }
        },
      },
    },
  },
  {
    //tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user, options) => {
        // Hash the password before creating the user
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
      },
      beforeUpdate: async (user, options) => {
        // Hash the password before updating the user
        if (user.changed("password")) {
          const hashedPassword = await hash(user.password, 10);
          user.password = hashedPassword;
        }
      },
    },
  }
);
// Add an instance method for password verification
User.prototype.verifyPassword = async function (password) {
  return await compare(password, this.password);
};
//association
User.hasMany(Post, { onDelete: "NO ACTION" });
Post.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "NO ACTION",
});
User.hasMany(PostLike, { onDelete: "CASCADE" });
PostLike.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Post.hasMany(PostLike, { onDelete: "CASCADE" });
PostLike.belongsTo(Post, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});
// Optional: Add any additional configurations or associations here
//Initializing model
User.sync({ alter: true })
  .then(() => console.log("User schema is ready"))
  .catch((err) => {});

module.exports = User;
