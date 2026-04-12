const mongoose = require('mongoose');
const Order = require('../models/orderSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Ingredient = require('../models/ingredientSchema');
const IngredientUsage = require('../models/ingredientUsageSchema');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const { range } = req.query;
        let startDate = new Date();
        let groupFormat = '';

        // Calculate start date based on range
        if (range === 'week') {
            startDate.setDate(startDate.getDate() - 7);
            groupFormat = '%Y-%m-%d';
        } else if (range === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = '%Y-%m';
        } else {
            // Default to month
            startDate.setMonth(startDate.getMonth() - 1);
            groupFormat = '%Y-%m-%d';
        }

        // 1. Total Revenue (only delivered orders count as revenue)
        const revenueAggregation = await Order.aggregate([
            {
                $match: {
                    status: 'Đã giao hàng',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // 2. Total Orders (all orders except cancelled? Or all orders created?)
        // Usually stats show total orders created in the period
        const totalOrders = await Order.countDocuments({
            createdAt: { $gte: startDate }
        });

        const Role = require('../models/roleSchema');

        // 3. New Customers
        // Find 'user' role first
        const userRole = await Role.findOne({ code: 'CUSTOMER' });
        let newCustomers = 0;

        if (userRole) {
            newCustomers = await User.countDocuments({
                role: userRole._id,
                createdAt: { $gte: startDate }
            });
        }

        // 4. Average Order Value
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        // 5. Chart Data (Revenue over time by payment method)
        const revenueChart = await Order.aggregate([
            {
                $match: {
                    status: 'Đã giao hàng',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        paymentMethod: '$paymentMethod'
                    },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.date': 1 } }
        ]);

        // 6. Top Selling Products
        const topProducts = await Order.aggregate([
            {
                $match: {
                    status: 'Đã giao hàng',
                    createdAt: { $gte: startDate }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    name: { $first: '$items.name' },
                    sold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { sold: -1 } },
            { $limit: 5 }
        ]);

        // 7. Category Statistics
        const categoryStats = await Order.aggregate([
            {
                $match: {
                    status: 'Đã giao hàng',
                    createdAt: { $gte: startDate }
                }
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    count: { $sum: '$items.quantity' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDoc'
                }
            },
            { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: { $ifNull: ['$categoryDoc.title', 'Khác'] },
                    revenue: 1,
                    count: 1
                }
            }
        ]);

        // 8. Pending Orders (awaiting confirmation)
        const pendingOrders = await Order.countDocuments({
            status: 'Chờ xác nhận'
        });

        // 9. Low Stock Ingredients
        const lowStockIngredients = await Ingredient.countDocuments({
            $expr: { $lte: ['$stock', '$minStock'] },
            isActive: true
        });

        // 10. Payment Methods Statistics
        const paymentMethods = await Order.aggregate([
            {
                $match: {
                    status: 'Đã giao hàng',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    amount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    method: '$_id',
                    amount: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Calculate trends (comparing to previous period)s

        res.status(200).json({
            status: true,
            data: {
                revenue: totalRevenue,
                orders: totalOrders,
                customers: newCustomers,
                avgOrderValue: avgOrderValue,
                chart: revenueChart,
                topProducts: topProducts,
                categoryStats: categoryStats,
                pendingOrders: pendingOrders,
                lowStockIngredients: lowStockIngredients,
                paymentMethods: paymentMethods
            }
        });

    } catch (error) {
        next(error);
    }
};

// Helper: Get date range based on range parameter
const getDateRange = (range) => {
    const startDate = new Date();
    let groupFormat;

    if (range === 'week') {
        startDate.setDate(startDate.getDate() - 7);
        groupFormat = '%Y-%m-%d';
    } else if (range === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupFormat = '%Y-%m';
    } else {
        startDate.setMonth(startDate.getMonth() - 1);
        groupFormat = '%Y-%m-%d';
    }

    return { startDate, groupFormat };
};

exports.getIngredientUsageStats = async (req, res, next) => {
    try {
        const { range = 'month', ingredientId, unit } = req.query;
        const { startDate, groupFormat } = getDateRange(range);

        const matchCondition = { deductedAt: { $gte: startDate } };
        if (ingredientId) matchCondition.ingredientId = new mongoose.Types.ObjectId(ingredientId);
        if (unit) matchCondition.unit = unit;

        // Parallel queries for better performance
        const [usageOverTime, topIngredients, unitUsage, totalUsage, uniqueUnits, selectedIngredient] = await Promise.all([
            IngredientUsage.aggregate([
                { $match: matchCondition },
                { $group: { _id: { $dateToString: { format: groupFormat, date: '$deductedAt' } }, totalQuantity: { $sum: '$quantity' } } },
                { $sort: { _id: 1 } }
            ]),
            IngredientUsage.aggregate([
                { $match: matchCondition },
                { $group: { _id: '$ingredientId', name: { $first: '$ingredientName' }, unit: { $first: '$unit' }, totalQuantity: { $sum: '$quantity' }, usageCount: { $sum: 1 } } },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 }
            ]),
            IngredientUsage.aggregate([
                { $match: { deductedAt: { $gte: startDate } } },
                { $group: { _id: '$unit', totalQuantity: { $sum: '$quantity' }, usageCount: { $sum: 1 } } },
                { $sort: { totalQuantity: -1 } }
            ]),
            IngredientUsage.aggregate([
                { $match: matchCondition },
                { $group: { _id: null, totalQuantity: { $sum: '$quantity' }, totalDeductions: { $sum: 1 } } }
            ]),
            IngredientUsage.distinct('unit', { deductedAt: { $gte: startDate } }),
            ingredientId ? Ingredient.findById(ingredientId).select('name unit category') : null
        ]);

        res.status(200).json({
            status: true,
            data: {
                chart: usageOverTime,
                topIngredients,
                unitUsage,
                totalQuantity: totalUsage[0]?.totalQuantity || 0,
                totalDeductions: totalUsage[0]?.totalDeductions || 0,
                selectedIngredient,
                availableUnits: uniqueUnits
            }
        });

    } catch (error) {
        next(error);
    }
};
