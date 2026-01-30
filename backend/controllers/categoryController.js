const Category = require('../models/categorySchema');

exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.json({
            status: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.json({
            status: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            status: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({
            status: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
