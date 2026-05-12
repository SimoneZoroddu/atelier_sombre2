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
      html: `
<body style="margin:0; padding:0; background-color:#f5f4f0;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f4f0;">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="background-color:#ffffff;">

          <tr>
            <td style="padding: 36px 48px 0; border-top: 3px solid #111111;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <p style="margin:0; font-family:'Cormorant Garamond', Georgia, serif; font-size:22px; letter-spacing:0.22em; text-transform:uppercase; color:#111111;">
                      ATELIER SOMBRE
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#999999;">
                      Newsletter
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 48px 0;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e0dfd9;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 56px 48px 48px;">
              <p style="margin:0 0 20px; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:#aaaaaa;">
                Benvenuto
              </p>

              <h1 style="margin:0 0 28px; font-family:'Cormorant Garamond', Georgia, serif; font-size:46px; font-weight:300; line-height:52px; color:#111111;">
                Sei parte<br>del nostro mondo.
              </h1>

              <p style="margin:0 0 16px; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.85; color:#555555; max-width:380px;">
                Grazie per esserti iscritto. Da questo momento riceverai in anteprima le nostre nuove collezioni, accesso a offerte esclusive e contenuti editoriali selezionati.
              </p>

              <p style="margin:0; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.85; color:#555555; max-width:380px;">
                Ogni email che ti invieremo è pensata per essere all'altezza del tuo tempo.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 48px 52px;" align="left">
              <table role="presentation">
                <tr>
                  <td style="background-color:#111111;">
                    <a href="http://localhost:5173/shoes" target="_blank"
                      style="display:inline-block; padding:14px 32px; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#ffffff; text-decoration:none;">
                      Scopri la collezione
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 48px 36px; border-bottom: 3px solid #111111;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 6px; font-family:'Jost', Helvetica, Arial, sans-serif; font-size:11px; color:#aaaaaa;">
                      Hai ricevuto questa email perché ti sei iscritto su <a href="http://localhost:5173/" style="color:#aaaaaa;">tuosito.com</a>.
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0; font-family:'Cormorant Garamond', Georgia, serif; font-size:13px; letter-spacing:0.12em; color:#cccccc; text-transform:uppercase;">
                      ATELIER SOMBRE
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
`
    });

    console.log("Email inviata:", info.messageId);
    res.json({ success: true });

  } catch (error) {
    console.error("Errore invio email:", error);
    res.status(500).json({ error: "Errore invio email" });
  }
};

module.exports = sendEmail;