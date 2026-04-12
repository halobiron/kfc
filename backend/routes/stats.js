const express = require('express');
const router = express.Router();
const { getDashboardStats, getIngredientUsageStats } = require('../controllers/statsController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

router.route('/stats/dashboard').get(isAuthenticatedUser, authorizePermission('reports.view'), getDashboardStats);
router.route('/stats/ingredient-usage').get(isAuthenticatedUser, authorizePermission('ingredients.view'), getIngredientUsageStats);

module.exports = router;
