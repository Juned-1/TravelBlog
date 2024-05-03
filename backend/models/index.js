const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");
const { compare } = require("bcrypt");
const {
  databaseName,
  databaseUserName,
  databasePassword,
  databaseHost,
} = require("../configuration");

const sequelize = new Sequelize(
  databaseName,
  databaseUserName,
  databasePassword,
  {
    host: databaseHost,
    dialect: "mysql",
    logging: false, //prevent every sql command log in console
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./userModel")(sequelize, DataTypes, UUIDV4, compare);
db.Token = require("./tokenModel")(sequelize, DataTypes, UUIDV4);
db.User.hasOne(db.Token, {
  foreignKey: "userId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

db.Token.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.Post = require("./postModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.Post, { foreignKey: "userId", onDelete: "CASCADE" });
db.Post.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

db.PostLike = require("./postLikeModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.PostLike, { foreignKey: "userId", onDelete: "CASCADE" });
db.PostLike.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.Post.hasMany(db.PostLike, { foreignKey: "postId", onDelete: "CASCADE" });
db.PostLike.belongsTo(db.Post, {
  foreignKey: "postId",
  onDelete: "CASCADE",
});
db.Comment = require("./commentModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.Comment, { foreignKey: "userId", onDelete: "CASCADE" });
db.Comment.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });
db.Post.hasMany(db.Comment, { foreignKey: "postId", onDelete: "CASCADE" });
db.Comment.belongsTo(db.Post, { foreignKey: "postId", onDelete: "CASCADE" });
db.Comment.hasMany(db.Comment, {
  as: "replies",
  foreignKey: "parentId",
  onDelete: "CASCADE",
}); //as provides an alias
db.Comment.belongsTo(db.Comment, {
  as: "parent",
  foreignKey: "parentId",
  onDelete: "CASCADE",
});
db.Photo = require("./photoModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.Photo, { foreignKey: "userId", onDelete: "CASCADE" });
db.Photo.belongsTo(db.User, { foreignKey: "userId", onDelete: "CASCADE" });
db.Followship = require("./followshipModel")(sequelize, DataTypes, UUIDV4);
db.User.belongsToMany(db.User, {
  through: db.Followship,
  foreignKey: "followerId",
  onDelete: "CASCADE",
  as: "follower",
});
db.User.belongsToMany(db.User, {
  through: db.Followship,
  foreignKey: "followingId",
  onDelete: "CASCADE",
  as: "following",
});

db.Conversation = require("./chat/conversationModel")(
  sequelize,
  DataTypes,
  UUIDV4
);
db.Participant = require("./chat/participantModel")(
  sequelize,
  DataTypes,
  UUIDV4
);
db.User.hasMany(db.Participant, { foreignKey: "userId", onDelete: "CASCADE" });
db.Participant.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.Conversation.hasMany(db.Participant, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});
db.Participant.belongsTo(db.Conversation, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});
db.Message = require("./chat/messageModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.Message, { foreignKey: "senderId", onDelete: "CASCADE" });
db.Message.belongsTo(db.User, { foreignKey: "senderId", onDelete: "CASCADE" });
db.Conversation.hasMany(db.Message, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});
db.Message.belongsTo(db.Conversation, {
  foreignKey: "conversationId",
  onDelete: "CASCADE",
});
db.Attachment = require("./chat/attachmentModel")(sequelize, DataTypes, UUIDV4);
db.Message.hasMany(db.Attachment, {
  foreignKey: "messageId",
  onDelete: "CASCADE",
});
db.Attachment.belongsTo(db.Message, {
  foreignKey: "messageId",
  onDelete: "CASCADE",
});
db.ReadReceipt = require("./chat/readReceiptsModel")(
  sequelize,
  DataTypes,
  UUIDV4
);
db.User.hasMany(db.ReadReceipt, { foreignKey: "userId", onDelete: "CASCADE" });
db.ReadReceipt.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.Message.hasMany(db.ReadReceipt, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.ReadReceipt.belongsTo(db.Message, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.SocialAccount = require("./socialModel")(sequelize, DataTypes, UUIDV4);
db.User.hasMany(db.SocialAccount, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.SocialAccount.belongsTo(db.User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.sequelize
  .sync({})
  .then(() => {
    console.log("Database Sync");
  })
  .catch((err) => {
    console.log("DB Sync error : ", err);
  });
module.exports = db;
