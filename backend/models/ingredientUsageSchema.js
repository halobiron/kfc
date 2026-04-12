const mongoose = require('mongoose');

const { Schema } = mongoose;

const ingredientUsageSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderNumber: String,
    ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    ingredientName: String,
    category: String,
    quantity: { type: Number, required: true },
    unit: String,
    deductedAt: { type: Date, default: Date.now, index: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' }
}, { timestamps: true });

// Compound indexes for efficient queries
ingredientUsageSchema.index({ ingredientId: 1, deductedAt: -1 });
ingredientUsageSchema.index({ category: 1, deductedAt: -1 });
ingredientUsageSchema.index({ deductedAt: -1 });

module.exports = mongoose.model('IngredientUsage', ingredientUsageSchema);