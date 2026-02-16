const express = require('express');
const router = express.Router();
const {
    // getUserProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// User routes
// router.get('/users/profile', isAuthenticatedUser, getUserProfile); // Deprecated, use /auth/me

router.put('/users/profile/update', isAuthenticatedUser, updateUserProfile);
router.post('/users/change-password', isAuthenticatedUser, changePassword);
router.post('/users/address/add', isAuthenticatedUser, addAddress);
router.put('/users/address/update/:addressId', isAuthenticatedUser, updateAddress);
router.delete('/users/address/delete/:addressId', isAuthenticatedUser, deleteAddress);

// ADMIN/STAFF routes with permissions
router.get('/users', isAuthenticatedUser, authorizePermission('users.view'), getAllUsers);
router.get('/users/:id', isAuthenticatedUser, authorizePermission('users.view'), getUserById);
router.post('/users/new', isAuthenticatedUser, authorizePermission('users.edit'), createUser);
router.put('/users/update/:id', isAuthenticatedUser, authorizePermission('users.edit'), updateUser);
router.delete('/users/delete/:id', isAuthenticatedUser, authorizePermission('users.edit'), deleteUser);

module.exports = router;
