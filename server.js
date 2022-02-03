const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
process.env.TZ = 'Asia/Jakarta';

const app = express();

const { PATH_URL } = require('./src/config/setting');

const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const ordersRoutes = require('./src/routes/orders');
const authRoutes = require('./src/routes/auth');

app.use(cors());
app.use(express.json());

// ROUTES
app.get(PATH_URL, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Selamat datang di API BUTIKSTORE',
  });
});

// PUBLIC API
app.use(`${PATH_URL}products`, productsRoutes);
app.use(`${PATH_URL}cart`, cartRoutes);
app.use(`${PATH_URL}orders`, ordersRoutes);
app.use(`${PATH_URL}auth`, authRoutes);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on PORT ${PORT}`);
});
