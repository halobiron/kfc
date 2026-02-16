const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        minlength: [4, 'Tên phải có ít nhất 4 ký tự']
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm là bắt buộc']
    },

    category: {
        type: String,
        required: [true, 'Danh mục là bắt buộc']
    },
    productImage: {
        type: String
    },
    recipe: [{
        ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        name: String,
        quantity: Number,
        unit: String
    }]
},
    {
        timestamps: true
    });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;