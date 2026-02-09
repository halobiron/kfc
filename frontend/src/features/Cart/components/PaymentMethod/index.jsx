import React from 'react';
import Card from '../../../../components/Card';
import './PaymentMethod.css';

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
    return (
        <Card>
            <h3 className="form-title">
                <i className="bi bi-credit-card-2-front-fill"></i>
                Phương Thức Thanh Toán
            </h3>
            <div className="checkout-options-grid payment-methods">
                {[
                    { id: 'cod', icon: 'bi bi-cash-coin', label: 'Thanh toán khi nhận hàng (COD)' },
                    { id: 'payos', icon: 'bi bi-qr-code-scan', label: 'Thanh toán Online (QR/Thẻ/Ví)' }
                ].map(method => (
                    <div
                        key={method.id}
                        className={`checkout-option ${paymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                    >
                        <i className={method.icon}></i>
                        <span>{method.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PaymentMethod;
