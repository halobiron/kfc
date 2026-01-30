import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

import './Checkout.css';
import { getAllCoupons, getCouponByCode } from '../../redux/slices/couponSlice';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { coupons } = useSelector((state) => state.coupons);
    const { items: cartItems } = useSelector((state) => state.cart);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        dispatch(getAllCoupons());
        fetchStores();
    }, [dispatch]);

    const fetchStores = async () => {
        try {
            const response = await axiosClient.get('/stores');
            setStores(response.data.data || []);
        } catch (error) {
            console.error('Lỗi khi tải cửa hàng:', error);
            toast.error('Không thể tải danh sách cửa hàng.');
        }
    };

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    const [deliveryType, setDeliveryType] = useState('delivery');
    const [selectedStore, setSelectedStore] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Promotion State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = deliveryType === 'pickup' ? 0 : (subtotal > 200000 ? 0 : 15000);

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;

        if (appliedCoupon.type === 'fixed') {
            return appliedCoupon.discount;
        } else if (appliedCoupon.type === 'percent') {
            return (subtotal * appliedCoupon.discount) / 100;
        } else if (appliedCoupon.type === 'shipping') {
            return deliveryFee; // Discount equals the shipping fee
        }
        return 0;
    };

    const discountAmount = calculateDiscount();
    const total = Math.max(0, subtotal + deliveryFee - discountAmount);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleApplyCoupon = () => {
        if (!couponCode) return;

        // Find coupon from Redux state
        const coupon = Array.isArray(coupons) 
            ? coupons.find(c => c.code === couponCode.toUpperCase())
            : null;

        if (!coupon) {
            setCouponError('Mã khuyến mãi không hợp lệ!');
            setAppliedCoupon(null);
            return;
        }

        if (subtotal < coupon.minOrder) {
            setCouponError(`Đơn tối thiểu để áp dụng là ${formatCurrency(coupon.minOrder)}`);
            setAppliedCoupon(null);
            return;
        }

        setAppliedCoupon(coupon);
        setCouponError('');
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        // Basic Validation
        if (!formData.fullName || !formData.phone) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (deliveryType === 'delivery' && !formData.address) {
            toast.error("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        if (deliveryType === 'pickup' && !selectedStore) {
            toast.error("Vui lòng chọn cửa hàng để lấy món!");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cartItems,
                customer: {
                    name: formData.fullName,
                    phone: formData.phone,
                    address: deliveryType === 'delivery' ? formData.address : null,
                    storeId: deliveryType === 'pickup' ? selectedStore : null
                },
                deliveryType,
                paymentMethod,
                couponCode: appliedCoupon?.code || null,
                note: formData.note,
                total
            };

            const response = await axiosClient.post('/order/new', orderData);
            
            toast.success(
                <div>
                    <strong>Đặt hàng thành công!</strong><br />
                    Mã đơn: {response.data.data._id}<br />
                    Tổng: {formatCurrency(total)}
                </div>,
                { autoClose: 5000 }
            );

            // Redirect to Success Page
            navigate('/order-success');
        } catch (error) {
            toast.error('Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-wrapper">
            <div className="container checkout-container py-5">
                <div className="checkout-header">
                    <h2 className="checkout-title">Thanh Toán</h2>
                    <div className="cart-title-underline" style={{ width: '50px' }}></div>
                </div>

                <div className="checkout-layout">
                    {/* Left Column: Information & Payment */}
                    <div className="checkout-form-section">
                        {/* Delivery Type Selection */}
                        <div className="form-card">
                            <h3 className="form-title">
                                <i className="bi bi-bicycle"></i>
                                Hình Thức Nhận Hàng
                            </h3>
                            <div className="delivery-type-options" style={{ display: 'flex', gap: '15px' }}>
                                <div
                                    className={`delivery-type-option ${deliveryType === 'delivery' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryType('delivery')}
                                    style={{
                                        flex: 1,
                                        padding: '20px 15px',
                                        border: `2px solid ${deliveryType === 'delivery' ? '#e4002b' : '#ddd'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        backgroundColor: deliveryType === 'delivery' ? '#fff5f5' : '#fff',
                                        position: 'relative'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        checked={deliveryType === 'delivery'}
                                        onChange={() => setDeliveryType('delivery')}
                                        style={{ position: 'absolute', top: '10px', left: '10px' }}
                                    />
                                    <i className="bi bi-house-door-fill" style={{ fontSize: '2rem', color: '#e4002b', display: 'block', marginBottom: '10px' }}></i>
                                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '5px' }}>Giao hàng tận nơi</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Nhận hàng tại địa chỉ của bạn</div>
                                </div>

                                <div
                                    className={`delivery-type-option ${deliveryType === 'pickup' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryType('pickup')}
                                    style={{
                                        flex: 1,
                                        padding: '20px 15px',
                                        border: `2px solid ${deliveryType === 'pickup' ? '#e4002b' : '#ddd'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.3s',
                                        backgroundColor: deliveryType === 'pickup' ? '#fff5f5' : '#fff',
                                        position: 'relative'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        checked={deliveryType === 'pickup'}
                                        onChange={() => setDeliveryType('pickup')}
                                        style={{ position: 'absolute', top: '10px', left: '10px' }}
                                    />
                                    <i className="bi bi-shop" style={{ fontSize: '2rem', color: '#e4002b', display: 'block', marginBottom: '10px' }}></i>
                                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '5px' }}>Đặt Hẹn Đến Lấy</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Tự đến cửa hàng lấy món</div>
                                    <div style={{ fontSize: '0.85rem', color: '#28a745', fontWeight: 'bold' }}>Miễn phí ship</div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery/Pickup Info */}
                        <div className="form-card">
                            <h3 className="form-title">
                                <i className="bi bi-geo-alt-fill"></i>
                                {deliveryType === 'delivery' ? 'Thông Tin Giao Hàng' : 'Thông Tin Nhận Hàng'}
                            </h3>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Họ và tên *</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        name="fullName"
                                        placeholder="Nhập họ tên"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        className="form-control-custom"
                                        name="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {deliveryType === 'delivery' ? (
                                    <>
                                        <div className="col-12 form-group">
                                            <label className="form-label">Địa chỉ nhận hàng *</label>
                                            <input
                                                type="text"
                                                className="form-control-custom"
                                                name="address"
                                                placeholder="Số nhà, tên đường, phường/xã..."
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 form-group">
                                            <label className="form-label">Ghi chú cho tài xế</label>
                                            <textarea
                                                className="form-control-custom"
                                                name="note"
                                                rows="2"
                                                placeholder="Ví dụ: Lấy nhiều tương ớt, không lấy đá, giao lên tận phòng..."
                                                value={formData.note}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-12 form-group">
                                            <label className="form-label">Chọn cửa hàng KFC *</label>
                                            <select
                                                className="form-control-custom"
                                                value={selectedStore}
                                                onChange={(e) => setSelectedStore(e.target.value)}
                                                required
                                                style={{ padding: '12px' }}
                                            >
                                                <option value="">-- Chọn cửa hàng gần bạn --</option>
                                                {stores.map(store => (
                                                    <option key={store.id} value={store.id}>
                                                        {store.name} - {store.address}
                                                    </option>
                                                ))}
                                            </select>
                                            <small className="text-muted" style={{ display: 'block', marginTop: '8px' }}>
                                                <i className="bi bi-info-circle"></i> Vui lòng đến cửa hàng trong vòng 30 phút sau khi đặt
                                            </small>
                                        </div>
                                        <div className="col-12 form-group">
                                            <label className="form-label">Ghi chú cho cửa hàng</label>
                                            <textarea
                                                className="form-control-custom"
                                                name="note"
                                                rows="2"
                                                placeholder="Ví dụ: Tôi sẽ đến lấy lúc 18h..."
                                                value={formData.note}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="form-card">
                            <h3 className="form-title">
                                <i className="bi bi-credit-card-2-front-fill"></i>
                                Phương Thức Thanh Toán
                            </h3>
                            <div className="payment-methods">
                                <div
                                    className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <input
                                        type="radio"
                                        name="paymentParams"
                                        className="payment-radio"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div className="payment-icon"><i className="bi bi-cash-coin"></i></div>
                                    <span className="payment-label">Thanh toán khi nhận hàng (COD)</span>
                                </div>

                                <div
                                    className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('online')}
                                >
                                    <input
                                        type="radio"
                                        name="paymentParams"
                                        className="payment-radio"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                    />
                                    <div className="payment-icon"><i className="bi bi-bank"></i></div>
                                    <span className="payment-label">Thanh toán qua Thẻ / Ví điện tử</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-summary-section">
                        <div className="checkout-summary-card">
                            <h3 className="form-title" style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                                Tóm Tắt Đơn Hàng
                            </h3>

                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-name-qty">
                                            <span className="item-qty">{item.quantity}x</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider" style={{ margin: '15px 0', borderTop: '1px solid #eee' }}></div>

                            {/* Promotion Section */}
                            <div className="promotion-section mb-3">
                                <label className="form-label d-flex justify-content-between align-items-center">
                                    <span className="fw-bold"><i className="bi bi-ticket-perforated-fill me-1 text-danger"></i>Mã khuyến mãi</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập mã voucher"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    />
                                    <button
                                        className="btn btn-dark"
                                        type="button"
                                        onClick={handleApplyCoupon}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                                {couponError && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{couponError}</div>}
                                {appliedCoupon && (
                                    <div className="alert alert-success mt-2 d-flex justify-content-between align-items-center p-2 mb-0">
                                        <small><i className="bi bi-check-circle-fill me-1"></i> Đã áp dụng: <strong>{appliedCoupon.code}</strong></small>
                                        <button className="btn-close btn-close-white p-2 small" onClick={removeCoupon} aria-label="Remove"></button>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính</span>
                                <span className="fw-bold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Phí giao hàng</span>
                                <div className="text-end">
                                    {deliveryType === 'pickup' ? (
                                        <span className="text-success fw-bold">Miễn phí <i className="bi bi-check-circle-fill"></i></span>
                                    ) : (
                                        <>
                                            {deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}
                                            {appliedCoupon?.type === 'shipping' && <div className="text-success small fst-italic">(Đã giảm phí ship)</div>}
                                        </>
                                    )}
                                </div>
                            </div>
                            {discountAmount > 0 && (
                                <div className="d-flex justify-content-between mb-2 text-danger">
                                    <span><i className="bi bi-tag-fill me-1"></i>Giảm tiền</span>
                                    <span className="fw-bold">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            <div className="summary-divider" style={{ margin: '15px 0', borderTop: '2px solid #eee' }}></div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold fs-5">TỔNG CỘNG</span>
                                <span className="fw-bold fs-4 text-danger">{formatCurrency(total)}</span>
                            </div>

                            <button
                                className="place-order-btn"
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
