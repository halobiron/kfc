import React, { useState } from 'react';
import FormInput from '../../../../components/FormInput';
import Modal from '../../../../components/Modal';
import OrderStatusBadge from '../../../../components/OrderStatusBadge';
import { formatDateTime } from '../../../../utils/formatters';
import './CancelOrderModal.css';
import '../OrderDetailModal/OrderDetailModal.css';

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

    const modalFooter = (
        <>
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button className="btn btn-danger" onClick={handleConfirm}>Xác nhận hủy</button>
        </>
    );

    return (
        <Modal
            show={!!order}
            onClose={onClose}
            title={`Hủy Đơn Hàng #${order.orderNumber || order._id}`}
            footer={modalFooter}
        >
            <div>
                <div className="detail-grid">
                    <div className="detail-card">
                        <span className="detail-label">Trạng thái</span>
                        <div className="detail-value">
                            <OrderStatusBadge status={order.status} />
                        </div>
                    </div>
                    <div className="detail-card">
                        <span className="detail-label">Thời gian đặt</span>
                        <div className="detail-value">{formatDateTime(order.createdAt)}</div>
                    </div>
                </div>
                <h6>Bạn có chắc chắn muốn hủy đơn hàng này?</h6>
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
        </Modal>
    );
};

export default CancelOrderModal;
