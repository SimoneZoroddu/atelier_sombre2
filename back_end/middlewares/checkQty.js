const connection = require("../data/data");

const checkQty = async (req, res, next) => {
    
    //compare quantity from req.body with DB quantity
    console.log(req.body);
    const {itesms} = req.body;
    const queryShoes = 'SELECT * FROM shoes WHERE id = ?';
    
    next(); 
};

module.exports = checkQty;