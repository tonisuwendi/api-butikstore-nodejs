const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const verifyToken = require('../config/verifyToken');

module.exports = router;

// @ GET /auth/verify-token
router.get('/verify-token', verifyToken.verifyTokenUser);

// @ POST /auth/register
router.post('/register', authController.register);

// @ POST /auth/login
router.post('/login', authController.login);
