const connection = require('../data/data');

const post = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email mancante' });
    }

    const query = 'INSERT INTO newsletter_subscribers (email) VALUES (?)';

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Errore nella query:', err);
            return res.status(500).json({ error: 'Errore interno', message: err.message });
        }

        res.json({ message: 'Email registrata con successo' });
    });
};

module.exports = { post };