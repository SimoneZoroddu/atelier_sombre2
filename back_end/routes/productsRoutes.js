const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');

// index route for all shoes
router.get('/index', productControllers.index);

// show route for shoes by genre
router.get('/genre/:genre', productControllers.showByGenre);

// show route for a single product by name and color
router.get('/:name/:color', productControllers.show);

module.exports = router;