const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


// READ ALL ORDERS
router.get('/', checkAuth, OrdersController.orders_get_all);

// CREATE ONE ORDER
router.post('/', checkAuth, OrdersController.orders_create_order);

// READ ONE ORDER
router.get('/:orderId', checkAuth, OrdersController.orders_get_one);

// DELETE ONE ORDER
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_one);


module.exports = router;