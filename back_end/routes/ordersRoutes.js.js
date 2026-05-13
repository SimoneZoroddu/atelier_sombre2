const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');
const checkQty = require('../middlewares/checkQty');
const checkPrices = require('../middlewares/checkPrices')
/* const sendOrderEmailSeller = require('../middlewares/sendOrderEmailSeller'); */
const sendOrderEmailCustomer = require('../middlewares/sendOrderEmailCustomer');

// index route for all orders
router.get('/index', ordersControllers.index);

// show route for orders by email
router.get('/:email', ordersControllers.show);

// post route for add a new order
router.post('/add-order', checkQty, checkPrices, ordersControllers.post, sendOrderEmailCustomer, /* sendOrderEmailSeller */
    (req, res) => {
        return res.status(200).json({
            success: true,
            order: req.orderResult
        });
    }
);

module.exports = router;