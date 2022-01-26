const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
process.env.TZ = 'Asia/Jakarta';

const app = express();

const productsRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server is running on PORT ${PORT}`);
});
