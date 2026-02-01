const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/stats/dashboard').get(isAuthenticatedUser, authorizeRoles('admin'), getDashboardStats);

module.exports = router;
