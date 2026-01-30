const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', logoutUser);
router.get('/auth/me', isAuthenticatedUser, getCurrentUser);

module.exports = router;
