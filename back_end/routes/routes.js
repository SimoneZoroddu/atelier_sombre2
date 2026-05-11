const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');
const orderControllers = require('../controllers/ordersController');
const checkQty = require('../middlewares/checkQty');
const checkPrices = require('../middlewares/checkPrices');

// index route for all shoes
router.get('/index', productControllers.index);

// show route for a single product by name and color
router.get('/product/:name/:color', productControllers.show);

// index route for all orders
router.get('/orders', orderControllers.index);

// show route for orders by email
router.get('/orders/:email', orderControllers.show);

// post route for add a new order
router.post('/order/add-order', checkQty, checkPrices, orderControllers.post);

module.exports = router;
