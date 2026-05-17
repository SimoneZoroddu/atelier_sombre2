const connection = require('../data/data');

const sendResultPostOrder = (req, res) => {
    //get last inserted order
    const order_idQuery = `SELECT LAST_INSERT_ID()`;
    connection.query(order_idQuery, (err, idResult) => {
        if (err) {
            console.error('Errore nella query shoes:', err);
            return res.status(500).json({ error: 'Errore orders' });
        }
        
        const order_id = idResult[0]['LAST_INSERT_ID()'];
        // console.log(order_id);

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

                res.status(200).json(result)
            })
        })
    })
}

module.exports = sendResultPostOrder