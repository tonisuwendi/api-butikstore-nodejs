const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
process.env.TZ = 'Asia/Jakarta';

const app = express();

const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const ordersRoutes = require('./src/routes/orders');
const authRoutes = require('./src/routes/auth');

app.use(cors());
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Selamat datang di API BUTIKSTORE',
  });
});

// PUBLIC API
app.use('/products', productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on PORT ${PORT}`);
});
