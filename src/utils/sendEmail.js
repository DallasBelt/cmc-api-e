const transporter = require('../config/nodemailer');
const path = require('path');

async function sendVerificationLink(email, verificationCode) {
  try {
    const mailOptions = {
      from: 'yadira.ziemann25@ethereal.email',
      to: email,
      subject: 'CMC | Verificación de correo electrónico',
      html: `
        <img src='cid:unique@nodemailer.com' style='width: 600px; margin-bottom: 10px;'/>
        <h1 style='font-size:20px;'>¡Saludos!</h1>
        <p style='font-size:18px;'>Para completar tu registro en el sistema CMC, por favor haz clic en el siguiente enlace:</p>
        <br />
        <p style='font-size:18px;'><a href="http://localhost:8000/v1/user/verify?code=${verificationCode}&email=${email}">Verificar correo electrónico</a></p>
        <br />
        <br />
        <p style='font-size:18px;'>Importante: El enlace caducará en 6 horas. Luego de ese tiempo deberás registrarte nuevamente.</p>
        <br />
        <br />
        <br />
        <p style='font-size:18px;'>Atentamente,</p>
        <p style='font-size:18px;'>El equipo de CMC</p>
      `,
      attachments: [
        {
          filename: 'isotype.svg',
          path: path.join(__dirname, '../assets/isotype.svg'),
          cid: 'unique@nodemailer.com',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error("Couldn't send verification email:", error);
    throw new Error("Couldn't send verification email");
  }
}

async function sendVerificationCompleted(email, firstName, lastName) {
  try {
    const mailOptions = {
      from: 'yadira.ziemann25@ethereal.email',
      to: email,
      subject: 'CMC | Verificación exitosa',
      html: `
        <img src='cid:unique@nodemailer.com' style='width: 600px; margin-bottom: 10px;'/>
        <h1 style='font-size:20px;'>¡Bienvenido(a), ${firstName} ${lastName}!</h1>
        <p style='font-size:18px;'>Tu correo electrónico se ha verificado con éxito.</p>
        <br />
        <p style='font-size:18px;'>Para acceder al sistema haz clic <a href="http://localhost:8000/v1/login">aquí</a>.</p>
        <br />
        <br />
        <br />
        <p style='font-size:18px;'>Atentamente,</p>
        <p style='font-size:18px;'>El equipo de CMC</p>
      `,
      attachments: [
        {
          filename: 'isotype.svg',
          path: path.join(__dirname, '../assets/isotype.svg'),
          cid: 'unique@nodemailer.com',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error("Couldn't send email:", error);
    throw new Error("Couldn't send email");
  }
}

module.exports = { sendVerificationLink, sendVerificationCompleted };
