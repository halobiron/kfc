import React from 'react';
import Card from '../../../../components/Card';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import './OrderSummary.css';

const OrderSummary = ({
    cartItems,
    formatCurrency,
    couponCode,
    setCouponCode,
    handleApplyCoupon,
    couponError,
    appliedCoupon,
    removeCoupon,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    isSubmitting,
    handlePlaceOrder,
    deliveryType
}) => {
    return (
        <Card className="checkout-summary-sidebar">
            <h3 className="form-title">
                Tóm Tắt Đơn Hàng
            </h3>

            <div>
                {cartItems.map(item => (
                    <div key={item._id || item.id} className="summary-item">
                        <div className="item-name-qty">
                            <span className="item-qty">{item.quantity}x</span>
                            <span>{item.title || item.name}</span>
                        </div>
                        <span className="kfc-price">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                ))}
            </div>

            <div className="summary-divider"></div>

            {/* Promotion Section */}
            <div className="mb-3">
                <label className="form-label d-flex justify-content-between align-items-center">
                    <span className="fw-bold"><i className="bi bi-ticket-perforated-fill me-1 text-danger"></i>Mã khuyến mãi</span>
                </label>
                <div className="d-flex gap-2 align-items-start">
                    <div className="flex-grow-1">
                        <FormInput
                            type="text"
                            placeholder="Nhập mã voucher"
                            value={couponCode}
                            containerClass="mb-0"
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleApplyCoupon}
                        className="btn-apply-coupon"
                    >
                        Áp dụng
                    </Button>
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
                <span className="kfc-price">{formatCurrency(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phí giao hàng</span>
                <div className="text-end">
                    {deliveryType === 'pickup' ? (
                        <span className="kfc-price text-success">Miễn phí</span>
                    ) : (
                        <>
                            <span className={`kfc-price ${deliveryFee === 0 ? "text-success" : ""}`}>
                                {deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}
                            </span>
                            {appliedCoupon?.type === 'shipping' && <div className="text-success small fst-italic">(Đã giảm phí ship)</div>}
                        </>
                    )}
                </div>
            </div>
            {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-danger">
                    <span><i className="bi bi-tag-fill me-1"></i>Giảm tiền</span>
                    <span className="kfc-price">-{formatCurrency(discountAmount)}</span>
                </div>
            )}

            <div className="summary-divider thick"></div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold fs-5">TỔNG CỘNG</span>
                <span className="kfc-price price-xl">{formatCurrency(total)}</span>
            </div>

            <Button
                variant="primary"
                onClick={handlePlaceOrder}
                loading={isSubmitting}
                fullWidth
            >
                ĐẶT HÀNG
            </Button>
        </Card>
    );
};

export default OrderSummary;
