const connection = require("../data/data");

const checkPrices = (req, res, next) => {

    const { items } = req.body;

    const ids = items.map(item => item.variant_id);

    const queryShoes = `
    SELECT shoes_variant.*, shoes.price, shoes.on_sale  
    FROM shoes_variant 
    JOIN shoes ON shoes.id = shoes_variant.shoe_id
    WHERE shoes_variant.id IN (?)`;

    connection.query(queryShoes, [ids], (err, shoesResults) => {
        const wrongPrices = items.filter(item => {
            return shoesResults.find(shoe => {
                item.sysPrice = parseInt(shoe.price)
                item.sysDiscount = shoe.on_sale
                if(shoe.id === item.variant_id && shoe.on_sale > 0) {
                    return (parseInt(shoe.price) * (1 - shoe.on_sale / 100)) !== item.price
                } 
                if (shoe.id === item.variant_id && shoe.on_sale === 0) {
                    return parseInt(shoe.price) !== item.price
                } 
            })
        })

        if (wrongPrices.length > 0) {
            return res.status(400).json({ error: "prezzi incogruenti", wrongPrices });
        } else {
            next();
        }
    })


};

module.exports = checkPrices;