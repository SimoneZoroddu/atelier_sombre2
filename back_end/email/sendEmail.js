require('dotenv').config();


const transporter = require("./mailer");

async function sendEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"My App" <hello@myapp.com>',
      to: "test@example.com",
      subject: "Test Mailtrap",
      text: "Questa è una email di test",
      html: "<h1>Questa è una email di test</h1>"
    });

    console.log("Email inviata:", info.messageId);

  } catch (error) {
    console.error("Errore invio email:", error);
  }
}

sendEmail();