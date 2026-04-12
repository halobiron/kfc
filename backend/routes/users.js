const express = require('express');
const router = express.Router();
const {

    updateUserProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getVipUsers,
    toggleUserVip
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// User routes

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

// VIP routes
router.get('/users/vip/list', isAuthenticatedUser, authorizePermission('users.view'), getVipUsers);
router.patch('/users/:id/vip/toggle', isAuthenticatedUser, authorizePermission('users.edit'), toggleUserVip);

module.exports = router;
