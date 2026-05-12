const connection = require("../data/data");

const checkQty = async (req, res, next) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Il carrello è vuoto" });
    }

    try {
        const ids = items.map(item => item.variant_id);

        const [dbVariants] = await connection.promise().query(
            "SELECT id, stock FROM shoes_variant WHERE id IN (?)",
            [ids]
        );

        const missingItems = [];

        for (const item of items) {
            const dbItem = dbVariants.find(v => v.id === item.variant_id);

            if (!dbItem) {
                return res.status(404).json({ error: `Prodotto con ID ${item.variant_id} non trovato` });
            }

            if (item.quantity > dbItem.stock) {
                missingItems.push({
                    id: item.variant_id,
                    requested: item.quantity,
                    available: dbItem.stock
                });
            }
        }

        if (missingItems.length > 0) {
            return res.status(400).json({ 
                error: "Quantità non disponibile per alcuni articoli", 
                missing: missingItems 
            });
        }

        next();

    } catch (err) {
        console.error("Errore nel middleware checkQty:", err);
        return res.status(500).json({ error: "Errore interno del server" });
    }
};

module.exports = checkQty;