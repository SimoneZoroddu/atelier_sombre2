const connection = require("../data/data");

const checkQty = (req, res, next) => {

    next();
};

module.exports = checkQty;