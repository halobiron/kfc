const express = require('express');
const router = express.Router();
const { 
    getAllIngredients, 
    getIngredientById, 
    createIngredient, 
    updateIngredient, 
    deleteIngredient,
    updateStock,
    getLowStockIngredients
} = require('../controllers/ingredientController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Admin routes
router.get('/ingredients', isAuthenticatedUser, authorizeRoles('admin'), getAllIngredients);
router.get('/ingredient/:id', isAuthenticatedUser, authorizeRoles('admin'), getIngredientById);
router.get('/ingredients/low-stock', isAuthenticatedUser, authorizeRoles('admin'), getLowStockIngredients);
router.post('/ingredient/new', isAuthenticatedUser, authorizeRoles('admin'), createIngredient);
router.put('/ingredient/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateIngredient);
router.delete('/ingredient/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteIngredient);
router.post('/ingredient/stock/:id', isAuthenticatedUser, authorizeRoles('admin'), updateStock);

module.exports = router;
