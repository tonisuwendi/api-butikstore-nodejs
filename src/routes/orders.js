const express = require('express');

const router = express.Router();

const ordersController = require('../controllers/orders');

module.exports = router;

// @ GET /orders/:orderNumber
router.get('/:orderNumber', ordersController.getOrder);

// @ POST /orders
router.post('/', ordersController.insertOrder);
