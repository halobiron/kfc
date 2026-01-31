import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
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
            'delivered': { text: 'Đã giao hàng', color: '#28a745', icon: 'bi-check-all' },
            'cancelled': { text: 'Đã hủy', color: '#dc3545', icon: 'bi-x-circle' }
        };
        return statuses[status] || { text: status, color: '#6c757d', icon: 'bi-question-circle' };
    };

    return (
        <div className="track-order-wrapper py-5 min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="track-order-card p-4 mb-4">
                            <h2 className="text-center fw-bold mb-4" style={{ color: '#e4002b' }}>TRA CỨU ĐƠN HÀNG</h2>
                            <form onSubmit={handleLookup}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Mã đơn hàng (Ví dụ: ORD...)"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="tel"
                                        className="form-control"
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

                        {order && (
                            <div className="order-result-card shadow p-4 animate__animated animate__fadeIn">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-bold">#{order.orderNumber}</span>
                                    <span 
                                        className="status-badge text-white"
                                        style={{ backgroundColor: getStatusLabel(order.status).color }}
                                    >
                                        {getStatusLabel(order.status).text}
                                    </span>
                                </div>
                                
                                <div className="border-top pt-3">
                                    <p className="small mb-1"><strong>Khách hàng:</strong> {order.deliveryInfo?.fullName}</p>
                                    <p className="small mb-3"><strong>Địa chỉ:</strong> {order.deliveryInfo?.address || 'Tại cửa hàng'}</p>
                                    
                                    <div className="mb-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="item-row small text-muted">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                        <span>TỔNG CỘNG</span>
                                        <span className="text-danger">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
