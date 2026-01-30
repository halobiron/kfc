const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: [true, 'Discount amount is required']
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
    expiryDate: {
        type: Date
    }
},
    {
        timestamps: true
    });

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
