const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');
const Coupon = require('../models/couponSchema');

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
    const { items, deliveryType, deliveryInfo, paymentMethod, couponCode } = req.body;

    try {
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Đơn hàng phải có ít nhất một sản phẩm'
            });
        }

        let subtotal = 0;
        const orderItems = [];

        // Verify products and calculate subtotal
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    status: false,
                    message: `Sản phẩm ${item.productId} không tìm thấy`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    status: false,
                    message: `Sản phẩm ${product.title} không đủ số lượng`
                });
            }

            subtotal += product.price * item.quantity;
            orderItems.push({
                productId: product._id,
                name: product.title,
                price: product.price,
                quantity: item.quantity
            });

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Apply coupon if provided
        let couponDiscount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });
            if (!coupon) {
                return res.status(404).json({
                    status: false,
                    message: 'Mã khuyến mãi không tìm thấy'
                });
            }

            if (!coupon.isActive) {
                return res.status(400).json({
                    status: false,
                    message: 'Mã khuyến mãi đã hết hạn'
                });
            }

            if (coupon.usedCount >= coupon.maxUsage) {
                return res.status(400).json({
                    status: false,
                    message: 'Mã khuyến mãi đã hết lượt sử dụng'
                });
            }

            if (subtotal < coupon.minOrder) {
                return res.status(400).json({
                    status: false,
                    message: `Mã khuyến mãi yêu cầu đơn hàng tối thiểu ${coupon.minOrder}`
                });
            }

            // Calculate discount
            if (coupon.type === 'percent') {
                couponDiscount = Math.floor(subtotal * (coupon.discount / 100));
            } else {
                couponDiscount = coupon.discount;
            }

            // Update coupon usage
            coupon.usedCount += 1;
            await coupon.save();
        }

        // Calculate total
        const shippingFee = deliveryType === 'delivery' ? 30000 : 0;
        const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);

        // Create order
        const order = await Order.create({
            userId: req.user.id,
            items: orderItems,
            deliveryType,
            deliveryInfo: {
                ...deliveryInfo,
                storeId: deliveryInfo.storeId || null
            },
            paymentMethod,
            couponCode: couponCode || null,
            couponDiscount,
            subtotal,
            shippingFee,
            totalAmount,
            statusHistory: [
                {
                    status: 'pending',
                    timestamp: new Date(),
                    note: 'Đơn hàng vừa được tạo'
                }
            ]
        });

        await order.save();

        res.status(201).json({
            status: true,
            message: 'Tạo đơn hàng thành công',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// GET USER ORDERS
exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        
        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Đơn hàng không tìm thấy'
            });
        }

        // Check if user is owner or admin
        if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền xem đơn hàng này'
            });
        }

        res.status(200).json({
            status: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res, next) => {
    const { status, note } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Đơn hàng không tìm thấy'
            });
        }

        order.status = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || ''
        });

        if (status === 'delivered') {
            order.isPaid = true;
            order.paidAt = new Date();
        }

        if (status === 'cancelled') {
            // Restore product stock
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        await order.save();

        res.status(200).json({
            status: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// CANCEL ORDER (USER)
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Đơn hàng không tìm thấy'
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền hủy đơn hàng này'
            });
        }

        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                status: false,
                message: `Không thể hủy đơn hàng ở trạng thái ${order.status}`
            });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: 'Khách hàng hủy đơn hàng'
        });

        await order.save();

        res.status(200).json({
            status: true,
            message: 'Hủy đơn hàng thành công',
            data: order
        });
    } catch (error) {
        next(error);
    }
};
