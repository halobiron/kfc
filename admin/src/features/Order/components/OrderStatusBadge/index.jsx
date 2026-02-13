import React from 'react';
import Badge from '../../../../components/Common/Badge';
import { getOrderStatusMeta } from './orderStatus';

const OrderStatusBadge = ({ status, className = '' }) => {
    const { label, badgeVariant, icon } = getOrderStatusMeta(status);

    return (
        <Badge variant={badgeVariant} className={`d-inline-flex align-items-center ${className}`.trim()}>
            <i className={`bi ${icon} me-1`}></i>
            {label}
        </Badge>
    );
};

export default OrderStatusBadge;
