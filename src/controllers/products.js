const { productSplitImage } = require('../config/function');
const { dataNotFound } = require('../config/variable');
const productsHelper = require('./products-helper');

exports.getProductCategory = async (req, res) => {
  let productsResult;
  try {
    productsResult = await productsHelper.getProductsByCategory(req, res);
  } catch (err) {
    return res.status(400).json({
      success: false,
      slugIsExist: err.message !== dataNotFound,
      message: err.message,
    });
  }
  const { products, categoryTitle } = productsResult;
  res.status(200).json({
    success: true,
    data: {
      categoryTitle,
      slugIsExist: true,
      count: products.length,
      products: products ? productSplitImage(products) : [],
    },
  });
};

exports.getAllProducts = async (req, res) => {
  let products;
  try {
    products = await productsHelper.getAllProducts(req, res);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  res.status(200).json({
    success: true,
    data: {
      count: products.length,
      products: products ? productSplitImage(products) : [],
    },
  });
};

exports.getProductBySlug = async (req, res) => {
  let productData;
  try {
    productData = await productsHelper.getProductBySlug(req, res);
  } catch (err) {
    return res.status(400).json({
      success: false,
      slugIsExist: err.message !== dataNotFound,
      message: err.message,
    });
  }
  const { product, categories, relatedProducts } = productData;
  res.status(200).json({
    success: true,
    data: {
      product,
      categories,
      relatedProducts: relatedProducts ? productSplitImage(relatedProducts) : [],
    },
  });
};
