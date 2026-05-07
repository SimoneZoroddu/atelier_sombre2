const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');

// index route for all shoes
router.get('/index', productControllers.index);

// route for single item searching by name and color instead of id
router.get('/product/:name/:color', productControllers.show);

module.exports = router;
