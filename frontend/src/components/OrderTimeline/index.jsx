import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import { STATUS_OPTIONS } from '../OrderStatusBadge';
import './OrderTimeline.css';

const OrderTimeline = ({ statusHistory }) => {
    if (!statusHistory || statusHistory.length === 0) {
        return (
            <div className="timeline-empty-state">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                <p>Chưa có cập nhật trạng thái</p>
            </div>
        );
    }

    return (
        <div className="timeline-wrapper">
            <ul className="timeline-list">
                {[...statusHistory]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((history, index) => {
                        const statusInfo = STATUS_OPTIONS.find(opt => opt.value === history.status) || { label: history.status };
                        const isLatest = index === 0;
                        return (
                            <li key={index} className={`timeline-item ${isLatest ? 'latest' : 'completed'}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-date">
                                    {formatDateTime(history.timestamp)}
                                </div>
                                <div className={`timeline-status-text ${isLatest ? 'latest' : ''}`}>
                                    {statusInfo.label}
                                </div>
                                {history.note && <div className="timeline-note">{history.note}</div>}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default OrderTimeline;
