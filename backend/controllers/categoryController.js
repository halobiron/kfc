const Category = require('../models/categorySchema');
const Product = require('../models/productSchema');

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

exports.createCategory = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
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
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const productCount = await Product.countDocuments({ category: cat.slug });
            return {
                ...cat._doc,
                productCount
            };
        }));
        res.json({
            status: true,
            data: categoriesWithCount
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }
        const productCount = await Product.countDocuments({ category: category.slug });
        res.json({
            status: true,
            data: {
                ...category._doc,
                productCount
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const oldCategory = await Category.findById(req.params.id);
        if (!oldCategory) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }

        // If slug is missing and name is provided, generate slug
        if (!req.body.slug && req.body.name) {
            req.body.slug = slugify(req.body.name);
        }

        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // If slug changed, update all products belonging to this category
        if (req.body.slug && oldCategory.slug !== category.slug) {
            await Product.updateMany(
                { category: oldCategory.slug },
                { $set: { category: category.slug } }
            );
        }

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
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Category not found'
            });
        }

        // Check if there are any products in this category
        const productCount = await Product.countDocuments({ category: category.slug });
        if (productCount > 0) {
            return res.status(400).json({
                status: false,
                message: `Không thể xóa danh mục này vì đang có ${productCount} món ăn thuộc danh mục. Vui lòng chuyển các món ăn sang danh mục khác trước.`
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

