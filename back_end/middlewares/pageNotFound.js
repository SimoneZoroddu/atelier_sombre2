const e = require("express");

const pageNotFound = (err, req, res) => res.status(404).json({ error: 'Page not found' });

module.exports = pageNotFound