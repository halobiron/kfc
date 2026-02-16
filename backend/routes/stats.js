const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

router.route('/stats/dashboard').get(isAuthenticatedUser, authorizePermission('reports.view'), getDashboardStats);

module.exports = router;
