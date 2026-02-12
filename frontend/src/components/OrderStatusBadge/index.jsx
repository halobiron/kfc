import React from 'react';
import './OrderStatusBadge.css';
import { STATUS_CONFIG } from './orderStatus';
export { STATUS_OPTIONS } from './orderStatus';

const OrderStatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status];

    return (
        <span className={`status-badge ${config.class}`}>
            <i className={`bi ${config.icon} me-1`}></i>
            {config.text}
        </span>
    );
};

export default OrderStatusBadge;
