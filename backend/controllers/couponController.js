const Coupon = require('../models/couponSchema');

exports.createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.json({
            status: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.json({
            status: true,
            data: coupons
        });
    } catch (error) {
        next(error);
    }
};

exports.getCouponByCode = async (req, res, next) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code });
        if (!coupon) {
            return res.status(404).json({
                status: false,
                message: 'Coupon not found'
            });
        }
        res.json({
            status: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({
            status: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCoupon = async (req, res, next) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
