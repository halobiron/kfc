const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon } = require('../controllers/couponController');

const { isAuthenticatedUser, authorizePermission } = require('../middleware/auth');

// Public
router.route('/coupon/code/:code').get(getCouponByCode);

router.route('/coupons').get(isAuthenticatedUser, authorizePermission('coupons.view'), getAllCoupons);
router.route('/coupon/new').post(isAuthenticatedUser, authorizePermission('coupons.edit'), createCoupon);
router.route('/coupon/update/:id').put(isAuthenticatedUser, authorizePermission('coupons.edit'), updateCoupon);
router.route('/coupon/delete/:id').delete(isAuthenticatedUser, authorizePermission('coupons.edit'), deleteCoupon);

module.exports = router;
