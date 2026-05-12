const connection = require('../data/data');
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
const post = (req, res) => {
    console.log(req.body);
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
                const orderQuery = 'SELECT * FROM orders WHERE id = ?';
                connection.query(orderQuery, [order_id], (err, orderResults) => {
                    if (err) {
                        console.error('Errore nella query order:', err);
                        return res.status(500).json({ error: 'Errore orders' });
                    }
                    return res.status(200).json(orderResults)
                })
            })
        })
}

module.exports = { index, show, post };