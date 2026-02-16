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
    phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc']
    },
    openTime: {
        type: String,
        default: '08:00 - 22:00'
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
            enum: ['Tại chỗ', 'Mang đi', 'Giao hàng', 'Drive-thru', 'Wifi', 'Khu vui chơi trẻ em']
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
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
