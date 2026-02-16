const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        unique: true,
        // Remove required: true because it's generated in pre-save hook
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false // Now optional for guest checkout
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            _id: false
        }
    ],
    deliveryType: {
        type: String,
        enum: ['Giao hàng', 'Đến lấy'],
        required: true
    },
    deliveryInfo: {
        storeId: Schema.Types.ObjectId,
        fullName: String,
        phone: String,
        address: String,
        city: String,
        note: String,
        _id: false
    },
    paymentMethod: {
        type: String,
        enum: ['Tiền mặt', 'Thẻ', 'Chuyển khoản', 'Cổng thanh toán PayOS'],
        default: 'Tiền mặt'
    },
    paymentCode: {
        type: Number
    },
    couponCode: {
        type: String,
        default: null
    },
    couponDiscount: {
        type: Number,
        default: 0
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang chuẩn bị', 'Sẵn sàng', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'],
        default: 'Chờ xác nhận'
    },
    statusHistory: [
        {
            status: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            note: String,
            _id: false
        }
    ],
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto generate order number
orderSchema.pre('save', async function () {
    if (!this.isNew) return;

    try {
        const count = await this.constructor.countDocuments();
        const date = new Date();
        const dateStr = date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
        // Add random suffix to prevent "Duplicate orderNumber" errors from simultaneous saves
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `ORD${dateStr}${String(count + 1).padStart(5, '0')}${randomSuffix}`;
    } catch (error) {
        throw error;
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
