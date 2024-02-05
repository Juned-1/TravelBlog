const { Sequelize } = require("sequelize");
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
  },
);
sequelize
  .authenticate()
  .then(() => console.log("DB Connection Succesful"))
  .catch((err) => console.log(err));
module.exports = sequelize;