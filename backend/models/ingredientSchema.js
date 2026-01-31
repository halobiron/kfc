const mongoose = require('mongoose');

const { Schema } = mongoose;

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên nguyên liệu là bắt buộc'],
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: [true, 'Đơn vị tính là bắt buộc']
    },
    stock: {
        type: Number,
        required: [true, 'Số lượng tồn kho là bắt buộc'],
        min: 0
    },
    minStock: {
        type: Number,
        required: true,
        min: 0
    },
    maxStock: {
        type: Number
    },
    cost: {
        type: Number,
        required: true
    },
    supplier: {
        type: String
    },
    supplierContact: {
        type: String
    },
    expiryDate: Date,
    batchNumber: String,
    storageLocation: String,
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    lastRestockDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh
ingredientSchema.index({ name: 'text', category: 1 });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
