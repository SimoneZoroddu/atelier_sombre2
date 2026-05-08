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

        const finalResults = ordersResults

        const queryProductsDetail = `
            SELECT 
            shoes.name, shoes.color, shoes.genre, shoes.category, shoes.on_sale,
            image.main_image_url, 
            orders.id AS order_id,
            order_shoes_variant.quantity, order_shoes_variant.price AS cart_price,
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