import React from 'react';
import Card from '../../../../components/Card';

const DeliveryMethod = ({ deliveryType, setDeliveryType }) => {
    return (
        <Card>
            <h3 className="form-title">
                <i className="bi bi-bicycle"></i>
                Hình Thức Nhận Hàng
            </h3>
            <div className="checkout-options-grid">
                <div
                    className={`checkout-option ${deliveryType === 'Giao hàng' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('Giao hàng')}
                >
                    <i className="bi bi-house-door-fill"></i>
                    <span>Giao hàng tận nơi</span>
                    <small>Giao tận địa chỉ</small>
                </div>

                <div
                    className={`checkout-option ${deliveryType === 'Đến lấy' ? 'selected' : ''}`}
                    onClick={() => setDeliveryType('Đến lấy')}
                >
                    <i className="bi bi-shop"></i>
                    <span>Đặt Hẹn Đến Lấy</span>
                    <small>Miễn phí ship</small>
                </div>
            </div>
        </Card>
    );
};

export default DeliveryMethod;
