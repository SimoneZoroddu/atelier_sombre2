const connection = require("../data/data");

const checkTotal = (req, res, next) => {

    const { items, order } = req.body;

    let total = 0;

    items.forEach(item => {
        total += item.price * item.quantity;
    });

    if (total !== order.total_price) {
        return res.status(400).json({ error: "prezzo totale non corretto", sysTotal: total, cartTotal: order.total_price });
    } else {
        next();
    }

};

module.exports = checkTotal;