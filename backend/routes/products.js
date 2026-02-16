const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController')

const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

router.route('/product/new').post(isAuthenticatedUser, authorizePermission('products.edit'), createProduct);
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getProductById);
router.route('/product/update/:id').put(isAuthenticatedUser, authorizePermission('products.edit'), updateProduct);
router.route('/product/delete/:id').delete(isAuthenticatedUser, authorizePermission('products.edit'), deleteProduct);

module.exports = router





