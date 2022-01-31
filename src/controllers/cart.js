const util = require('util');
const { queryGetProducts, queryGetCart } = require('../config/query');
const conn = require('../config/connection');
const { errorQuery } = require('../config/variable');
const { productSplitImage } = require('../config/function');

const mysqlQuery = util.promisify(conn.query).bind(conn);

exports.getCartByClientKey = async (req, res) => {
  const { clientKey } = req.params;
  const queryCart = `SELECT cart.id AS id, qty, title, price, images, slug FROM cart JOIN products ON cart.id_product=products.id WHERE client_key = '${clientKey}'`;
  try {
    const cartData = await mysqlQuery(queryCart);
    let totalItems = 0;
    let subtotal = 0;
    cartData.forEach((data) => {
      totalItems += data.qty;
      subtotal += (data.price * data.qty);
    });
    res.status(200).json({
      success: true,
      data: {
        totalItems,
        subtotal,
        items: cartData ? productSplitImage(cartData) : [],
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorQuery,
    });
  }
};

exports.insertCart = async (req, res) => {
  const { clientKey, productId, qty } = req.body;
  const queryProduct = queryGetProducts({
    where: 'id',
    wherevalue: productId,
  });
  let product;
  try {
    product = await mysqlQuery(queryProduct);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: errorQuery,
    });
  }
  if (product.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found!',
    });
  }
  const queryCart = queryGetCart({
    where: 'client_key',
    wherevalue: clientKey,
    where2: 'id_product',
    wherevalue2: productId,
  });
  const cartIsExist = await mysqlQuery(queryCart);
  if (cartIsExist.length === 0) {
    try {
      const data = [
        [clientKey, productId, qty, new Date()],
      ];
      await mysqlQuery(
        'INSERT INTO cart (client_key, id_product, qty, date_input) VALUES ? ',
        [data],
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: errorQuery,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Cart inserted successfully!',
    });
  } else {
    try {
      const newQty = +qty + cartIsExist[0].qty;
      await mysqlQuery(`UPDATE cart SET qty = ${newQty} WHERE id = ${cartIsExist[0].id}`);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: errorQuery,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully!',
    });
  }
};

exports.updateCart = (req, res) => {
  const { clientKey, data } = req.body;
  data.forEach((item) => {
    conn.query(
      `UPDATE cart SET qty = ${item.quantity} WHERE id = ${item.id} AND client_key = '${clientKey}'`,
      (err) => {
        if (err) console.log(err);
      },
    );
  });
  res.status(200).json({
    success: true,
    message: 'Cart data is updated!',
  });
};

exports.removeCart = (req, res) => {
  const { clientKey, id } = req.body;
  conn.query(`DELETE FROM cart WHERE id = ${id} AND client_key = '${clientKey}'`, (err) => {
    if (err) console.log(err);
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully!',
    });
  });
};
