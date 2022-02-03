const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

module.exports = router;

// @ POST /auth/register
router.post('/register', authController.register);
