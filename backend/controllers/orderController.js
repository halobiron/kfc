const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');
const Coupon = require('../models/couponSchema');
const Ingredient = require('../models/ingredientSchema');
const payos = require('../utils/payosClient');
const { calculateShippingFee } = require('../utils/shipping');
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');
const { logAction } = require('../utils/logger');

// Helper: Validate and Calculate Coupon Discount
const validateAndCalculateCoupon = async (couponCode, subtotal, shippingFee) => {
    if (!couponCode) return { couponDiscount: 0, error: null };

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return { couponDiscount: 0, error: 'Mã khuyến mãi không tìm thấy' };

    if (!coupon.isActive) return { couponDiscount: 0, error: 'Mã khuyến mãi đã ngưng hoạt động' };

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) return { couponDiscount: 0, error: 'Mã khuyến mãi chưa đến đợt sử dụng' };
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) return { couponDiscount: 0, error: 'Mã khuyến mãi đã hết hạn' };
    if (coupon.usedCount >= coupon.maxUsage) return { couponDiscount: 0, error: 'Mã khuyến mãi đã hết lượt sử dụng' };
    if (subtotal < coupon.minOrder) return { couponDiscount: 0, error: `Mã khuyến mãi yêu cầu đơn hàng tối thiểu ${coupon.minOrder}` };

    let couponDiscount = 0;
    if (coupon.type === 'percent') {
        couponDiscount = Math.floor(subtotal * (coupon.discount / 100));
    } else if (coupon.type === 'shipping') {
        couponDiscount = shippingFee;
    } else {
        couponDiscount = coupon.discount;
    }

    return { couponDiscount, coupon, error: null };
};

// Helper: Handle PayOS Payment Creation
const handlePayOSPayment = async (order, totalAmount) => {
    const paymentCode = Number(String(Date.now()).slice(-10));

    order.paymentCode = paymentCode;
    await order.save();

    const parsedAmount = parseInt(totalAmount);
    const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success?orderId=${order._id}&status=success`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?status=cancelled`;

    const orderBody = {
        orderCode: paymentCode,
        amount: parsedAmount,
        description: `Order ${order.orderNumber}`,
        returnUrl: returnUrl,
        cancelUrl: cancelUrl
    };

    try {
        const paymentLinkResponse = await payos.paymentRequests.create(orderBody);
        return { success: true, checkoutUrl: paymentLinkResponse.checkoutUrl };
    } catch (payOsError) {
        console.error('PayOS create link error:', payOsError);
        await Order.findByIdAndDelete(order._id);
        return { success: false, error: payOsError.message };
    }
};

// CREATE ORDER
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    const { items, deliveryType, deliveryInfo, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
        return next(new ErrorHandler('Đơn hàng phải có ít nhất một sản phẩm', 400));
    }

    if (deliveryType === 'Giao hàng' && (!deliveryInfo || !deliveryInfo.address)) {
        return next(new ErrorHandler('Vui lòng cung cấp địa chỉ giao hàng', 400));
    }
    if (!deliveryInfo || !deliveryInfo.storeId) {
        return next(new ErrorHandler('Vui lòng chọn cửa hàng chế biến', 400));
    }

    let subtotal = 0;
    const orderItems = [];

    // 1. Get products and calculate subtotal
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map();
    products.forEach(p => productMap.set(p._id.toString(), p));

    for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
            return next(new ErrorHandler(`Sản phẩm ${item.productId} không tìm thấy`, 404));
        }
        subtotal += product.price * item.quantity;
        orderItems.push({
            productId: product._id,
            name: product.title,
            price: product.price,
            quantity: item.quantity
        });
    }

    const shippingFee = calculateShippingFee({ deliveryType, subtotal });

    const { couponDiscount, coupon, error: couponError } = await validateAndCalculateCoupon(couponCode, subtotal, shippingFee);
    if (couponError) {
        return next(new ErrorHandler(couponError, 400));
    }

    if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
    }

    const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);

    const order = await Order.create({
        userId: req.user.id,
        items: orderItems,
        deliveryType,
        deliveryInfo: {
            fullName: deliveryInfo?.name || '',
            phone: deliveryInfo?.phone || '',
            address: deliveryInfo?.address || null,
            storeId: deliveryInfo?.storeId || null,
            note: req.body.note || ''
        },
        paymentMethod,
        couponCode: couponCode || null,
        couponDiscount,
        subtotal,
        shippingFee,
        totalAmount,
        statusHistory: [{ status: 'Chờ xác nhận', timestamp: new Date(), note: 'Đơn hàng vừa được tạo' }]
    });

    if (paymentMethod === 'Cổng thanh toán PayOS') {
        const paymentResult = await handlePayOSPayment(order, totalAmount);
        if (!paymentResult.success) {
            return next(new ErrorHandler(`Lỗi khi tạo link thanh toán PayOS: ${paymentResult.error}`, 500));
        }
        return res.status(201).json({
            status: true,
            message: 'Tạo đơn hàng thành công',
            data: order,
            checkoutUrl: paymentResult.checkoutUrl
        });
    }

    res.status(201).json({ status: true, message: 'Tạo đơn hàng thành công', data: order });
});

