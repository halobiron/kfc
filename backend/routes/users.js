const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    addAddress, 
    updateAddress, 
    deleteAddress,
    getAllUsers,
    getUserById,
    deleteUser
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User routes
router.get('/users/profile', isAuthenticatedUser, getUserProfile);
router.put('/users/profile/update', isAuthenticatedUser, updateUserProfile);
router.post('/users/change-password', isAuthenticatedUser, changePassword);
router.post('/users/address/add', isAuthenticatedUser, addAddress);
router.put('/users/address/update/:addressId', isAuthenticatedUser, updateAddress);
router.delete('/users/address/delete/:addressId', isAuthenticatedUser, deleteAddress);

// Admin routes
router.get('/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/users/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserById);
router.delete('/users/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
