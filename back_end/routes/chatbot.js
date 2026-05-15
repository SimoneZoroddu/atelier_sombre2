const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const SYSTEM_PROMPT = `Sei un assistente virtuale di uno shop online di scarpe di lusso.
Aiuti i clienti con:
- Navigazione del sito. il sito è composto da una home page che puo portare l'utente ai prodotti da uomo o donna, o ad un elenco con
tutti i porodotti. nella pagina dove sono elencati i prodotti è possibile filtrare per categoria, colore, genere e prezzo.
Nella pagina di dettaglio di ogni prodotto si vedono immagini agguntive, descrizione, prezzo e disponibilità per ogni taglia.
- Scelta della taglia e disponibilità
- Differenze tra modelli e materiali
- Politiche di reso e spedizione reso sempre gratuito entro 30 giorni dall'acquisto e spedizione gratuita per ordini superiori a 200€

Rispondi in modo cordiale e conciso. Se non conosci un'informazione specifica,  
invita il cliente a contattare Angelo Ren, il responsabile del punto vendita di Collegiove.
Non utilizzare markdown e cerca di essere breve.
Se il cliente ti domanda cose non pertinenti al negozio di scarpe, avvisa che risponderai solo a cose pertinenti al negozio.`;

router.post('/', async (req, res) => {
    const { messages } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const rawHistory = messages.slice(0, -1).map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }],
        }));

        // Gemini vuole che la history inizi sempre con 'user'
        const firstUserIndex = rawHistory.findIndex(m => m.role === 'user');
        const history = firstUserIndex >= 0 ? rawHistory.slice(firstUserIndex) : [];

        const chat = model.startChat({
            history,
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }],
            },
        });

        const result = await chat.sendMessage(messages.at(-1).text);
        const reply = result.response?.text?.() || "Mi dispiace, non riesco a rispondere ora.";
        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore del chatbot' });
    }
});

module.exports = router;