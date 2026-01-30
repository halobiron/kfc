const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.route('/category/new').post(createCategory);
router.route('/categories').get(getAllCategories);
router.route('/category/:id').get(getCategoryById);
router.route('/category/update/:id').put(updateCategory);
router.route('/category/delete/:id').delete(deleteCategory);

module.exports = router;
