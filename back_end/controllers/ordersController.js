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

//Post routes orders

/* INSERT INTO orders (firstname, lastname, email, telephone_number, fiscal_code, vat_number, country, region, city, street, zip_code, is_billing, status, total_price) VALUES
-- SCENARIO A: Mario Rossi (Ordine singolo con più articoli)
('Mario', 'Rossi', 'mario.rossi@email.com', '3331234567', 'RSSMRA80A01F205X', NULL, 'Italia', 'Lombardia', 'Milano', 'Via Montenapoleone 8', '20121', 1, 'PAID', 1900.00);

INSERT INTO order_shoes_variant (order_id, variant_id, quantity, price) VALUES
-- Dettagli Ordine 1 (Mario Rossi: 2 articoli diversi in un solo ordine)
(1, 2, 1, 1100.00), -- Mario compra 1 Derby Helios
(1, 4, 1, 800.00),  -- Mario compra 1 Stringata (Totale carrello: 1900.00) */

const post = (req, res) => {
    // waiting for cart data
    const { 
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
        status, 
        total_price 
    } = req.body;
    //query to add order on table db
    const queryOrders = 'INSERT INTO orders (firstname, lastname, email, telephone_number, fiscal_code, vat_number, country, region, city, street, zip_code, is_billing, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
            status, 
            total_price
        ], (err, ordersResults) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore interno' });
        }

        if (!ordersResults) {
            return res.json([]);
        }

        return res.status(201).json({ message: 'Ordine inserito con successo' });
    });
}

module.exports = { index, show, post };