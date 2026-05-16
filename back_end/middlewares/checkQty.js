const connection = require("../data/data");

const checkQty = (req, res, next) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Il carrello è vuoto" });
    }

    const ids = items.map(item => item.variant_id);

    const queryShoes = `SELECT * FROM shoes_variant WHERE id IN (?)`;

    connection.query(queryShoes, [ids], (err, shoesResults) => {

        const missingItems = items.filter(item => {
            return shoesResults.find(shoe => shoe.id === item.variant_id && shoe.stock < item.quantity)
        })

        if (missingItems.length > 0) {
            return res.status(400).json({ error: "Quantità non disponibile", missingItems });
        } else {
            next();
        }
    })
}

module.exports = checkQty;