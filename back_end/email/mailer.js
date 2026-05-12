const nodemailer = require("nodemailer");

require('dotenv').config();

console.log(process.env.DB_HOST);


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

module.exports = transporter;