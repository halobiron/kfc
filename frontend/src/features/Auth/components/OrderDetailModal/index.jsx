import React from 'react';
import OrderStatusBadge, { STATUS_OPTIONS } from '../../../../components/OrderStatusBadge';
import { formatCurrency, formatDateTime } from '../../../../utils/formatters';
import Modal from '../../../../components/Modal';

import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const modalFooter = (
        <button className="btn btn-primary" onClick={onClose}>ĐÓNG</button>
    );

    return (
        <Modal
            show={!!order}
            onClose={onClose}
            title={`Chi tiết đơn hàng #${order.orderNumber || order._id}`}
            footer={modalFooter}
            size="lg"
        >
            <div className="detail-grid">
                <div className="detail-card">
                    <span>Trạng thái</span>
                    <OrderStatusBadge status={order.status} />
                </div>
                <div className="detail-card">
                    <span>Thời gian đặt</span>
                    <p>{formatDateTime(order.createdAt)}</p>
                </div>
            </div>
            <div className="items-section">
                <h6>Danh sách món</h6>
                {order.items.map((item, idx) => (
                    <div key={idx} className="detail-item">
                        <div>
                            <span>{item.name}</span>
                            <span className="quantity">x{item.quantity}</span>
                        </div>
                        <span className="price">{formatCurrency(item.price)}</span>
                    </div>
                ))}
            </div>
            <div className="modal-total">
                <span>Tổng thanh toán</span>
                <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
            </div>

            {/* Timeline Section */}
            {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="timeline-section">
                    <h6 className="mb-3 fw-bold text-uppercase text-secondary" style={{ fontSize: '0.9rem' }}>Lịch sử trạng thái</h6>
                    <ul className="timeline">
                        {[...order.statusHistory]
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map((history, index) => {
                                const statusInfo = STATUS_OPTIONS.find(opt => opt.value === history.status) || { label: history.status };
                                const isLatest = index === 0;
                                return (
                                    <li key={index} className={`timeline-item ${isLatest ? 'latest' : 'completed'}`}>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-time">
                                            {formatDateTime(history.timestamp)}
                                        </div>
                                        {statusInfo.label}
                                        {history.note && <div className="timeline-note">{history.note}</div>}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </Modal>
    );
};

export default OrderDetailModal;
