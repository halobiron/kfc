const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema({
    code: {
        type: String,
        required: [true, 'Mã giảm giá là bắt buộc'],
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Tiêu đề là bắt buộc']
    },
    description: {
        type: String,
        required: [true, 'Mô tả là bắt buộc']
    },
    discount: {
        type: Number,
        required: [true, 'Giá trị giảm giá là bắt buộc']
    },
    type: {
        type: String,
        enum: ['fixed', 'percent', 'shipping'],
        default: 'fixed'
    },
    minOrder: {
        type: Number,
        default: 0
    },
    maxUsage: {
        type: Number,
        default: 999
    },
    usedCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    }
},
    {
        timestamps: true
    });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
