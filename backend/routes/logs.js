const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Admin route to get logs
router.get('/logs', isAuthenticatedUser, authorizePermission('system.admin'), getLogs);

module.exports = router;
