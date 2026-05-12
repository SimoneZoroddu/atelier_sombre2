const connection = require("../data/data");

const checkQty = (req, res, next) => {

    const { items } = req.body;
    const missingItems = [];
    console.log(items);
    items.forEach((item) => {
        const { id, quantity } = item;
        const query = 'SELECT * FROM '
        const product = connection.find((product) => product.id === id);
        if (product) {
            if (product.quantity < quantity) {
                missingItems.push(product.name);
            }
        }
    });
    if (missingItems.length > 0) {
        return res.status(400).json({ error: `Missing items: ${missingItems.join(", ")}` });
    }
    next();
};

    module.exports = checkQty;