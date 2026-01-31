const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus, 
    getAllOrders,
    cancelOrder,
    verifyPayment,
    lookupOrder
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User routes
router.post('/order/new', createOrder);
router.post('/order/lookup', lookupOrder);
router.get('/user/orders', isAuthenticatedUser, getUserOrders);
router.get('/order/:id', getOrderById);
router.post('/order/:id/cancel', isAuthenticatedUser, cancelOrder);
router.get('/order/:id/verify-payment', verifyPayment);

// Admin routes
router.get('/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.put('/order/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
