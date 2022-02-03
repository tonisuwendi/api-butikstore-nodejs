const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');

module.exports = router;

// @ GET /products/product-category/:slug
router.get('/product-category/:slug', productsController.getProductCategory);

// @ GET /products/all-products
router.get('/all-products', productsController.getAllProducts);

// @ GET /products/search
router.get('/search', productsController.searchProducts);

// @ GET /products/detail/:slug
router.get('/detail/:slug', productsController.getProductBySlug);
