const express = require('express');
const router = express.Router();
const { getLogs, createGPSLog } = require('../controllers/logController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Admin route to get logs
router.get('/logs', isAuthenticatedUser, authorizePermission('system.admin'), getLogs);

// Gửi log GPS
router.post('/logs/gps', isAuthenticatedUser, createGPSLog);

module.exports = router;
