const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');
const checkQty = require('../middlewares/checkQty');
const checkPrices = require('../middlewares/checkPrices')
const sendOrderEmail = require('../middlewares/sendOrderEmail');

// index route for all orders
router.get('/index', ordersControllers.index);

// show route for orders by email
router.get('/:email', ordersControllers.show);

// post route for add a new order
router.post('/add-order', checkQty, checkPrices, ordersControllers.post, sendOrderEmail);

module.exports = router;