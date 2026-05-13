require('dotenv').config();
const transporter = require("../data/mailer");

const sendOrderEmailSeller = async (req, res, next) => {

  try {

    const {
      firstname,
      lastname,
      email,
      total_price
    } = req.body.order;

    await transporter.sendMail({
      from: '"Atelier Sombre" <orders@atelier-sombre.com>',
      to: 'orders@atelier-sombre.com',
      subject: `Nuovo ordine da ${firstname} ${lastname}`,
      html: `
        <body style="margin:0; padding:0; background-color:#f5f4f0;">
          
          <h1>Nuovo ordine ricevuto</h1>

          <p>Cliente: ${firstname} ${lastname}</p>
          <p>Email: ${email}</p>
          <p>Totale: €${total_price}</p>

        </body>
      `
    });

    next();

  } catch (error) {

    console.error("Errore invio email seller:", error);

    return res.status(500).json({
      error: "Errore invio email seller"
    });
  }
};

module.exports = sendOrderEmailSeller;