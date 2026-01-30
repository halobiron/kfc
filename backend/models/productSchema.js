const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [4, 'At least 4 characters required']
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'price is requird']
    },
    stock: {
        type: Number,
        required: [true, 'stock is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    productImage: {
        type: String
    }
},
    {
        timestamps: true
    });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;