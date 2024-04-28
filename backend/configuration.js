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
    cookieDomain: process.env.COOKIE_DOMAIN,
    devMailUserName: process.env.DEV_MAIL_USERNAME,
    devMailPassword: process.env.DEV_MAIL_PASSWORD,
    devMailHost: process.env.DEV_MAIL_HOST,
    devMailPort: process.env.DEV_MAIL_PORT,
    devMailSource: process.env.DEV_MAIL_SOURCE,
    prodMailSource: process.env.PROD_MAIL_SOURCE,
    prodMailPassword: process.env.PROD_MAIL_PASSWORD,
    messagePadding: process.env.MESSAGE_PADDING,
    googleClientID : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET
};