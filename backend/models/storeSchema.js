const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên cửa hàng là bắt buộc'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Địa chỉ là bắt buộc']
    },
    city: {
        type: String,
        required: [true, 'Thành phố là bắt buộc']
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    },
    openTime: {
        type: String,
        default: '08:00 - 22:00'
    },
    closeTime: {
        type: String,
        default: '22:00'
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    services: [
        {
            type: String,
            enum: ['dine-in', 'takeaway', 'delivery', 'drive-through']
        }
    ],
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    staff: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
