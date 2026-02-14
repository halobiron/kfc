import React, { useMemo } from 'react';
import { getOrderStatusMeta } from '../OrderStatusBadge/orderStatus';
import OrderStatusBadge from '../OrderStatusBadge';

const OrderTimeline = ({ order, status }) => {
    
    const sortedStatusHistory = useMemo(() => {
        if (!order?.statusHistory) return [];
        return [...order.statusHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [order]);

    return (
        <div className="card mb-4">
            <div className="card-header">Trạng thái đơn hàng</div>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <OrderStatusBadge status={status} className="p-2 fs-6" />
                    <span className="ms-3 text-muted">Cập nhật lần cuối: {new Date(order.updatedAt).toLocaleString('vi-VN')}</span>
                </div>

                {/* Timeline Section */}
                {sortedStatusHistory.length > 0 && (
                    <div className="timeline-section">
                        <h6 className="mb-3 fw-bold text-uppercase text-secondary" style={{ fontSize: '0.8rem' }}>Lịch sử trạng thái</h6>
                        <ul className="timeline">
                            {sortedStatusHistory.map((history, index) => {
                                const { label } = getOrderStatusMeta(history.status);
                                const isLatest = index === 0;
                                return (
                                    <li key={index} className={`timeline-item ${isLatest ? 'latest' : 'completed'}`}>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-time">
                                            {new Date(history.timestamp).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="timeline-status" style={{ color: isLatest ? '#007bff' : '#333' }}>
                                            {label}
                                        </div>
                                        {history.note && <div className="timeline-note">{history.note}</div>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTimeline;
