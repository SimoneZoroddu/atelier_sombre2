require('dotenv').config();
const transporter = require("../data/mailer");

const sendOrderEmailCustomer = (req, res, next) => {

  const { email } = req.body.order;
  try {
    const infoCustomer = transporter.sendMail({
      from: '"Atelier Sombre" <orders@atelier-sombre.com>',
      to: email,
      subject: "Grazie per l'ordine!",
      text: "Questa è una email di test",
      html: `
<body style="margin:0; padding:0; background-color:#f5f4f0;">
GRAZIE DELL'ORDINE
</body>
`});

    res.json({ success: true });

  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: "Errore invio email Customer" });
  }
  next();
};

module.exports = sendOrderEmailCustomer;