const connection = require('../data/data');
require('dotenv').config();
const transporter = require('../data/mailer');
//prova
const formatPrice = (value) =>
    parseFloat(value).toLocaleString('it-IT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });

const padId = (id) => `#${String(id).padStart(4, '0')}`;

const discountedPrice = (price, discount) =>
    parseFloat(price) * (1 - discount / 100);

// ─── Item rows generator ─────────────────────────────────────────────────────

const buildItemRows = (items) =>
    items
        .map(
            (item) => `
      <!-- Item -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
             style="margin-bottom:2px;">
        <tr>
          <td width="100" valign="top" style="padding-right:16px;">
            <img src="${item.main_image_url}"
                 width="100" height="100"
                 alt="${item.name}"
                 style="width:100px; height:100px; object-fit:cover;
                        display:block; background-color:#e8e4de;" />
          </td>
          <td valign="top" style="padding:4px 0;">
            <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:17px;
                       font-weight:400; color:#0a0a0a; margin-bottom:4px;">
              ${item.name}
            </p>
            <p style="font-family:'Jost', Helvetica, sans-serif; font-size:11px;
                       font-weight:300; color:#5a5550; margin-bottom:2px;">
              Colore: ${item.color} &nbsp;·&nbsp; Taglia: ${item.size}
            </p>
            <p style="font-family:'Jost', Helvetica, sans-serif; font-size:11px;
                       font-weight:300; color:#5a5550; margin-bottom:10px;">
              Quantità: ${item.quantity}
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                ${item.discount > 0
                    ? `<td style="padding-right:12px;">
                        <span style="font-family:'Jost', Helvetica, sans-serif; font-size:11px;
                                     font-weight:300; color:#9a9085; text-decoration:line-through;">
                          €${formatPrice(item.price)}
                        </span>
                       </td>`
                    : ''
                }
                <td>
                  <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                               font-weight:600; color:#0a0a0a;">
                    €${formatPrice(discountedPrice(item.price, item.discount) * item.quantity)}
                  </span>
                </td>
                ${item.discount > 0
                    ? `<td style="padding-left:10px;">
                        <span style="font-family:'Jost', Helvetica, sans-serif; font-size:9px;
                                     font-weight:500; letter-spacing:2px; color:#f5f3ef;
                                     background-color:#0a0a0a; padding:3px 8px;">
                          −${item.discount}%
                        </span>
                       </td>`
                    : ''
                }
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
             style="margin:16px 0;">
        <tr><td style="height:1px; background-color:#dedad4;"></td></tr>
      </table>
    `
        )
        .join('');

// ─── HTML builder ────────────────────────────────────────────────────────────
const buildInternalHtml = (order) => `
<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Nuovo Ordine ${padId(order.id)} — Atelier Sombre Interno</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; display:block; }
    body { background-color:#f5f3ef; font-family:'Jost', Helvetica, Arial, sans-serif; color:#0a0a0a; }
    a { color:inherit; text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f3ef;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
         style="background-color:#f5f3ef;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
               width="600" style="max-width:600px;">


          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background-color:#0a0a0a; padding:20px 36px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:20px;
                                 font-weight:300; letter-spacing:6px; color:#f5f3ef; text-transform:uppercase;">
                      Atelier Sombre
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 font-weight:500; letter-spacing:3px; text-transform:uppercase;
                                 color:#0a0a0a; background-color:#c8b99a; padding:4px 10px;">
                      USO INTERNO
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ ALERT BANNER ══ -->
          <tr>
            <td style="background-color:#c8b99a; padding:28px 36px; text-align:center;">
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                         letter-spacing:5px; color:#0a0a0a; text-transform:uppercase; margin-bottom:10px;">
                Nuovo ordine ricevuto
              </p>
              <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:44px;
                         font-weight:300; line-height:48px; color:#0a0a0a;">
                Ordine <strong style="font-weight:600;">${padId(order.id)}</strong>
              </p>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:11px; font-weight:300;
                         color:#3a3530; margin-top:8px;">
                ${formatDate(order.created_at)} — ${formatTime(order.created_at)}
              </p>
            </td>
          </tr>


          <!-- ══ QUICK STATS ══ -->
          <tr>
            <td style="background-color:#1a1714; padding:24px 36px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td width="33%" style="text-align:center; border-right:1px solid #2a2520;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:8px;">
                      Stato
                    </p>
                    <span style="display:inline-block; font-family:'Jost', Helvetica, sans-serif;
                                 font-size:9px; font-weight:500; letter-spacing:2px;
                                 text-transform:uppercase; color:#0a0a0a;
                                 background-color:#b08a50; padding:4px 12px;">
                      ${order.status}
                    </span>
                  </td>
                  <td width="33%" style="text-align:center; border-right:1px solid #2a2520;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:8px;">
                      Articoli
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:22px;
                               font-weight:600; color:#f5f3ef;">
                      ${order.items.length}
                    </p>
                  </td>
                  <td width="33%" style="text-align:center;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:8px;">
                      Totale
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:22px;
                               font-weight:600; color:#c8b99a;">
                      €${formatPrice(order.total_price)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ CUSTOMER INFO ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:32px 36px 0;">
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                         letter-spacing:4px; text-transform:uppercase; color:#0a0a0a; margin-bottom:16px;">
                Dati cliente
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background-color:#eae6e0;">
                <tr>
                  <td width="50%" valign="top" style="padding:20px 24px; border-right:2px solid #f5f3ef;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                     letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                     margin-bottom:3px;">Nome</p>
                          <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                                     font-weight:400; color:#0a0a0a;">
                            ${order.firstname} ${order.lastname}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                     letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                     margin-bottom:3px;">Email</p>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px;
                                     font-weight:300; color:#0a0a0a;">${order.email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                     letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                     margin-bottom:3px;">Telefono</p>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px;
                                     font-weight:300; color:#0a0a0a;">
                            +39 ${order.telephone_number}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding:20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                     letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                     margin-bottom:3px;">Codice fiscale</p>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px;
                                     font-weight:300; color:#0a0a0a; letter-spacing:1px;">
                            ${order.fiscal_code}
                          </p>
                        </td>
                      </tr>
                      ${order.vat_number
    ? `<tr>
                              <td style="padding-bottom:12px;">
                                <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                           letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                           margin-bottom:3px;">P. IVA</p>
                                <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px;
                                           font-weight:300; color:#0a0a0a; letter-spacing:1px;">
                                  ${order.vat_number}
                                </p>
                              </td>
                             </tr>`
    : ''
  }
                      <tr>
                        <td>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                     letter-spacing:3px; color:#9a9085; text-transform:uppercase;
                                     margin-bottom:3px;">Indirizzo</p>
                          <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px;
                                     font-weight:300; line-height:18px; color:#0a0a0a;">
                            ${order.street}, ${order.zip_code} ${order.city} (${order.region}), ${order.country}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ ORDER ITEMS ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:28px 36px 0;">
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                         letter-spacing:4px; color:#0a0a0a; text-transform:uppercase; margin-bottom:12px;">
                Dettaglio articoli
              </p>

              <!-- Table header -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background-color:#0a0a0a; margin-bottom:2px;">
                <tr>
                  <td width="72" style="padding:10px 12px;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 letter-spacing:2px; text-transform:uppercase; color:#9a9085;">
                      Foto
                    </span>
                  </td>
                  <td style="padding:10px 12px;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 letter-spacing:2px; text-transform:uppercase; color:#9a9085;">
                      Prodotto
                    </span>
                  </td>
                  <td width="60" style="padding:10px 12px; text-align:center;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 letter-spacing:2px; text-transform:uppercase; color:#9a9085;">
                      Taglia
                    </span>
                  </td>
                  <td width="50" style="padding:10px 12px; text-align:center;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 letter-spacing:2px; text-transform:uppercase; color:#9a9085;">
                      Qty
                    </span>
                  </td>
                  <td width="100" style="padding:10px 12px; text-align:right;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:8px;
                                 letter-spacing:2px; text-transform:uppercase; color:#9a9085;">
                      Prezzo
                    </span>
                  </td>
                </tr>
              </table>

              ${buildItemRows(order.items)}

              <!-- Total row -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background-color:#0a0a0a;">
                <tr>
                  <td style="padding:16px 24px;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:10px;
                                 font-weight:500; letter-spacing:3px; text-transform:uppercase; color:#9a9085;">
                      Totale ordine
                    </span>
                  </td>
                  <td align="right" style="padding:16px 24px;">
                    <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:22px;
                                 font-weight:600; color:#c8b99a;">
                      €${formatPrice(order.total_price)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ CTA GESTIONALE ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:28px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background-color:#eae6e0;">
                <tr>
                  <td style="padding:28px 24px; text-align:center;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:400;
                               letter-spacing:4px; text-transform:uppercase; color:#9a9085; margin-bottom:10px;">
                      Azione richiesta
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:20px;
                               font-weight:300; color:#0a0a0a; margin-bottom:20px;">
                      Elabora e conferma la spedizione
                    </p>
                    <a href="https://atelier-sombre.com/admin/orders/${order.id}"
                       style="display:inline-block; background-color:#0a0a0a;
                              font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                              letter-spacing:4px; text-transform:uppercase; color:#f5f3ef;
                              padding:14px 36px;">
                      Vai al pannello ordini
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background-color:#0a0a0a; padding:32px 36px 24px; text-align:center; margin-top:2px;">
              <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:13px; font-weight:300;
                         letter-spacing:8px; color:#5a5550; text-transform:uppercase; margin-bottom:16px;">
                Atelier Sombre — Notifica interna
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                     style="margin:0 auto 18px; width:40px;">
                <tr><td style="height:1px; background-color:#2a2520;"></td></tr>
              </table>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:10px; font-weight:300;
                         line-height:18px; color:#3a3530;">
                Questa email è generata automaticamente dal sistema ordini.<br/>
                Non rispondere direttamente a questo messaggio.
              </p>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:10px; font-weight:300;
                         color:#2a2520; margin-top:12px;">
                © ${new Date().getFullYear()} Atelier Sombre. Uso riservato al personale interno.
              </p>
            </td>
          </tr>


        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
const buildCustomerHtml = (order) => `
<!DOCTYPE html>
<html lang="it" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Conferma Ordine — Atelier Sombre</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; display:block; }
    body { background-color:#f5f3ef; font-family:'Jost', Helvetica, Arial, sans-serif; color:#0a0a0a; }
    a { color:inherit; text-decoration:none; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f3ef;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
         style="background-color:#f5f3ef;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
               width="600" style="max-width:600px;">


          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background-color:#0a0a0a; padding:20px 36px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:20px;
                                 font-weight:300; letter-spacing:6px; color:#f5f3ef; text-transform:uppercase;">
                      Atelier Sombre
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:9px;
                                 font-weight:400; letter-spacing:3px; color:#9a9085; text-transform:uppercase;">
                      Conferma ordine
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ HERO — THANK YOU ══ -->
          <tr>
            <td style="background-color:#1a1714; padding:52px 48px; text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                     style="margin:0 auto 28px;">
                <tr>
                  <td style="width:48px; height:48px; border:1px solid #c8b99a;
                              text-align:center; line-height:48px;">
                    <span style="font-family:'Cormorant Garamond', Georgia, serif;
                                 font-size:22px; color:#c8b99a; line-height:48px;">✓</span>
                  </td>
                </tr>
              </table>

              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:400;
                         letter-spacing:5px; color:#9a9085; text-transform:uppercase; margin-bottom:16px;">
                Ordine confermato
              </p>
              <h1 style="font-family:'Cormorant Garamond', Georgia, serif; font-size:50px;
                          font-weight:300; line-height:54px; color:#f5f3ef; margin-bottom:8px;">
                Grazie,<br/>
                <em style="font-style:italic; color:#c8b99a;">${order.firstname}.</em>
              </h1>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:13px; font-weight:300;
                         line-height:22px; color:#9a9085; max-width:380px; margin:20px auto 0;">
                Il tuo ordine è stato ricevuto e sarà elaborato a breve.
                Riceverai una notifica non appena la spedizione sarà avviata.
              </p>
            </td>
          </tr>


          <!-- ══ ORDER META ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:36px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border-top:1px solid #dedad4; border-bottom:1px solid #dedad4;">
                <tr>
                  <td width="25%" style="padding:14px 0;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:6px;">
                      N° ordine
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                               font-weight:600; color:#0a0a0a;">
                      ${padId(order.id)}
                    </p>
                  </td>
                  <td width="25%" style="padding:14px 0;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:6px;">
                      Data
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                               font-weight:600; color:#0a0a0a;">
                      ${formatDate(order.created_at)}
                    </p>
                  </td>
                  <td width="25%" style="padding:14px 0;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:6px;">
                      Stato
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                               font-weight:600; color:#0a0a0a;">
                      In elaborazione
                    </p>
                  </td>
                  <td width="25%" style="padding:14px 0;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:8px; font-weight:400;
                               letter-spacing:3px; color:#9a9085; text-transform:uppercase; margin-bottom:6px;">
                      Totale
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:16px;
                               font-weight:600; color:#0a0a0a;">
                      €${formatPrice(order.total_price)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ ORDER ITEMS ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:28px 36px 0;">
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                         letter-spacing:4px; color:#0a0a0a; text-transform:uppercase; margin-bottom:20px;">
                Articoli ordinati
              </p>

              ${buildItemRows(order.items)}

              <!-- Total -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="border-top:1px solid #0a0a0a;">
                <tr>
                  <td style="padding:16px 0 0;">
                    <span style="font-family:'Jost', Helvetica, sans-serif; font-size:10px;
                                 font-weight:500; letter-spacing:3px; text-transform:uppercase; color:#0a0a0a;">
                      Totale ordine
                    </span>
                  </td>
                  <td align="right" style="padding:16px 0 0;">
                    <span style="font-family:'Cormorant Garamond', Georgia, serif; font-size:22px;
                                 font-weight:600; color:#0a0a0a;">
                      €${formatPrice(order.total_price)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ SHIPPING ADDRESS ══ -->
          <tr>
            <td style="background-color:#f5f3ef; padding:32px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td width="50%" valign="top" style="padding-right:20px;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                               letter-spacing:4px; text-transform:uppercase; color:#0a0a0a; margin-bottom:12px;">
                      Indirizzo di spedizione
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:17px;
                               font-weight:400; color:#0a0a0a; margin-bottom:4px;">
                      ${order.firstname} ${order.lastname}
                    </p>
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px; font-weight:300;
                               line-height:20px; color:#5a5550;">
                      ${order.street}<br/>
                      ${order.zip_code} ${order.city} (${order.region})<br/>
                      ${order.country}
                    </p>
                  </td>
                  <td width="50%" valign="top" style="padding-left:20px; border-left:1px solid #dedad4;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:500;
                               letter-spacing:4px; text-transform:uppercase; color:#0a0a0a; margin-bottom:12px;">
                      Contatto
                    </p>
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px; font-weight:300;
                               line-height:20px; color:#5a5550;">
                      ${order.email}<br/>
                      +39 ${order.telephone_number}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ RESI ══ -->
          <tr>
            <td style="padding:32px 36px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                     style="background-color:#0a0a0a;">
                <tr>
                  <td style="padding:36px 32px;">
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:9px; font-weight:400;
                               letter-spacing:5px; color:#9a9085; text-transform:uppercase; margin-bottom:14px;">
                      Resi &amp; Cambi
                    </p>
                    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:24px;
                               font-weight:300; color:#f5f3ef; margin-bottom:14px;">
                      Non è quello che cercavi?<br/>
                      <em style="font-style:italic; color:#c8b99a;">Nessun problema.</em>
                    </p>
                    <p style="font-family:'Jost', Helvetica, sans-serif; font-size:12px; font-weight:300;
                               line-height:20px; color:#9a9085; margin-bottom:20px;">
                      Hai <strong style="color:#f5f3ef; font-weight:400;">30 giorni</strong>
                      dalla ricezione per richiedere un reso gratuito.
                      Il prodotto deve essere nelle condizioni originali, non indossato e con le etichette intatte.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      ${[
        'Reso gratuito entro 30 giorni',
        'Rimborso entro 5–10 giorni lavorativi',
        'Cambio taglia disponibile fino ad esaurimento scorte',
    ]
        .map(
            (policy) => `
                        <tr>
                          <td style="padding:8px 0; border-top:1px solid #2a2520;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td width="16" valign="top">
                                  <span style="font-family:'Cormorant Garamond', Georgia, serif;
                                               font-size:14px; color:#c8b99a;">—</span>
                                </td>
                                <td style="padding-left:10px;">
                                  <span style="font-family:'Jost', Helvetica, sans-serif; font-size:11px;
                                               font-weight:300; color:#9a9085;">${policy}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>`
        )
        .join('')}
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                           style="margin-top:24px;">
                      <tr>
                        <td>
                          <a href="https://atelier-sombre.com/resi"
                             style="display:inline-block; border:1px solid #c8b99a;
                                    font-family:'Jost', Helvetica, sans-serif; font-size:9px;
                                    font-weight:500; letter-spacing:3px; text-transform:uppercase;
                                    color:#c8b99a; padding:12px 28px;">
                            Richiedi un reso
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background-color:#0a0a0a; padding:36px 36px 28px; text-align:center; margin-top:2px;">
              <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:13px; font-weight:300;
                         letter-spacing:8px; color:#5a5550; text-transform:uppercase; margin-bottom:20px;">
                Atelier Sombre
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                     style="margin:0 auto 24px; width:40px;">
                <tr><td style="height:1px; background-color:#2a2520;"></td></tr>
              </table>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:11px; font-weight:300;
                         line-height:20px; color:#5a5550; margin-bottom:8px;">
                Hai domande? Scrivici a
                <a href="mailto:support@atelier-sombre.com"
                   style="color:#c8b99a; text-decoration:underline;">
                  support@atelier-sombre.com
                </a>
              </p>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:10px; font-weight:300;
                         line-height:18px; color:#3a3530;">
                <a href="#" style="color:#3a3530; text-decoration:underline;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="#" style="color:#3a3530; text-decoration:underline;">Termini e condizioni</a>
                &nbsp;·&nbsp;
                <a href="#" style="color:#3a3530; text-decoration:underline;">Cancella iscrizione</a>
              </p>
              <p style="font-family:'Jost', Helvetica, sans-serif; font-size:10px; font-weight:300;
                         color:#2a2520; margin-top:14px;">
                © ${new Date().getFullYear()} Atelier Sombre. Tutti i diritti riservati.
              </p>
            </td>
          </tr>


        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`; 

//Index Routes Orders

const index = (req, res) => {

    const queryOrders = 'SELECT * FROM orders'

    connection.query(queryOrders, (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query orders', err)
            res.status(500).json({ error: 'Errore interno orders' })
        }

        if (!ordersResults || ordersResults.length === 0) {
            res.json(['nessun risultato'])
        }

        res.json(ordersResults)
    })
}

// Show Routes single order
const show = (req, res) => {

    const email = req.params.email
    const queryOrders = 'SELECT * FROM orders WHERE email = ?'

    connection.query(queryOrders, [email], (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query orders', err)
            return res.status(500).json({ error: 'Errore interno orders' })
        }

        if (!ordersResults || ordersResults.length === 0) {
            return res.json(['nessun risultato'])
        }

        const finalResults = ordersResults

        const queryProductsDetail = `
            SELECT 
            orders.id AS order_id,
            shoes.name, shoes.category, shoes.color, shoes.genre, 
            image.main_image_url, 
            shoes_variant.size, order_shoes_variant.quantity, order_shoes_variant.price AS cart_price, shoes.on_sale,
            shoes.price AS system_price
            FROM orders
            JOIN order_shoes_variant ON orders.id = order_shoes_variant.order_id
            JOIN shoes_variant ON shoes_variant.id = order_shoes_variant.variant_id
            JOIN shoes ON shoes.id = shoes_variant.shoe_id
            JOIN image ON image.shoe_id = shoes.id
            WHERE email = ?`

        connection.query(queryProductsDetail, [email], (err, productsDetailResults) => {
            if (err) {
                console.error('Errore nella query orders', err)
                return res.status(500).json({ error: 'Errore interno orders' })
            }

            if (!productsDetailResults) {
                return res.json(['nessun risultato'])
            }

            finalResults.map(order => {
                order.products = productsDetailResults.filter(product => product.order_id === order.id)
            })

            return res.json(finalResults)
        })
    })
}

//Post routes new order
const post = (req, res, next) => {
    //get data from front
    const {
        firstname,
        lastname,
        email,
        telephone_number,
        fiscal_code,
        country,
        region,
        city,
        street,
        zip_code,
        total_price,
        vat_number,
        is_billing
    } = req.body.order;

    //check if inputs are valid
    if (!firstname || !lastname || !email || !telephone_number || !country || !region || !city || !street || !zip_code || !total_price) {
        return res.status(400).json({ error: 'Ordine non valido' });
    }

    //insert data in DB
    const queryOrders = 'INSERT INTO orders (firstname, lastname, email, telephone_number, fiscal_code, vat_number, country, region, city, street, zip_code, is_billing, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // Get from DB all shoes
    connection.query(queryOrders,
        [
            firstname,
            lastname,
            email,
            telephone_number,
            fiscal_code,
            vat_number,
            country,
            region,
            city,
            street,
            zip_code,
            is_billing,
            total_price
        ], (err, ordersResults) => {

            if (err) {
                console.error('Errore nella query orders:', err);
                return res.status(500).json({ error: 'Errore orders' });
            }

            //insert data in DB in order_shoes_variant
            const order_idQuery = `SELECT LAST_INSERT_ID()`;
            connection.query(order_idQuery, (err, idResult) => {
                if (err) {
                    console.error('Errore nella query shoes:', err);
                    return res.status(500).json({ error: 'Errore orders' });
                }

                const order_id = idResult[0]['LAST_INSERT_ID()'];

                //add order_shoes_variant every product object
                req.body.items.forEach(element => {
                    const queryOrderShoes = 'INSERT INTO order_shoes_variant (order_id, variant_id, quantity, price) VALUES (?, ?, ?, ?)';
                    connection.query(queryOrderShoes, [order_id, element.variant_id, element.quantity, element.price], (err, orderShoesResults) => {
                        if (err) {
                            console.error('Errore nella query order shoes variant:', err);
                            return res.status(500).json({ error: 'Errore order shoes variant' });
                        }
                        const queryChangeStock = 'UPDATE shoes_variant SET stock = stock - ? WHERE id = ?';
                        connection.query(queryChangeStock, [element.quantity, element.variant_id], (err, stockResults) => {
                            if (err) {
                                console.error('Errore nella query change stock:', err);
                                return res.status(500).json({ error: 'Errore change stock' });
                            }
                        })
                    })
                })

                //get last inserted order
                const queryLastOrder = 'SELECT * FROM orders WHERE id = ?';
                connection.query(queryLastOrder, [order_id], (err, result) => {
                    if (err) {
                        console.error('Errore nella query last order:', err);
                        return res.status(500).json({ error: 'Errore last order' });
                    }

                const queryShoesDetailsOrders = `
                        SELECT shoes.name, shoes_variant.size, shoes.color, shoes.price, shoes.on_sale AS discount, order_shoes_variant.quantity, image.main_image_url FROM orders
                        JOIN order_shoes_variant ON orders.id = order_shoes_variant.order_id
                        JOIN shoes_variant ON shoes_variant.id = order_shoes_variant.variant_id
                        JOIN shoes ON shoes.id = shoes_variant.shoe_id
                        JOIN image ON image.shoe_id = shoes.id
                        WHERE order_id = ?`
                    connection.query(queryShoesDetailsOrders, [order_id], (err, shoesDetailsResult) => {
                        if (err) {
                            console.error('Errore nella query shoes details orders:', err);
                            return res.status(500).json({ error: 'Errore shoes details orders' });
                        }
                        result[0]["items"] = shoesDetailsResult;

                      const sendOrderEmailCustomer = async (req, res, next) => {
                       
                        try {
                          // req.body.order è un array — prendiamo il primo elemento
                          const order = result[0];
                          const { email, firstname } = order;

                          await transporter.sendMail({
                            from: '"Atelier Sombre" <orders@atelier-sombre.com>',
                            to: email,
                            subject: `${firstname}, il tuo ordine è confermato! ${padId(order.id)}`,
                            html: buildCustomerHtml(order),
                          });

                          /* next(); */
                        } catch (error) {
                          console.error('Errore invio email customer:', error);
                        }
                      };

                      const sendOrderEmailInternal = async (req, res, next) => {
                     
                        try {
                          // req.body.order è un array — prendiamo il primo elemento
                          const order = result[0];

                          await transporter.sendMail({
                            from: '"Sistema Ordini" <orders@atelier-sombre.com>',
                            to: process.env.INTERNAL_ORDERS_EMAIL,  // es. team@atelier-sombre.com nel .env
                            subject: `[NUOVO ORDINE] ${padId(order.id)} — ${order.firstname} ${order.lastname} — €${formatPrice(order.total_price)}`,
                            html: buildInternalHtml(order),
                          });

                        
                        } catch (error) {
                          console.error('Errore invio email interna:', error);
                          
                        }
                      };

                     setTimeout(() => {
                       sendOrderEmailCustomer()
                     }, 30001)
                     
                      sendOrderEmailInternal()
                        res.status(200).json(result)
                    })

                })
            })
        })
}

module.exports = { index, show, post };