const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    icon: {
        type: String,
        default: 'bi-tag'
    },
    description: {
        type: String
    }
},
    {
        timestamps: true
    });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
