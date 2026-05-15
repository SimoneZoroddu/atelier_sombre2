require('dotenv').config();
const transporter = require("../data/mailer");

const sendOrderEmailCustomer = async (req, res, next) => {
  console.log(req.body.order);
  try {

    const { email, firstname } = req.body.order;

    await transporter.sendMail({
      from: '"Atelier Sombre" <orders@atelier-sombre.com>',
      to: email,
      subject: "Grazie per l'ordine!",
      html: `
        <body style="margin:0; padding:0; background-color:#f5f4f0;">
          <h1>Grazie dell'ordine ${firstname}</h1>
        </body>
      `
    });

    next();

  } catch (error) {

    console.error("Errore invio email customer:", error);

    return res.status(500).json({
      message: "Ordine inserito con successo",
      error: "Errore invio email customer"
    });
  }
};

module.exports = sendOrderEmailCustomer;