const express = require('express');
const router = express.Router();
const { getShippingConfig } = require('../controllers/configController');

router.get('/config/shipping', getShippingConfig);

module.exports = router;
