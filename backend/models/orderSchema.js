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

orderSchema.methods.deductIngredients = async function () {
    const Product = require('./productSchema');
    const Ingredient = require('./ingredientSchema');

    // 1. Lấy tất cả Product ID từ đơn hàng
    const productIds = this.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Map để truy xuất nhanh thông tin sản phẩm
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // 2. Tính toán tổng nguyên liệu cần thiết
    const neededMap = new Map();

    for (const item of this.items) {
        const product = productMap.get(item.productId.toString());
        if (product && product.recipe) {
            for (const recipeItem of product.recipe) {
                const id = recipeItem.ingredientId.toString();
                const qty = recipeItem.quantity * item.quantity;
                
                if (neededMap.has(id)) {
                    neededMap.get(id).needed += qty;
                } else {
                    neededMap.set(id, { 
                        needed: qty, 
                        name: recipeItem.name, 
                        unit: recipeItem.unit 
                    });
                }
            }
        }
    }

    if (neededMap.size === 0) return;

    // 3. Lấy thông tin tồn kho hiện tại của tất cả nguyên liệu cần thiết
    const ingredientIds = Array.from(neededMap.keys());
    const currentIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });
    const stockMap = new Map(currentIngredients.map(i => [i._id.toString(), i]));

    // 4. Kiểm tra tồn kho trước khi trừ
    const bulkOps = [];
    for (const [id, info] of neededMap) {
        const ingredient = stockMap.get(id);
        if (!ingredient) {
            throw new Error(`Nguyên liệu không tồn tại: ${info.name}`);
        }
        if (ingredient.stock < info.needed) {
            throw new Error(`Không đủ nguyên liệu: ${info.name} (Cần: ${info.needed} ${info.unit}, Tồn: ${ingredient.stock})`);
        }

        bulkOps.push({
            updateOne: {
                filter: { _id: id },
                update: { $inc: { stock: -info.needed } }
            }
        });
    }

    // 5. Thực thi trừ kho hàng loạt (Atomic-like operation)
    if (bulkOps.length > 0) {
        await Ingredient.bulkWrite(bulkOps);
    }
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
