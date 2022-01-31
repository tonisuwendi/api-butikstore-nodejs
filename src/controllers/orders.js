const util = require('util');
const conn = require('../config/connection');
const { errorQuery, dataNotFound } = require('../config/variable');

const mysqlQuery = util.promisify(conn.query).bind(conn);

exports.getOrder = async (req, res) => {
  const { orderNumber } = req.params;
  const { orderId, phone } = req.query;
  try {
    const getOrder = await mysqlQuery(`SELECT * FROM orders WHERE id = ${orderId} AND order_number = '${orderNumber}' AND phone = '${phone}'`);
    if (getOrder.length > 0) {
      conn.query(`SELECT order_products.id AS id, qty, order_products.title AS title, order_products.price AS price, image, slug FROM order_products JOIN products ON order_products.id_product=products.id WHERE order_products.order_id = ${getOrder[0].id}`, (err, productsOrder) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: errorQuery,
            slugIsExist: false,
          });
        }
        res.status(200).json({
          success: true,
          data: {
            order: getOrder[0],
            products: productsOrder,
            slugIsExist: true,
          },
        });
      });
    } else {
      res.status(400).json({
        success: false,
        message: dataNotFound,
        slugIsExist: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorQuery,
      slugIsExist: false,
    });
  }
};

exports.insertOrder = async (req, res) => {
  const {
    name, phone, postalCode, address, notes, clientKey,
  } = req.body;
  if (
    name === undefined || name.trim() === ''
    || phone === undefined || phone.trim() === ''
    || postalCode === undefined || postalCode.trim() === ''
    || address === undefined || address.trim() === ''
    || clientKey === undefined || clientKey.trim() === ''
  ) {
    return res.status(400).json({
      success: false,
      message: errorQuery,
    });
  }

  const queryCart = `SELECT products.id AS productId, qty, title, price, images, slug FROM cart JOIN products ON cart.id_product=products.id WHERE client_key = '${clientKey}'`;
  try {
    const cartData = await mysqlQuery(queryCart);
    let subtotal = 0;
    cartData.forEach((data) => {
      subtotal += (data.price * data.qty);
    });

    if (cartData.length === 0) {
      throw new Error('Error!');
    }

    const orderNumber = Date.now();
    const data = [
      [orderNumber, name, phone, postalCode, address, notes, subtotal, new Date()],
    ];
    conn.query('INSERT INTO orders (order_number, name, phone, postal_code, address, notes, total, date_order) VALUES ?', [data], (err, insert) => {
      if (err) console.log(err);
      const { insertId } = insert;
      const dataProduct = cartData.map((cartItem) => [cartItem.productId, cartItem.title, cartItem.price, cartItem.qty, cartItem.images.split('^')[0], insertId]);
      conn.query('INSERT INTO order_products (id_product, title, price, qty, image, order_id) VALUES ?', [dataProduct], async (errProd) => {
        if (errProd) console.log(errProd);
        await mysqlQuery(`DELETE FROM cart WHERE client_key = '${clientKey}'`);
        res.status(200).json({
          success: true,
          data: {
            insertId,
            orderNumber,
            phone,
          },
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: errorQuery,
    });
  }
};
