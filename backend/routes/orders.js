const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus, 
    getAllOrders,
    cancelOrder
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User routes
router.post('/order/new', isAuthenticatedUser, createOrder);
router.get('/user/orders', isAuthenticatedUser, getUserOrders);
router.get('/order/:id', isAuthenticatedUser, getOrderById);
router.post('/order/:id/cancel', isAuthenticatedUser, cancelOrder);

// Admin routes
router.get('/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.put('/order/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
