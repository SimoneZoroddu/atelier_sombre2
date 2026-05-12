require('dotenv').config();
const transporter = require("../data/mailer");
const sendEmail = (req, res) => {
  const { email } = req.body;
  try {
    const info = transporter.sendMail({
      from: '"Atelier Sombre" <newsletter@atelier-sombre.com>',
      to: email,
      subject: "Grazie per l'iscrizione!",
      text: "Questa è una email di test",
      html: "<h1>La ringrazio per l'iscrizione</h1>"
    });

    console.log("Email inviata:", info.messageId);

  } catch (error) {
    console.error("Errore invio email:", error);
  }
}

module.exports = sendEmail