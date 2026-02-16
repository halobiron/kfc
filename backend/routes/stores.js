const express = require('express');
const router = express.Router();
const {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
} = require('../controllers/storeController');
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Public routes
router.get('/stores', getAllStores);
router.get('/store/:id', getStoreById);

// Admin/Staff routes
router.post('/store/new', isAuthenticatedUser, authorizePermission('stores.edit'), createStore);
router.put('/store/update/:id', isAuthenticatedUser, authorizePermission('stores.edit'), updateStore);
router.delete('/store/delete/:id', isAuthenticatedUser, authorizePermission('stores.edit'), deleteStore);

module.exports = router;
