import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();

    // Mock Cart Data (Should match Cart page mock)
    const cartItems = [
        { id: 1, name: "Combo Gà Rán 1 Người", price: 89000, quantity: 1 },
        { id: 2, name: "Burger Zinger", price: 69000, quantity: 2 },
        { id: 3, name: "Gà Popcorn (Vừa)", price: 38000, quantity: 1 }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 200000 ? 0 : 15000;
    const total = subtotal + deliveryFee;

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = () => {
        // Basic Validation
        if (!formData.fullName || !formData.phone || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        setIsSubmitting(true);

        // Simulate API Call
        setTimeout(() => {
            setIsSubmitting(false);

            // Success Mock
            alert(`Đặt hàng thành công! Mã đơn: KFC${Date.now().toString().slice(-6)}\nPhương thức: ${paymentMethod === 'cod' ? 'Thanh toán tiền mặt' : 'Thanh toán Online'}`);

            // Redirect to My Orders
            navigate('/my-orders');
        }, 1500);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <Layout>
            <div className="checkout-wrapper">
                <div className="container checkout-container py-5">
                    <div className="checkout-header">
                        <h2 className="checkout-title">Thanh Toán</h2>
                        <div className="cart-title-underline" style={{ width: '50px' }}></div>
                    </div>

                    <div className="checkout-layout">
                        {/* Left Column: Information & Payment */}
                        <div className="checkout-form-section">
                            {/* Delivery Info */}
                            <div className="form-card">
                                <h3 className="form-title">
                                    <i className="bi bi-geo-alt-fill"></i>
                                    Thông Tin Giao Hàng
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
                                            placeholder="Ví dụ: Gọi trước khi giao, để ở quầy lễ tân..."
                                            value={formData.note}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
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

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính</span>
                                    <span className="fw-bold">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Phí giao hàng</span>
                                    <span className="fw-bold">{deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}</span>
                                </div>

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
        </Layout>
    );
};

export default Checkout;
