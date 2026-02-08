import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../cartSlice';
import { formatCurrency } from '../../../../utils/formatters';
import { calculateDeliveryFee } from '../../../../utils/shipping';
import useShippingConfig from '../../../../hooks/useShippingConfig';

import './Cart.css';
import QuantityPicker from '../../../../components/QuantityPicker/QuantityPicker';
import EmptyState from '../../../../components/EmptyState';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';


const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get cart data from Redux
    const { items: cartItems, totalPrice: subtotal } = useSelector((state) => state.cart);

    // Use custom hook for shipping config
    const { config: shippingConfig } = useShippingConfig();

    const handleQuantityChange = (productId, newQuantity) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemoveItem = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?")) {
            dispatch(removeFromCart(id));
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        }
    };

    const deliveryFee = useMemo(
        () => calculateDeliveryFee({ subtotal, deliveryType: 'delivery', config: shippingConfig }),
        [subtotal, shippingConfig]
    );
    const total = subtotal + deliveryFee;



    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="kfc-page-wrapper">
            <div className="container kfc-container">
                <div className="section-header">
                    <h2>Giỏ Hàng Của Bạn</h2>
                    <hr className="section-underline" />
                </div>

                {cartItems.length === 0 ? (
                    <EmptyState
                        title="Giỏ hàng của bạn đang trống. Hãy đặt món ngay!"
                        actionText="Bắt đầu đặt hàng"
                        actionPath="/products"
                    />
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items List */}
                        <div className="cart-items-section">
                            {cartItems.map((item) => {
                                const itemId = item._id ?? item.id;

                                return (
                                    <Card key={itemId} className="cart-item-card">
                                        <button
                                            className="remove-item-btn"
                                            onClick={() => handleRemoveItem(itemId)}
                                            title="Xóa món"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>

                                        <div className="cart-item-image">
                                            <img
                                                src={item.productImage}
                                                alt={item.title}
                                            />
                                        </div>

                                        <div className="cart-item-details">
                                            <div>
                                                <h3 className="cart-item-name">{item.title}</h3>
                                                <p className="cart-item-desc">{item.description}</p>
                                            </div>

                                            <div className="cart-item-actions">
                                                <QuantityPicker
                                                    quantity={item.quantity}
                                                    onIncrease={() => handleQuantityChange(itemId, item.quantity + 1)}
                                                    onDecrease={() => handleQuantityChange(itemId, item.quantity - 1)}
                                                />
                                                <div className="kfc-price price-md">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="cart-summary-section">
                            <Card className="cart-summary-card">
                                <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>

                                <div className="summary-row">
                                    <span>Tạm tính</span>
                                    <span className="kfc-price">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí giao hàng</span>
                                    <span className="kfc-price">{deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}</span>
                                </div>
                                {deliveryFee === 0 && (
                                    <div className="text-success small mb-2">
                                        <i className="bi bi-check-circle-fill me-1"></i>
                                        Đơn hàng trên {formatCurrency(shippingConfig.freeShippingThreshold)} được miễn phí giao hàng!
                                    </div>
                                )}

                                <div className="summary-divider"></div>

                                <div className="total-row">
                                    <span className="total-label">TỔNG CỘNG</span>
                                    <span className="kfc-price price-lg">{formatCurrency(total)}</span>
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={handleCheckout}
                                    fullWidth
                                >
                                    Thanh Toán
                                </Button>

                                <Link to="/products" className="continue-shopping-link">
                                    Tiếp tục mua hàng
                                </Link>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
