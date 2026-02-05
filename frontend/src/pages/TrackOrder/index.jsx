import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './TrackOrder.css';
import OrderStatusBadge, { STATUS_OPTIONS } from '../../components/OrderStatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);

    const handleLookup = async (e) => {
        e.preventDefault();
        if (!orderNumber || !phone) {
            toast.error('Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post('/order/lookup', { orderNumber, phone });
            if (response.data.status) {
                setOrder(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không tìm thấy đơn hàng');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="track-order-wrapper">
            <div className="track-order-container">
                <div className={`track-order-row ${order ? 'has-order' : ''}`}>
                    <div className={`search-column ${order ? 'side-mode' : 'center-mode'}`}>
                        <Card className="track-order-card">
                            <div className="section-header">
                                <h2 className="section-title">TRA CỨU ĐƠN HÀNG</h2>
                                <hr className="section-underline" />
                            </div>
                            <form onSubmit={handleLookup}>
                                <FormInput
                                    containerClass="mb-3"
                                    label="Mã đơn hàng"
                                    type="text"
                                    placeholder="Ví dụ: ORD..."
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                />
                                <FormInput
                                    containerClass="mb-3"
                                    label="Số điện thoại"
                                    type="tel"
                                    placeholder="Nhập số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    loading={loading}
                                >
                                    TRA CỨU NGAY
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {order && (
                        <div className="result-column animate__animated animate__fadeIn">
                            <Card className="order-result-card shadow">
                                <div className="result-card-row">
                                    <div className="order-details-col">
                                        <div className="order-header-row">
                                            <span className="order-id-text">#{order.orderNumber}</span>
                                            <OrderStatusBadge status={order.status} />
                                        </div>

                                        <div className="customer-info-box">
                                            <p className="customer-detail-row"><i className="bi bi-person-circle me-2 text-secondary"></i><strong>Khách hàng:</strong> {order.deliveryInfo?.fullName}</p>
                                            <p className="customer-detail-row"><i className="bi bi-geo-alt-fill me-2 text-secondary"></i><strong>Địa chỉ:</strong> {order.deliveryInfo?.address || 'Tại cửa hàng'}</p>
                                            {order.deliveryInfo?.note && (
                                                <p className="customer-note"><i className="bi bi-sticky me-2 text-secondary"></i>Ghi chú: {order.deliveryInfo.note}</p>
                                            )}
                                        </div>

                                        <div className="item-list-container">
                                            <h6 className="order-items-heading">Chi tiết món ăn</h6>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item-row">
                                                    <div>
                                                        <span className="item-quantity">{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                            <div className="order-summary-row">
                                                <span>Phí giao hàng</span>
                                                <span>{formatCurrency(order.shippingFee || 0)}</span>
                                            </div>
                                            {order.couponDiscount > 0 && (
                                                <div className="order-summary-row discount-row">
                                                    <span>Giảm giá</span>
                                                    <span>-{formatCurrency(order.couponDiscount)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="total-row">
                                            <span>TỔNG CỘNG</span>
                                            <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    </div>

                                    <div className="timeline-col">
                                        <h6 className="timeline-title">
                                            <i className="bi bi-clock-history me-2"></i>Hành trình đơn
                                        </h6>

                                        {order.statusHistory && order.statusHistory.length > 0 ? (
                                            <div className="timeline-wrapper">
                                                <ul className="timeline timeline-list">
                                                    {[...order.statusHistory]
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
                                        ) : (
                                            <div className="timeline-empty-state">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                <p>Chưa có cập nhật trạng thái</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default TrackOrder;
