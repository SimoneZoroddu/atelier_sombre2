const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');
const checkQty = require('../middlewares/checkQty');
const checkPrices = require('../middlewares/checkPrices')
const checkTotal = require('../middlewares/checkTotal');
/* const sendOrderEmailSeller = require('../middlewares/sendOrderEmailSeller'); */
const sendOrderEmailCustomer = require('../middlewares/sendOrderEmailCustomer');
const sendResultPostOrder = require('../middlewares/sendResultPostOrder');


// index route for all orders
router.get('/index', ordersControllers.index);

// show route for orders by email
router.get('/:email', ordersControllers.show);

// post route for add a new order
router.post('/add-order', checkQty, checkPrices, checkTotal, ordersControllers.post, /* sendOrderEmailCustomer, sendOrderEmailSeller, */ sendResultPostOrder);

module.exports = router;