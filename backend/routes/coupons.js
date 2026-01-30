const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon } = require('../controllers/couponController');

router.route('/coupon/new').post(createCoupon);
router.route('/coupons').get(getAllCoupons);
router.route('/coupon/code/:code').get(getCouponByCode);
router.route('/coupon/update/:id').put(updateCoupon);
router.route('/coupon/delete/:id').delete(deleteCoupon);

module.exports = router;
