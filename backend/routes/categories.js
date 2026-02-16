const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

router.route('/category/new').post(isAuthenticatedUser, authorizePermission('categories.edit'), createCategory);
router.route('/categories').get(getAllCategories);
router.route('/category/:id').get(getCategoryById);
router.route('/category/update/:id').put(isAuthenticatedUser, authorizePermission('categories.edit'), updateCategory);
router.route('/category/delete/:id').delete(isAuthenticatedUser, authorizePermission('categories.edit'), deleteCategory);

module.exports = router;
