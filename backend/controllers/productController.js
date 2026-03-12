const Product = require('../models/productSchema');
const cloudinary = require('cloudinary').v2;
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');
const { logAction } = require('../utils/logger');

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const body = req.body;
    let productImage = body.productImage;

    if (productImage && productImage.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(productImage, {
            folder: 'kfc'
        });
        body.productImage = result.secure_url;
    }

    await Product.create(body);
    const products = await Product.find({});

    if (req.user) {
        await logAction(req.user.id, 'CREATE', 'Product', `Thêm món mới: ${body.title || body.name}`);
    }

    res.json({
        status: true,
        data: products
    })
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const skip = resPerPage * (page - 1);

    const productsCount = await Product.countDocuments();
    const products = await Product.find({})
        .populate('recipe.ingredientId')
        .skip(skip)
        .limit(resPerPage);

    res.json({
        status: true,
        productsCount,
        resPerPage,
        page,
        data: products
    })
});

exports.getProductById = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate('recipe.ingredientId');

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

    let productImage = body.productImage;

    if (productImage && productImage.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(productImage, {
            folder: 'kfc'
        });
        body.productImage = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    if (req.user) {
        await logAction(req.user.id, 'UPDATE', 'Product', `Cập nhật thông tin/giá món: ${product.title || product.name}`);
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

    const title = product.title || product.name || 'Món ăn';
    await product.deleteOne();

    if (req.user) {
        await logAction(req.user.id, 'DELETE', 'Product', `Xóa món: ${title}`);
    }

    res.json({
        status: true,
        message: 'Product has been removed'
    })
});