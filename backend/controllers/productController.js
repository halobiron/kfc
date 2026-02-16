const Product = require('../models/productSchema');
const cloudinary = require('cloudinary').v2;
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const body = req.body;

    const productImage = body.productImage;

    const result = await cloudinary.uploader.upload(productImage, {
        'folder': 'kfc'
    })

    body.productImage = result.secure_url;

    await Product.create(body);
    const products = await Product.find({});
    res.json({
        status: true,
        data: products
    })
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({});
    res.json({
        status: true,
        data: products
    })
});

exports.getProductById = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.json({
        status: true,
        data: product
    })
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    const product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.json({
        status: true,
        message: "success"
    })
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.deleteOne();

    res.json({
        status: true,
        message: 'Product has been removed'
    })
});