const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');
const Coupon = require('../models/couponSchema');
const Ingredient = require('../models/ingredientSchema');
const payos = require('../utils/payosClient');
const { calculateShippingFee } = require('../utils/shipping');
const { catchAsyncErrors } = require('../middleware/errors');
const ErrorHandler = require('../utils/errorHandler');

// --- HELPER FUNCTIONS ---

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
    // Generate numeric order code for PayOS (using timestamp + random part if needed, max 53 bit)
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
        // Clean up checking order if payment link fails? 
        // Strategy: Delete order and return error
        await Order.findByIdAndDelete(order._id);
        return { success: false, error: payOsError.message };
    }
};

// CREATE ORDER (Refactored)
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    const { items, deliveryType, deliveryInfo, paymentMethod, couponCode } = req.body;

    // Validate items
    if (!items || items.length === 0) {
        return next(new ErrorHandler('Đơn hàng phải có ít nhất một sản phẩm', 400));
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

    // 2. Shipping Fee
    const shippingFee = calculateShippingFee({ deliveryType, subtotal });

    // 3. Coupon Logic (Extracted)
    const { couponDiscount, coupon, error: couponError } = await validateAndCalculateCoupon(couponCode, subtotal, shippingFee);
    if (couponError) {
        return next(new ErrorHandler(couponError, 400));
    }

    if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
    }

    const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);

    // 4. Save Order
    const order = await Order.create({
        userId: req.user?.id || null,
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

    // 5. Payment Handling
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
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
        status: true,
        data: orders
    });
});

// GET ORDER BY ID
exports.getOrderById = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

    // 1. If it's a guest order (no userId), allow viewing (can add phone verification later for security)
    if (!order.userId) {
        return res.status(200).json({
            status: true,
            data: order
        });
    }

    // 2. If it's a registered order, require login and ownership/admin
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

    // START: Logic trừ nguyên liệu khi bắt đầu nấu (status: preparing)
    if (status === 'Đang chuẩn bị' && order.status !== 'Đang chuẩn bị') {
        const ingredientsToUpdate = [];

        // 1. Tính toán tổng nguyên liệu cần thiết
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product && product.recipe && product.recipe.length > 0) {
                for (const recipeItem of product.recipe) {
                    const ingredient = await Ingredient.findById(recipeItem.ingredientId);
                    if (ingredient) {
                        const quantityNeeded = recipeItem.quantity * item.quantity;

                        // Gom nhóm nguyên liệu (xử lý trường hợp nhiều món dùng cùng nguyên liệu)
                        const existing = ingredientsToUpdate.find(i => i.id.toString() === ingredient._id.toString());
                        if (existing) {
                            existing.needed += quantityNeeded;
                        } else {
                            ingredientsToUpdate.push({
                                id: ingredient._id,
                                needed: quantityNeeded,
                                name: ingredient.name,
                                unit: ingredient.unit,
                                doc: ingredient
                            });
                        }
                    }
                }
            }
        }

        // 2. Kiểm tra tồn kho
        for (const update of ingredientsToUpdate) {
            if (update.doc.stock < update.needed) {
                return next(new ErrorHandler(`Không đủ nguyên liệu: ${update.name} (Cần: ${update.needed} ${update.unit}, Tồn: ${update.doc.stock})`, 400));
            }
        }

        // 3. Trừ kho
        for (const update of ingredientsToUpdate) {
            update.doc.stock -= update.needed;
            await update.doc.save();
        }
    }
    // END: Logic trừ nguyên liệu

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

    res.status(200).json({
        status: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        data: order
    });
});

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const filter = {};

    // Filter by store if user is restricted to a store
    if (req.user && req.user.storeId) {
        filter['deliveryInfo.storeId'] = req.user.storeId;
    }
    // Allow creating/switching filters if user is not restricted (e.g. Super Admin)
    else if (req.query.storeId) {
        filter['deliveryInfo.storeId'] = req.query.storeId;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
        status: true,
        data: orders
    });
});

// DELETE ORDER (ADMIN)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Đơn hàng không tìm thấy', 404));
    }

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

// LOOKUP GUEST ORDER
exports.lookupOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderNumber, phone } = req.body;

    if (!orderNumber || !phone) {
        return next(new ErrorHandler('Vui lòng nhập Mã đơn hàng và Số điện thoại', 400));
    }

    const order = await Order.findOne({
        orderNumber: orderNumber.toUpperCase(),
        'deliveryInfo.phone': phone
    }).populate('items.productId');

    if (!order) {
        return next(new ErrorHandler('Không tìm thấy đơn hàng với thông tin trên', 404));
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
