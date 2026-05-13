require('dotenv').config();
const transporter = require("../data/mailer");
const sendOrderEmail = (req, res) => {
    
  const { email } = req.body.order;
  try {
    const info = transporter.sendMail({
      from: '"Atelier Sombre" <orders@atelier-sombre.com>',
      to: email,
      subject: "Grazie per l'ordine!",
      text: "Questa è una email di test",
      html: `
<body style="margin:0; padding:0; background-color:#f5f4f0;">
GRAZIE DELL'ORDINE
</body>
`
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: "Errore invio email ordine cliente" });
  }

  try {
    const info = transporter.sendMail({
      from: email,
      to: '"Atelier Sombre" <orders@atelier-sombre.com>',
      subject: `Abbiamo Ricevuto un nuovo ordine da ${req.body.order.firstname} ${req.body.order.lastname}`,
      text: "Questa è una email di test",
      html: `
<body style="margin:0; padding:0; background-color:#f5f4f0;">
ABBIAMO RICEVUTO QUESTO ORDINE
${req.body}
</body>
`
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: "Errore invio inserimento ordine" });
  }
};

module.exports = sendOrderEmail;