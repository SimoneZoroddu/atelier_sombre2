const connection = require('../data/data');
//Index Routes Orders
const index = (req, res) => {

    const queryOrders = 'SELECT * FROM orders'

    connection.query(queryOrders, (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query orders', err)
            return res.status(500).json({ error: 'Errore interno orders' })
        }

        if (!ordersResults) {
            return res.json(['nessun risultato'])
        }

        res.json(ordersResults)
    })
}

// Show Routes single order
const show = (req, res) => {

    const finalResults = []
    const email = req.params.email
    const queryOrders = 'SELECT * FROM orders WHERE email = ?'

    connection.query(queryOrders, [email], (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query orders', err)
            return res.status(500).json({ error: 'Errore interno orders' })
        }

        if (!ordersResults) {
            return res.json(['nessun risultato'])
        }

        const queryProductsDetail = `
            SELECT * FROM orders
            JOIN order_shoes_variant ON orders.id = order_shoes_variant.order_id
            JOIN shoes_variant ON shoes_variant.id = order_shoes_variant.variant_id
            JOIN shoes ON shoes.id = shoes_variant.shoe_id
            WHERE email = ?`

            connection.query(queryProductsDetail, [email], (err, productsDetailResults) => {
                finalResults.push({...ordersResults.details = productsDetailResults})
                res.json(finalResults)
            })
    })
}

//Post routes orders
const post = (req, res) => {
    // waiting for cart data
    const { order } = req.body;
    //query to add order on table db
    const queryOrders = 'INSERT INTO orders (order) VALUES (?)';
    // Get from DB all shoes
    connection.query(queryOrders, [order], (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno' });
        }

        if (!shoesResults) {
            return res.json([]);
        }

        return res.status(201).json({ message: 'Ordine inserito con successo' });
    });
}

module.exports = { index, show, post };