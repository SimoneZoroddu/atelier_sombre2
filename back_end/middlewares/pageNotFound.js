const e = require("express");

const pageNotFound = (req, res, next) => {
    res.status(404).json({ err: 'Page not found' });
    next();
}

module.exports = pageNotFound