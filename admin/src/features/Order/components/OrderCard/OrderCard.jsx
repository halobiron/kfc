import React from 'react';
// Re-saving to fix import paths
import { FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import Badge from '../../../../components/Common/Badge';
import { formatCurrency } from '../../../../utils/formatters';

const OrderCard = ({ order, config, onStatusChange }) => {
  if (!config) return null;

  const StatusIcon = config.icon;

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold" title={order.orderNumber || order._id}>
              {order.orderNumber || order._id.slice(0, 8).toUpperCase()}
            </h5>
            <small className="text-muted">
              {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
            </small>
          </div>
          <Badge variant={config.color} className="d-inline-flex align-items-center">
            <StatusIcon size={14} className="me-1" />
            {config.label}
          </Badge>
        </div>
      </div>
      <div className="order-card-body">
        <p className="mb-2"><strong>Khách hàng:</strong> {order.deliveryInfo?.fullName}</p>
        <div className="mb-3">
          <strong>Món ăn:</strong>
          <ul className="order-items-list">
            {order.items.map((item, index) => (
              <li key={index}>
                <span className="item-quantity">{item.quantity}x</span> {item.name}
              </li>
            ))}
          </ul>
          {order.deliveryInfo?.note && (
            <div className="alert alert-light mt-2 mb-0 p-2 small">
              <small className="fw-bold">Ghi chú:</small> {order.deliveryInfo.note}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <strong className="text-secondary">{formatCurrency(order.totalAmount)}</strong>
          <div className="btn-group btn-group-sm">
            {order.status === 'confirmed' && (
              <button
                className="btn btn-primary"
                onClick={() => onStatusChange(order._id, 'preparing')}
              >
                Bắt đầu nấu <FiChevronRight size={14} />
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                className="btn btn-success"
                onClick={() => onStatusChange(order._id, 'ready')}
              >
                Món đã xong <FiCheckCircle size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
