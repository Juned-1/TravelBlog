const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
const {
  devMailUserName,
  devMailPassword,
  devMailHost,
  devMailPort,
  devMailSource,
  prodMailSource,
  prodMailPassword,
  environment
} = require("../configuration");
//new Email(user,url).sendWlcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName
    this.url = url;
    this.from = `Travel Blog Admin <${devMailSource}>`;
    if (environment === "production") {
        this.from = `Travel Blog Admin <${prodMailSource}>`;
    }
  }
  newTransport() {
    //1) Create a transporte
    if (environment === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: prodMailSource,
          pass: prodMailPassword
        },
        secure: true,
      });
    } else {
      return nodemailer.createTransport({
        host: devMailHost,
        port: devMailPort,
        secure: false,
        auth: {
          user: devMailUserName,
          pass: devMailPassword
        },
        //Activate "less secure app" option in your gmail
        //using gamil we can only send 500 email per day and we will marked spam
        //In production we generally use sendgrade or mailgun or if deployed in AWS SDK SES
      });
    }
  }
  async send(template, subject) {
    //send the actual email
    //1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {}), //text version of email better fro email delivery rate and spam folder
    };
    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to Travel Blog");
  }
  async sendEmailVerificationCode(){
    await this.send("emailVerification", "Travel Blog Sign Up Verification Code")
  }
  //   async sendPasswordReset() {
  //     await this.send(
  //       'passwordReset',
  //       'Your password Reset token (valid for 10 minutes)',
  //     );
  //   }
};
