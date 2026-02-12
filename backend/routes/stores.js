const express = require('express');
const router = express.Router();
const { 
    getAllStores, 
    getStoreById, 
    createStore, 
    updateStore, 
    deleteStore
} = require('../controllers/storeController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/stores', getAllStores);
router.get('/store/:id', getStoreById);

// Admin routes
router.post('/store/new', isAuthenticatedUser, authorizeRoles('admin'), createStore);
router.put('/store/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateStore);
router.delete('/store/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteStore);

module.exports = router;
