const util = require('util');
const conn = require('../config/connection');
const { queryGetProducts, queryGetCategories } = require('../config/query');
const { errorQuery, dataNotFound } = require('../config/variable');
const { querySorting } = require('../config/function');

const mysqlQuery = util.promisify(conn.query).bind(conn);

exports.getProductsByCategory = async (req) => {
  const { slug } = req.params;
  const { limit, sort } = req.query;
  const query = queryGetCategories({
    where: 'slug',
    wherevalue: slug,
  });
  let categories = [];
  try {
    categories = await mysqlQuery(query);
  } catch (err) {
    throw new Error(errorQuery);
  }
  if (categories.length === 0) {
    throw new Error(dataNotFound);
  }
  const categoryId = categories[0].id;
  const sorting = querySorting(sort);
  const queryProducts = queryGetProducts({
    orderby: 'id',
    ...sorting,
  });
  try {
    const products = await mysqlQuery(queryProducts);
    const productsFilter = products.filter((product) => product.categories.includes(categoryId));
    if (!limit) {
      return {
        products: productsFilter,
        categoryTitle: categories[0].title,
      };
    }
    const limitProducts = [];
    for (let i = 0; i < +limit; i++) {
      limitProducts.push(productsFilter[i]);
    }
    return {
      products: limitProducts,
      categoryTitle: categories[0].title,
    };
  } catch (err) {
    throw new Error(errorQuery);
  }
};

exports.getAllProducts = async (req) => {
  const { limit, sort } = req.query;
  const sorting = querySorting(sort);
  const query = queryGetProducts({
    orderby: 'id',
    limit,
    ...sorting,
  });
  try {
    return await mysqlQuery(query);
  } catch (err) {
    throw new Error(errorQuery);
  }
};

exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  const queryProduct = queryGetProducts({
    where: 'slug',
    wherevalue: slug,
  });
  let product;
  try {
    product = await mysqlQuery(queryProduct);
  } catch (err) {
    throw new Error(errorQuery);
  }
  if (product.length === 0) {
    throw new Error(dataNotFound);
  }

  const allProducts = await this.getAllProducts(req, res);

  const categoriesResult = product[0].categories.split(',');
  const categoriesData = [];
  for (let i = 0; i < categoriesResult.length; i++) {
    const queryCategory = queryGetCategories({
      where: 'id',
      wherevalue: categoriesResult[i],
    });
    const categoryResult = await mysqlQuery(queryCategory);
    categoriesData.push(categoryResult[0]);
  }

  let relatedProducts = [];
  allProducts.forEach((productData) => {
    for (let i = 0; i < categoriesResult.length; i++) {
      const productFilter = productData.categories.includes(categoriesResult[i]);
      if (productFilter) {
        relatedProducts.push(productData);
      }
    }
  });

  relatedProducts = [...new Set(relatedProducts)].filter((relProduct) => relProduct.slug !== slug);

  return {
    product: product[0],
    categories: categoriesData,
    relatedProducts: relatedProducts.splice(0, 5),
  };
};
