import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import FormInput from '../../components/FormInput';
import './TrackOrder.css';

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusLabel = (status) => {
        const statuses = {
            'pending': { text: 'Chờ xác nhận', color: '#ffc107', icon: 'bi-clock' },
            'confirmed': { text: 'Đã xác nhận', color: '#007bff', icon: 'bi-check2-circle' },
            'preparing': { text: 'Đang chuẩn bị', color: '#17a2b8', icon: 'bi-egg-fried' },
            'shipping': { text: 'Đang giao hàng', color: '#fd7e14', icon: 'bi-truck' },
            'ready': { text: 'Sẵn sàng giao', color: '#28a745', icon: 'bi-check-circle' },
            'delivered': { text: 'Đã giao hàng', color: '#28a745', icon: 'bi-check-all' },
            'cancelled': { text: 'Đã hủy', color: '#dc3545', icon: 'bi-x-circle' }
        };
        return statuses[status] || { text: status, color: '#6c757d', icon: 'bi-question-circle' };
    };

    return (
        <div className="track-order-wrapper py-5 min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className={`row ${order ? 'justify-content-center align-items-start' : 'justify-content-center'}`}>
                    {/* Search Form Column */}
                    <div className={order ? "col-lg-4 mb-4" : "col-md-6 col-lg-5"}>
                        <div className="track-order-card p-4 h-100">
                            <h2 className="text-center fw-bold mb-4" style={{ color: '#e4002b' }}>TRA CỨU ĐƠN HÀNG</h2>
                            <form onSubmit={handleLookup}>
                                <div className="mb-3">
                                    <FormInput
                                        type="text"
                                        placeholder="Mã đơn hàng (Ví dụ: ORD...)"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <FormInput
                                        type="tel"
                                        placeholder="Số điện thoại đặt hàng"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? 'ĐANG TÌM...' : 'TRA CỨU NGAY'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Result Column - Only visible when order exists */}
                    {order && (
                        <div className="col-lg-8 animate__animated animate__fadeIn">
                            <div className="order-result-card shadow p-4">
                                <div className="row">
                                    {/* Left Side: Order Details */}
                                    <div className="col-md-7 mb-4 mb-md-0 pe-md-4 border-end-md">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-bold fs-5">#{order.orderNumber}</span>
                                            <span
                                                className="status-badge text-white"
                                                style={{ backgroundColor: getStatusLabel(order.status).color }}
                                            >
                                                {getStatusLabel(order.status).text}
                                            </span>
                                        </div>

                                        <div className="card bg-light border-0 p-3 mb-3">
                                            <p className="small mb-1"><i className="bi bi-person-circle me-2"></i><strong>Khách hàng:</strong> {order.deliveryInfo?.fullName}</p>
                                            <p className="small mb-0"><i className="bi bi-geo-alt-fill me-2"></i><strong>Địa chỉ:</strong> {order.deliveryInfo?.address || 'Tại cửa hàng'}</p>
                                            {order.deliveryInfo?.note && (
                                                <p className="small mb-0 mt-1 text-muted fst-italic"><i className="bi bi-sticky me-2"></i>Ghi chú: {order.deliveryInfo.note}</p>
                                            )}
                                        </div>

                                        <div className="mb-3 border-top border-bottom py-2">
                                            <h6 className="fw-bold text-secondary text-uppercase small mb-2">Chi tiết món ăn</h6>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="item-row small text-muted d-flex justify-content-between py-2 border-bottom-dashed">
                                                    <div>
                                                        <span className="fw-bold me-2 text-dark">{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <span className="fw-bold text-dark">{formatCurrency(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                            <div className="d-flex justify-content-between pt-2">
                                                <span>Phí giao hàng</span>
                                                <span>{formatCurrency(order.shippingFee || 0)}</span>
                                            </div>
                                            {order.couponDiscount > 0 && (
                                                <div className="d-flex justify-content-between text-success">
                                                    <span>Giảm giá</span>
                                                    <span>-{formatCurrency(order.couponDiscount)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between fw-bold fs-5 align-items-center">
                                            <span>TỔNG CỘNG</span>
                                            <span className="text-danger fs-4">{formatCurrency(order.totalAmount)}</span>
                                        </div>
                                    </div>

                                    {/* Right Side: Timeline */}
                                    <div className="col-md-5 ps-md-4 mt-4 mt-md-0">
                                        <h6 className="mb-4 fw-bold text-uppercase text-secondary border-bottom pb-2" style={{ letterSpacing: '1px' }}>
                                            <i className="bi bi-clock-history me-2"></i>Hành trình đơn
                                        </h6>

                                        {order.statusHistory && order.statusHistory.length > 0 ? (
                                            <div className="timeline-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <ul className="timeline ps-0">
                                                    {[...order.statusHistory]
                                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                        .map((history, index) => {
                                                            const statusInfo = getStatusLabel(history.status);
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
                                                                    <div className="timeline-status" style={{ color: isLatest ? statusInfo.color : '#333' }}>
                                                                        {statusInfo.text}
                                                                    </div>
                                                                    {history.note && <div className="timeline-note small text-muted">{history.note}</div>}
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                                <p>Chưa có cập nhật trạng thái</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
