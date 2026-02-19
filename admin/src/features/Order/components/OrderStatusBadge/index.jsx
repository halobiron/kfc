import React from 'react';
import Badge from '../../../../components/Common/Badge';
import { getOrderStatusMeta } from './orderStatus';

const OrderStatusBadge = ({ status, className = '' }) => {
    const { label, badgeVariant, icon } = getOrderStatusMeta(status);

    return (
        <Badge variant={badgeVariant} className={className.trim()}>
            <i className={`bi ${icon}`}></i>
            {label}
        </Badge>
    );
};

export default OrderStatusBadge;
