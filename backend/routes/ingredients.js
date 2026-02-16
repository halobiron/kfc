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
const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Admin/Staff routes
router.get('/ingredients', isAuthenticatedUser, authorizePermission('ingredients.view'), getAllIngredients);
router.get('/ingredient/:id', isAuthenticatedUser, authorizePermission('ingredients.view'), getIngredientById);
router.get('/ingredients/low-stock', isAuthenticatedUser, authorizePermission('ingredients.view'), getLowStockIngredients);
router.post('/ingredient/new', isAuthenticatedUser, authorizePermission('ingredients.edit'), createIngredient);
router.put('/ingredient/update/:id', isAuthenticatedUser, authorizePermission('ingredients.edit'), updateIngredient);
router.delete('/ingredient/delete/:id', isAuthenticatedUser, authorizePermission('ingredients.edit'), deleteIngredient);
router.post('/ingredient/stock/:id', isAuthenticatedUser, authorizePermission('ingredients.edit'), updateStock);

module.exports = router;
