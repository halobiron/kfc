const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');
const Coupon = require('../models/couponSchema');
const Ingredient = require('../models/ingredientSchema');
const payos = require('../utils/payosClient');
const { calculateShippingFee } = require('../utils/shipping');

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
exports.createOrder = async (req, res, next) => {
    const { items, deliveryType, deliveryInfo, paymentMethod, couponCode } = req.body;

    try {
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ status: false, message: 'Đơn hàng phải có ít nhất một sản phẩm' });
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
            if (!product) return res.status(404).json({ status: false, message: `Sản phẩm ${item.productId} không tìm thấy` });
            if (product.stock < item.quantity) return res.status(400).json({ status: false, message: `Sản phẩm ${product.title} không đủ số lượng` });

            subtotal += product.price * item.quantity;
            orderItems.push({
                productId: product._id,
                name: product.title,
                price: product.price,
                quantity: item.quantity
            });
            product.stock -= item.quantity;
        }

        // 2. Shipping Fee
        const shippingFee = calculateShippingFee({ deliveryType, subtotal });

        // 3. Coupon Logic (Extracted)
        const { couponDiscount, coupon, error: couponError } = await validateAndCalculateCoupon(couponCode, subtotal, shippingFee);
        if (couponError) return res.status(400).json({ status: false, message: couponError });

        if (coupon) {
            coupon.usedCount += 1;
            await coupon.save();
        }

        const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);

        // 4. Save Order
        // Save updated product stocks first (Optimistic)
        await Promise.all(products.map(p => p.save()));

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
                return res.status(500).json({
                    status: false,
                    message: 'Lỗi khi tạo link thanh toán PayOS. Vui lòng thử lại hoặc chọn phương thức khác.',
                    error: paymentResult.error
                });
            }
            return res.status(201).json({
                status: true,
                message: 'Tạo đơn hàng thành công',
                data: order,
                checkoutUrl: paymentResult.checkoutUrl
            });
        }

        res.status(201).json({ status: true, message: 'Tạo đơn hàng thành công', data: order });

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

        // 1. If it's a guest order (no userId), allow viewing (can add phone verification later for security)
        if (!order.userId) {
            return res.status(200).json({
                status: true,
                data: order
            });
        }

        // 2. If it's a registered order, require login and ownership/admin
        if (!req.user) {
            return res.status(401).json({
                status: false,
                message: 'Vui lòng đăng nhập để xem đơn hàng này'
            });
        }

        const isOwner = order.userId.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
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
                    return res.status(400).json({
                        status: false,
                        message: `Không đủ nguyên liệu: ${update.name} (Cần: ${update.needed} ${update.unit}, Tồn: ${update.doc.stock})`
                    });
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

        if (status === 'Đã hủy') {
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
    } catch (error) {
        next(error);
    }
};

// DELETE ORDER (ADMIN)
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Đơn hàng không tìm thấy'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Xóa đơn hàng thành công'
        });
    } catch (error) {
        next(error);
    }
};

// CANCEL ORDER (USER)
exports.cancelOrder = async (req, res, next) => {
    try {
        const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Đơn hàng không tìm thấy'
            });
        }

        if (!order.userId || order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền hủy đơn hàng này'
            });
        }

        if (['Đang giao hàng', 'Đã giao hàng', 'Đã hủy'].includes(order.status)) {
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
    } catch (error) {
        next(error);
    }
};

// VERIFY PAYMENT (PAYOS)
exports.verifyPayment = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Không tìm thấy đơn hàng'
            });
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
    } catch (error) {
        // PayOS might throw if orderCode not found or other API errors
        console.error("Payment verification failed:", error);
        res.status(200).json({ status: true, data: await Order.findById(req.params.id) });
    }
};

// LOOKUP GUEST ORDER
exports.lookupOrder = async (req, res, next) => {
    const { orderNumber, phone } = req.body;

    try {
        if (!orderNumber || !phone) {
            return res.status(400).json({
                status: false,
                message: 'Vui lòng nhập Mã đơn hàng và Số điện thoại'
            });
        }

        const order = await Order.findOne({
            orderNumber: orderNumber.toUpperCase(),
            'deliveryInfo.phone': phone
        }).populate('items.productId');

        if (!order) {
            return res.status(404).json({
                status: false,
                message: 'Không tìm thấy đơn hàng với thông tin trên'
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
