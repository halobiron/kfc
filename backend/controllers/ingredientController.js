const Ingredient = require('../models/ingredientSchema');

// GET ALL INGREDIENTS (ADMIN)
exports.getAllIngredients = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            status: true,
            data: ingredients
        });
    } catch (error) {
        next(error);
    }
};

// GET INGREDIENT BY ID
exports.getIngredientById = async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        
        if (!ingredient) {
            return res.status(404).json({
                status: false,
                message: 'Nguyên liệu không tìm thấy'
            });
        }

        res.status(200).json({
            status: true,
            data: ingredient
        });
    } catch (error) {
        next(error);
    }
};

// CREATE INGREDIENT
exports.createIngredient = async (req, res, next) => {
    try {
        const { name, category, unit, stock, minStock, cost, supplier } = req.body;

        if (!name || !category || !unit || !stock || !cost) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        const ingredient = await Ingredient.create({
            name,
            category,
            unit,
            stock,
            minStock: minStock || 10,
            cost,
            supplier
        });

        res.status(201).json({
            status: true,
            message: 'Tạo nguyên liệu thành công',
            data: ingredient
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE INGREDIENT
exports.updateIngredient = async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!ingredient) {
            return res.status(404).json({
                status: false,
                message: 'Nguyên liệu không tìm thấy'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Cập nhật nguyên liệu thành công',
            data: ingredient
        });
    } catch (error) {
        next(error);
    }
};

// DELETE INGREDIENT
exports.deleteIngredient = async (req, res, next) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({
                status: false,
                message: 'Nguyên liệu không tìm thấy'
            });
        }

        ingredient.isActive = false;
        await ingredient.save();

        res.status(200).json({
            status: true,
            message: 'Xóa nguyên liệu thành công'
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE STOCK
exports.updateStock = async (req, res, next) => {
    try {
        const { quantity, type } = req.body; // type: 'add' hoặc 'reduce'

        if (!quantity || !type) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng cung cấp số lượng và loại thay đổi'
            });
        }

        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({
                status: false,
                message: 'Nguyên liệu không tìm thấy'
            });
        }

        if (type === 'add') {
            ingredient.stock += quantity;
        } else if (type === 'reduce') {
            if (ingredient.stock < quantity) {
                return res.status(400).json({
                    status: false,
                    message: 'Số lượng tồn kho không đủ'
                });
            }
            ingredient.stock -= quantity;
        } else {
            return res.status(400).json({
                status: false,
                message: 'Loại thay đổi không hợp lệ (add hoặc reduce)'
            });
        }

        ingredient.lastRestockDate = new Date();
        ingredient.updatedAt = new Date();
        await ingredient.save();

        res.status(200).json({
            status: true,
            message: `Cập nhật kho ${type === 'add' ? 'thêm' : 'giảm'} thành công`,
            data: ingredient
        });
    } catch (error) {
        next(error);
    }
};

// GET LOW STOCK INGREDIENTS
exports.getLowStockIngredients = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find({
            $expr: { $lte: ['$stock', '$minStock'] },
            isActive: true
        });

        res.status(200).json({
            status: true,
            data: ingredients
        });
    } catch (error) {
        next(error);
    }
};
