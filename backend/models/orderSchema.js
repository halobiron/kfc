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

    const ingredientsToUpdate = [];

    // 1. Tính toán tổng nguyên liệu cần thiết
    for (const item of this.items) {
        const product = await Product.findById(item.productId);
        if (product && product.recipe && product.recipe.length > 0) {
            for (const recipeItem of product.recipe) {
                const ingredient = await Ingredient.findById(recipeItem.ingredientId);
                if (ingredient) {
                    const quantityNeeded = recipeItem.quantity * item.quantity;

                    // Gom nhóm nguyên liệu
                    const existing = ingredientsToUpdate.find(i => i.id.toString() === ingredient._id.toString());
                    if (existing) {
                        existing.needed += quantityNeeded;
                    } else {
                        ingredientsToUpdate.push({
                            id: ingredient._id,
                            needed: quantityNeeded,
                            name: ingredient.name,
                            unit: ingredient.unit,
                            doc: ingredient
                        });
                    }
                }
            }
        }
    }

    // 2. Kiểm tra tồn kho
    for (const update of ingredientsToUpdate) {
        if (update.doc.stock < update.needed) {
            throw new Error(`Không đủ nguyên liệu: ${update.name} (Cần: ${update.needed} ${update.unit}, Tồn: ${update.doc.stock})`);
        }
    }

    // 3. Trừ kho
    for (const update of ingredientsToUpdate) {
        update.doc.stock -= update.needed;
        await update.doc.save();
    }
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
