const express = require('express');

const { verifyUser } = require('../config/verifyToken');

const router = express.Router();

const ordersController = require('../controllers/orders');

module.exports = router;

// @ GET /orders/:orderNumber
router.get('/:orderNumber', ordersController.getOrder);

// @ * VALIDATION
router.use('*', verifyUser);

// @ GET /orders/by-user
router.get('/', ordersController.getOrdersUser);

// @ POST /orders
router.post('/', ordersController.insertOrder);
