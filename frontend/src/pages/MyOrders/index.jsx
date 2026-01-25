import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './MyOrders.css';

const MyOrders = () => {
    // Mock data - trong thực tế sẽ fetch từ API dựa trên user đã login
    const [orders] = useState([
        {
            id: 'KFC2026012401',
            date: '24/01/2026 14:30',
            status: 'Đang giao',
            statusClass: 'shipping',
            total: 299000,
            items: [
                { name: 'Combo Gà Rán 1 Người', quantity: 1, price: 99000 },
                { name: 'Pepsi Lon', quantity: 2, price: 20000 }
            ],
            canCancel: false
        },
        {
            id: 'KFC2026012301',
            date: '23/01/2026 19:15',
            status: 'Hoàn thành',
            statusClass: 'completed',
            total: 450000,
            items: [
                { name: 'Combo Nhóm 4-6 Người', quantity: 1, price: 399000 },
                { name: 'Coca Cola 1.5L', quantity: 1, price: 25000 }
            ],
            canCancel: false
        },
        {
            id: 'KFC2026012402',
            date: '24/01/2026 20:00',
            status: 'Đang chuẩn bị',
            statusClass: 'preparing',
            total: 189000,
            items: [
                { name: 'Burger Zinger', quantity: 2, price: 69000 },
                { name: 'Khoai Tây Chiên (L)', quantity: 1, price: 25000 }
            ],
            canCancel: true
        },
        {
            id: 'KFC2026012202',
            date: '22/01/2026 12:45',
            status: 'Đã hủy',
            statusClass: 'cancelled',
            total: 150000,
            items: [
                { name: 'Gà Rán Giòn Cay (3 miếng)', quantity: 1, price: 89000 }
            ],
            canCancel: false
        }
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const handleCancelOrder = (order) => {
        setOrderToCancel(order);
    };

    const confirmCancelOrder = () => {
        alert(`Đơn hàng #${orderToCancel.id} đã được hủy thành công. Lý do: ${cancelReason || 'Không có'}. Tiền sẽ được hoàn lại trong 3-5 ngày làm việc.`);
        setOrderToCancel(null);
        setCancelReason('');
        // Trong thực tế: gọi API để hủy đơn
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const cancellationReasons = [
        "Tôi muốn đổi món khác",
        "Tôi nhập sai địa chỉ",
        "Tôi muốn đổi phương thức thanh toán",
        "Thời gian chờ quá lâu",
        "Tôi không muốn đặt nữa"
    ];

    return (
        <div className="my-orders-wrapper">
            <Header />

            <div className="my-orders-container">
                <div className="container py-5">
                    <div className="orders-header">
                        <h2 className="mb-4 text-uppercase">
                            Lịch Sử Đơn Hàng
                        </h2>
                        <div className="title-underline"></div>
                        <p className="text-muted mt-3">Quản lý và theo dõi các đơn hàng của bạn</p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-orders text-center py-5">
                            <i className="bi bi-cart-x display-1 text-muted"></i>
                            <h4 className="mt-3">Bạn chưa có đơn hàng nào</h4>
                            <a href="/products" className="btn btn-danger mt-3 px-5 py-2 rounded-pill">Đặt hàng ngay</a>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-card mb-4">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h5 className="order-id">Đơn hàng #{order.id}</h5>
                                            <span className="order-date">
                                                <i className="bi bi-calendar3 me-2"></i>
                                                {order.date}
                                            </span>
                                        </div>
                                        <div className="order-status-wrapper">
                                            <span className={`order-status status-${order.statusClass}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-body">
                                        <div className="order-items">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <div className="item-info">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-quantity">x{item.quantity}</span>
                                                    </div>
                                                    <span className="item-price text-danger">{formatCurrency(item.price)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-total-bar">
                                            <span className="total-label">Tổng cộng:</span>
                                            <span className="total-value text-danger">{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button
                                            className="btn btn-outline-dark btn-sm rounded-pill px-4"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            Xem chi tiết
                                        </button>

                                        {order.canCancel && (
                                            <button
                                                className="btn btn-danger btn-sm rounded-pill px-4"
                                                onClick={() => handleCancelOrder(order)}
                                            >
                                                <i className="bi bi-x-circle me-1"></i>
                                                Hủy đơn
                                            </button>
                                        )}

                                        {order.status === 'Hoàn thành' && (
                                            <button className="btn btn-danger btn-sm rounded-pill px-4">
                                                <i className="bi bi-arrow-repeat me-1"></i>
                                                Đặt lại
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h5 className="text-uppercase fw-bold">Chi tiết đơn hàng #{selectedOrder.id}</h5>
                            <button className="btn-close-custom" onClick={() => setSelectedOrder(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="order-modal-body">
                            <div className="detail-grid">
                                <div className="detail-card">
                                    <span className="detail-label">Trạng thái</span>
                                    <span className={`order-status status-${selectedOrder.statusClass}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="detail-card">
                                    <span className="detail-label">Thời gian đặt</span>
                                    <p className="mb-0 fw-bold">{selectedOrder.date}</p>
                                </div>
                            </div>

                            <div className="items-section mt-4">
                                <h6 className="section-title text-uppercase">Danh sách món</h6>
                                <div className="items-list-custom">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="detail-item-custom">
                                            <div className="item-main">
                                                <span className="fw-bold">{item.name}</span>
                                                <span className="ms-2 text-muted">x{item.quantity}</span>
                                            </div>
                                            <span className="fw-bold text-danger">{formatCurrency(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-total-section">
                                <span className="total-label text-uppercase">Tổng thanh toán</span>
                                <span className="total-amount-large">{formatCurrency(selectedOrder.total)}</span>
                            </div>
                        </div>
                        <div className="order-modal-footer">
                            <button className="btn btn-danger w-100" onClick={() => setSelectedOrder(null)}>
                                ĐÓNG
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Hủy Đơn Hàng - Redesigned to match KFC style */}
            {orderToCancel && (
                <div className="order-modal-overlay" onClick={() => setOrderToCancel(null)}>
                    <div className="order-modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header cancel-header">
                            <h5>Hủy Đơn Hàng</h5>
                            <button className="btn-close-custom" onClick={() => setOrderToCancel(null)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="order-modal-body text-center">
                            <div className="cancel-icon-wrapper">
                                <i className="bi bi-exclamation-circle"></i>
                            </div>
                            <h6 className="fw-bold mb-2">Bạn có chắc chắn muốn hủy đơn hàng này?</h6>
                            <p className="text-muted small mb-4">Đơn hàng: <span className="fw-bold">#{orderToCancel.id}</span> - Tổng tiền: <span className="text-danger fw-bold">{formatCurrency(orderToCancel.total)}</span></p>

                            <div className="reason-section text-start">
                                <label className="form-label text-uppercase small fw-bold text-muted mb-2">Lý do hủy đơn (Không bắt buộc)</label>
                                <div className="reasons-list">
                                    {cancellationReasons.map((reason, index) => (
                                        <div key={index} className="reason-item">
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                id={`reason-${index}`}
                                                value={reason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="form-check-input me-2"
                                            />
                                            <label htmlFor={`reason-${index}`} className="reason-label">{reason}</label>
                                        </div>
                                    ))}
                                </div>
                                <textarea
                                    className="form-control mt-3 rounded-2"
                                    placeholder="Lý do khác..."
                                    rows="2"
                                    value={cancelReason && !cancellationReasons.includes(cancelReason) ? cancelReason : ''}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="order-modal-footer">
                            <button className="btn btn-kfc-light flex-grow-1" onClick={() => setOrderToCancel(null)}>
                                Quay lại
                            </button>
                            <button className="btn btn-danger flex-grow-1" onClick={confirmCancelOrder}>
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default MyOrders;
