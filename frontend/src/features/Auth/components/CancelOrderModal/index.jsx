import React, { useState } from 'react';
import FormInput from '../../../../components/FormInput';
import { formatCurrency } from '../../../../utils/formatters';
import '../AccountModal.css';
import './CancelOrderModal.css';

const CANCELLATION_REASONS = [
    "Tôi muốn đổi món khác",
    "Tôi nhập sai địa chỉ",
    "Tôi muốn đổi phương thức thanh toán",
    "Thời gian chờ quá lâu",
    "Tôi không muốn đặt nữa"
];

const CancelOrderModal = ({ order, onClose, onConfirm }) => {
    const [cancelReason, setCancelReason] = useState('');

    const handleConfirm = () => {
        onConfirm(cancelReason);
    };

    if (!order) return null;

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                <div className="order-modal-header">
                    <h5>Hủy Đơn Hàng</h5>
                    <button className="btn-close-custom" onClick={onClose}>×</button>
                </div>
                <div className="order-modal-body">
                    <h6>Bạn có chắc chắn muốn hủy đơn hàng này?</h6>
                    <p>Đơn hàng: #{order.orderNumber || order._id} - Tổng tiền: {formatCurrency(order.totalAmount)}</p>
                    <div className="reason-section">
                        <label>Lý do hủy đơn (Không bắt buộc)</label>
                        {CANCELLATION_REASONS.map((reason, index) => (
                            <div key={index} className="reason-item">
                                <input
                                    type="radio"
                                    name="cancelReason"
                                    id={`reason-${index}`}
                                    value={reason}
                                    checked={cancelReason === reason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                                <label htmlFor={`reason-${index}`}>{reason}</label>
                            </div>
                        ))}
                        <FormInput
                            type="textarea"
                            placeholder="Lý do khác..."
                            rows="3"
                            value={CANCELLATION_REASONS.includes(cancelReason) ? '' : cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    </div>
                </div>
                <div className="order-modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
                    <button className="btn btn-danger" onClick={handleConfirm}>Xác nhận hủy</button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
