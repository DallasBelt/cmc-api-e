const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'yadira.ziemann25@ethereal.email',
    pass: 'Jmg4vAmdMMYnCtXXhG',
  },
});

module.exports = transporter;
