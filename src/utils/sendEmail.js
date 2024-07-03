const transporter = require('../config/nodemailer');
const path = require('path');

async function sendNewUserEmail(email, password) {
  const mailOptions = {
    from: 'yadira.ziemann25@ethereal.email',
    to: email,
    subject: 'Bienvenido(a) al sistema CMC',
    html: `
      <img src='cid:unique@nodemailer.com' style='width: 600px; margin-bottom: 10px;'/>
      <h1 style='font-size:20px;'>¡Bienvenido(a)!</h1>
      <p style='font-size:18px;'>Tu usuario ha sido creado. Para iniciar sesión usa las siguientes credenciales:</p>
      <br />
      <p style='font-size:18px;'>Correo electrónico: <strong>${email}</strong></p>
      <p style='font-size:18px;'>Contraseña: <strong>${password}</strong></p>
      <br />
      <p style='font-size:18px;'>Por tu seguridad te recomendamos <span style='text-decoration: underline;'>no compartir esta información y cambiar la contraseña</span>.</p>
      <br />
      <p style='font-size:18px;'>Ingresa al sistema <a href='#' target='_blank'>aquí</a>.</p>
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
}

module.exports = { sendNewUserEmail };
