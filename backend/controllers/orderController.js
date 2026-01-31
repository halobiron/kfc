const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');
const Coupon = require('../models/couponSchema');
const payos = require('../utils/payosClient');

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
            statusHistory: [
                {
                    status: 'pending',
                    timestamp: new Date(),
                    note: 'Đơn hàng vừa được tạo'
                }
            ]
        });

        if (paymentMethod === 'payos') {
            // Generate numeric order code for PayOS (using timestamp + random part if needed, max 53 bit)
            // PayOS orderCode must be integer
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
                return res.status(201).json({
                    status: true,
                    message: 'Tạo đơn hàng thành công',
                    data: order,
                    checkoutUrl: paymentLinkResponse.checkoutUrl
                });
            } catch (payOsError) {
                console.error('PayOS create link error:', payOsError);
                // If PayOS link generation fails, we should delete the order 
                // and inform the user so they can try again or choose another method.
                await Order.findByIdAndDelete(order._id);
                
                return res.status(500).json({
                    status: false,
                    message: 'Lỗi khi tạo link thanh toán PayOS. Vui lòng thử lại hoặc chọn phương thức khác.',
                    error: payOsError.message
                });
            }
        }

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

        if (order.paymentMethod === 'payos' && order.paymentCode) {
            const paymentLinkInfo = await payos.paymentRequests.get(order.paymentCode);
            
            if (paymentLinkInfo && paymentLinkInfo.status === 'PAID') {
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    if (order.status === 'pending') {
                        order.status = 'confirmed';
                        order.statusHistory.push({
                            status: 'confirmed',
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