// GET USER ORDERS
exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = resPerPage * (page - 1);

    const ordersCount = await Order.countDocuments({ userId: req.user.id });
    const orders = await Order.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resPerPage);

    res.status(200).json({
        status: true,
        ordersCount,
        resPerPage,
        page,
        data: orders
    });
});

// GET ORDER BY ID
exports.getOrderById = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

    // Require login and ownership/admin
    if (!req.user) {
        return next(new ErrorHandler('Vui lòng đăng nhập để xem đơn hàng này', 401));
    }

    const isOwner = order.userId.toString() === req.user.id;
    if (!isOwner && req.user.role.toUpperCase() !== 'ADMIN') {
        return next(new ErrorHandler('Bạn không có quyền xem đơn hàng này', 403));
    }

    res.status(200).json({
        status: true,
        data: order
    });
});

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

    if (status === 'Đang chuẩn bị' && order.status !== 'Đang chuẩn bị') {
        try {
            await order.deductIngredients();
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }

    order.status = status;
    order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || ''
    });

    if (status === 'Đã giao hàng') {
        order.isPaid = true;
        order.paidAt = new Date();
    }

    await order.save();

    await logAction(req.user.id, 'UPDATE', 'Order', `Cập nhật trạng thái đơn hàng ${order.orderNumber} thành: ${status}`);

    res.status(200).json({
        status: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: order
    });
});

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = resPerPage * (page - 1);

    const filter = {};

    // Optional filter by store via query parameter (for admin/manager to view specific store orders)
    if (req.query.storeId) {
        filter['deliveryInfo.storeId'] = req.query.storeId;
    }

    const ordersCount = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resPerPage);

    res.status(200).json({
        status: true,
        ordersCount,
        resPerPage,
        page,
        data: orders
    });
});

// DELETE ORDER (ADMIN)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

    await logAction(req.user.id, 'DELETE', 'Order', `Xóa đơn hàng ${order.orderNumber}`);

    res.status(200).json({
        status: true,
        message: 'Xóa đơn hàng thành công'
    });
});

// CANCEL ORDER (USER)
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

    if (!order.userId || order.userId.toString() !== req.user.id) {
        return next(new ErrorHandler('Bạn không có quyền hủy đơn hàng này', 403));
    }

    if (['Đang giao hàng', 'Đã giao hàng', 'Đã hủy'].includes(order.status)) {
        return next(new ErrorHandler(`Không thể hủy đơn hàng ở trạng thái ${order.status}`, 400));
    }

    order.status = 'Đã hủy';
    order.statusHistory.push({
        status: 'Đã hủy',
        timestamp: new Date(),
        note: reason ? `Khách hàng hủy đơn hàng - Lý do: ${reason}` : 'Khách hàng hủy đơn hàng'
    });

    await order.save();

    res.status(200).json({
        status: true,
        message: 'Hủy đơn hàng thành công',
        data: order
    });
});

// VERIFY PAYMENT (PAYOS)
exports.verifyPayment = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng', 404));
    }

    if (order.paymentMethod === 'Cổng thanh toán PayOS' && order.paymentCode) {
        const paymentLinkInfo = await payos.paymentRequests.get(order.paymentCode);

        if (paymentLinkInfo && paymentLinkInfo.status === 'PAID') {
            if (!order.isPaid) {
                order.isPaid = true;
                order.paidAt = new Date();
                if (order.status === 'Chờ xác nhận') {
                    order.status = 'Đã xác nhận';
                    order.statusHistory.push({
                        status: 'Đã xác nhận',
                        timestamp: new Date(),
                        note: 'Thanh toán thành công qua PayOS'
                    });
                }
                await order.save();
            }
        }
    }

    res.status(200).json({
        status: true,
        data: order
    });
});

// GET SHIPPING CONFIG
exports.getShippingConfig = (req, res) => {
    const { getShippingConfig } = require('../utils/shipping');
    const config = getShippingConfig();
    res.status(200).json({
        status: true,
        data: config
    });
};
