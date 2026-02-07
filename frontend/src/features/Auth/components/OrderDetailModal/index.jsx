import React from 'react';
import OrderStatusBadge from '../../../../components/OrderStatusBadge';
import OrderTimeline from '../../../../components/OrderTimeline';
import { formatCurrency, formatDateTime } from '../../../../utils/formatters';
import Modal from '../../../../components/Modal';

import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <Modal
            show={!!order}
            onClose={onClose}
            title={`Chi tiết đơn hàng #${order.orderNumber || order._id}`}
            size="lg"
        >
            <div className="detail-grid">
                <div className="detail-card">
                    <span className="detail-label">Trạng thái</span>
                    <div className="detail-value">
                        <OrderStatusBadge status={order.status} />
                    </div>
                </div>
                <div className="detail-card">
                    <span className="detail-label">Thời gian đặt</span>
                    <div className="detail-value">
                        {formatDateTime(order.createdAt)}
                    </div>
                </div>
            </div>
            <div>
                <h6>Danh sách món</h6>
                {order.items.map((item, idx) => (
                    <div key={idx} className="detail-item">
                        <div>
                            <span>{item.name}</span>
                            <span className="quantity">x{item.quantity}</span>
                        </div>
                        <span className="kfc-price">{formatCurrency(item.price)}</span>
                    </div>
                ))}
            </div>
            <div className="modal-total">
                <span>Tổng thanh toán</span>
                <span className="kfc-price price-lg">{formatCurrency(order.totalAmount)}</span>
            </div>

            {
                order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="timeline-section">
                        <h6>Lịch sử trạng thái</h6>
                        <OrderTimeline statusHistory={order.statusHistory} />
                    </div>
                )
            }
        </Modal >
    );
};

export default OrderDetailModal;
