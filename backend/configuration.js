const dotenv = require("dotenv");
dotenv.config({ path: './config.env'});
module.exports = {
    environment: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    databaseName: process.env.DATABASE_NAME,
    databaseUserName: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    databasePort: process.env.DATABASE_PORT,
    databaseHost: process.env.DATABASE_HOST,
    applicationPort: process.env.APP_PORT,
    cookieDomain: process.env.COOKIE_DOMAIN
};