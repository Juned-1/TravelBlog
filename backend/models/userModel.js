const { DataTypes, UUIDV4 } = require("sequelize");
const { hash, compare } = require("bcrypt");
const sequelize = require("../utils/dbConnection");
const Post = require("./postModel");
const PostLike = require("./postLikeModel");
const Token = require("./tokenModel");
const Comment = require("./commentModel");
const Photo = require("./photoModel");
const Followship = require("./followshipModel");
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
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
User.hasOne(Token, { foreignKey: "userId", onDelete: "CASCADE" });
Token.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId", onDelete: "NO ACTION" });
Post.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "NO ACTION",
});
User.hasMany(PostLike, { foreignKey: "userId", onDelete: "CASCADE" });
PostLike.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(Photo, { foreignKey: "userId", onDelete: "CASCADE" });
Photo.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.belongsToMany(User, {
  through: Followship,
  foreignKey: "followerId",
  onDelete: "CASCADE",
  as: 'follower'
});
User.belongsToMany(User, {
  through: Followship,
  foreignKey: "followingId",
  onDelete: "CASCADE",
  as: 'following'
});
// Optional: Add any additional configurations or associations here
//Initializing model
User.sync({})
  .then(() => console.log("User schema is ready"))
  .catch((err) => {
    console.log(err);
  });

module.exports = User;
