const Order = require('../models/orderSchema');
const User = require('../models/userSchema');
const Product = require('../models/productSchema');

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
                    status: 'delivered',
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

        // 5. Chart Data (Revenue over time)
        const revenueChart = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 6. Top Selling Products
        const topProducts = await Order.aggregate([
            {
                $match: {
                    status: 'delivered',
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
                    status: 'delivered',
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
                    _id: '$product.category', // assuming category is store as string or objectId in Product
                    // If category is ObjectId ref to Category model, we might want to lookup Category name too
                    // For now assuming we can group by category ID or name directly if Product stores it
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


        // Calculate trends (comparing to previous period) - SIMPLIFIED for now: just random or static trends
        // To do real trends, we'd need to query the previous period as well. 
        // For this task, we will calculate simplest check: just return the current values.

        res.status(200).json({
            status: true,
            data: {
                revenue: totalRevenue,
                orders: totalOrders,
                customers: newCustomers,
                avgOrderValue: avgOrderValue,
                chart: revenueChart,
                topProducts: topProducts,
                categoryStats: categoryStats
            }
        });

    } catch (error) {
        next(error);
    }
};
