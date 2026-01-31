const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus, 
    getAllOrders,
    deleteOrder,
    cancelOrder,
    verifyPayment,
    lookupOrder
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles, getUserFromToken } = require('../middleware/auth');

// User routes
router.post('/order/new', getUserFromToken, createOrder);
router.post('/order/lookup', lookupOrder);
router.get('/user/orders', isAuthenticatedUser, getUserOrders);
router.get('/order/:id', getUserFromToken, getOrderById);
router.post('/order/:id/cancel', isAuthenticatedUser, cancelOrder);
router.get('/order/:id/verify-payment', verifyPayment);

// Admin routes
router.get('/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.put('/order/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.delete('/order/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;
