import React from 'react';
import { FiUser, FiPhone, FiMapPin } from 'react-icons/fi';

const CustomerInfoCard = ({ order }) => {
    return (
        <div className="card mb-4">
            <div className="card-header">Thông tin khách hàng</div>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-3 me-3">
                        <FiUser size={24} className="text-primary" />
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold">{order.deliveryInfo?.fullName}</h6>
                        <small className="text-muted">Khách hàng</small>
                    </div>
                </div>
                <hr />
                <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                        <FiPhone className="me-2 mt-1 text-muted" />
                        <span>{order.deliveryInfo?.phone}</span>
                    </div>
                    <div className="d-flex align-items-start mb-2">
                        <FiMapPin className="me-2 mt-1 text-muted flex-shrink-0" />
                        <span>
                            {order.deliveryType === 'pickup'
                                ? 'Nhận tại cửa hàng'
                                : order.deliveryInfo?.address || 'Chưa cập nhật địa chỉ'}
                            {order.deliveryInfo?.city ? `, ${order.deliveryInfo?.city}` : ''}
                        </span>
                    </div>
                </div>
                <div className="alert alert-info mb-0">
                    <small><strong>Ghi chú:</strong> {order.deliveryInfo?.note || 'Không có ghi chú'}</small>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoCard;
