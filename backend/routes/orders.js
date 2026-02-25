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
    getShippingConfig
} = require('../controllers/orderController');
const { isAuthenticatedUser, getUserFromToken, authorizePermission } = require('../middleware/auth');

// User routes
router.post('/order/new', isAuthenticatedUser, createOrder);
router.get('/user/orders', isAuthenticatedUser, getUserOrders);
router.get('/order/:id', getUserFromToken, getOrderById);
router.post('/order/:id/cancel', isAuthenticatedUser, cancelOrder);
router.get('/order/:id/verify-payment', verifyPayment);
router.get('/config/shipping', getShippingConfig);

// Admin/Kitchen/Staff routes
router.get('/orders', isAuthenticatedUser, authorizePermission('orders.view', 'kitchen.view'), getAllOrders);
router.put('/order/update/:id', isAuthenticatedUser, authorizePermission('orders.edit', 'kitchen.view'), updateOrderStatus);
router.delete('/order/delete/:id', isAuthenticatedUser, authorizePermission('orders.edit'), deleteOrder);

module.exports = router;
