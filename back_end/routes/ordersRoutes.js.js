const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/ordersController');
const checkQty = require('../middlewares/checkQty');
const checkPrices = require('../middlewares/checkPrices');

// index route for all orders
router.get('/index', orderControllers.index);

// show route for orders by email
router.get('/:email', orderControllers.show);

// post route for add a new order
router.post('/add-order', checkQty, checkPrices, orderControllers.post);

module.exports = router;