const express = require('express');
const router = express.Router();
// Poora path specify kar do extension ke saath
const { register, login } = require('../controllers/authController.js');

router.post('/register', register);
router.post('/login', login);

module.exports = router;