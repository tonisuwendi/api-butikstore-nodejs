const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart');

module.exports = router;

// @ GET /cart/:clientKey
router.get('/:clientKey', cartController.getCartByClientKey);

// @ POST /cart
router.post('/', cartController.insertCart);

// @ UPDATE /cart
router.put('/', cartController.updateCart);

// @ DELETE /cart
router.delete('/', cartController.removeCart);
