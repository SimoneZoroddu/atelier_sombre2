const connection = require("../data/data");

const checkPrices = (req, res, next) => { 
    next();
};

module.exports = checkPrices;