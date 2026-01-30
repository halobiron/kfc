import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

import './Cart.css';

// Placeholder image if real ones aren't available
const PLACEHOLDER_IMG = "https://static.kfcvietnam.com.vn/images/items/lg/D-C-Ga-Ran.jpg?v=gXQ2pg";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get cart data from Redux
    const { items: cartItems, totalPrice: subtotal } = useSelector((state) => state.cart);

    const handleQuantityChange = (id, newQuantity) => { // id passed here is actually _id or id
        dispatch(updateQuantity({ productId: id, quantity: newQuantity }));
    };

    const handleRemoveItem = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?")) {
            dispatch(removeFromCart(id));
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        }
    };

    const deliveryFee = subtotal > 200000 ? 0 : 15000; // Free shipping for orders > 200k
    const total = subtotal + deliveryFee;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-page-wrapper">
            <div className="container cart-container py-5">
                <div className="cart-title-section">
                    <h2 className="cart-title text-uppercase">Giỏ Hàng Của Bạn</h2>
                    <div className="cart-title-underline"></div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-bucket">
                        <div>
                            <h2>Giỏ hàng của bạn đang trống. Hãy đặt món ngay!</h2>
                            <a href="/products" className="start-order-btn">
                                Bắt đầu đặt hàng
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items List */}
                        <div className="cart-items-section">
                            {cartItems.map((item) => {
                                const itemId = item._id;

                                return (
                                    <div key={itemId} className="cart-item-card">
                                        <button
                                            className="remove-item-btn"
                                            onClick={() => handleRemoveItem(itemId)}
                                            title="Xóa món"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>

                                        <div className="cart-item-image">
                                            <img
                                                src={item.productImage || PLACEHOLDER_IMG}
                                                alt={item.title}
                                                onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
                                            />
                                        </div>

                                        <div className="cart-item-details">
                                            <div>
                                                <h3 className="cart-item-name">{item.title}</h3>
                                                <p className="cart-item-desc">{item.description}</p>
                                            </div>

                                            <div className="cart-item-actions">
                                                <div className="quantity-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                                <div className="cart-item-price">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="cart-summary-section">
                            <div className="summary-card">
                                <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>

                                <div className="summary-row">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí giao hàng</span>
                                    <span>{deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}</span>
                                </div>
                                {deliveryFee === 0 && (
                                    <div className="text-success small mb-2">
                                        <i className="bi bi-check-circle-fill me-1"></i>
                                        Đơn hàng trên 200k được miễn phí giao hàng!
                                    </div>
                                )}

                                <div className="summary-divider"></div>

                                <div className="total-row">
                                    <span className="total-label">TỔNG CỘNG</span>
                                    <span className="total-amount">{formatCurrency(total)}</span>
                                </div>

                                <button className="checkout-btn" onClick={handleCheckout}>
                                    Thanh Toán
                                </button>

                                <a href="/products" className="continue-shopping-link">
                                    Tiếp tục mua hàng
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
