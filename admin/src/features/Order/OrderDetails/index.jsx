import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { FiArrowLeft, FiPrinter, FiXCircle, FiCheckCircle, FiTruck, FiPackage, FiClock, FiMapPin, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import './OrderDetails.css';

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng giao',
    shipping: 'Đang giao hàng',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy'
};

const STATUS_BADGES = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    preparing: 'badge-info text-dark',
    ready: 'badge-success',
    shipping: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
};

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/order/${id}`);
            const orderData = response.data.data || response.data;
            setOrder(orderData);
            setStatus(orderData.status);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
            toast.error('Không thể tải chi tiết đơn hàng.');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.put(`/order/update/${id}`, { status: newStatus });
            setStatus(newStatus);
            toast.success(`Cập nhật trạng thái thành công`);
            fetchOrderDetails();
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái đơn hàng.');
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner spinner-lg"></div></div>;
    if (!order) return <div className="text-center p-5">Không tìm thấy đơn hàng</div>;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            {/* Header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div className="d-flex align-items-center">
                    <button onClick={() => navigate('/orders')} className="btn btn-link text-dark p-0 me-3" title="Quay lại">
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="h2 mb-0 font-weight-bold" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                            Đơn hàng {order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                        </h1>
                        <span className="text-muted small">
                            <FiClock className="me-1" /> {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </span>
                    </div>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        {/* Status buttons */}
                        {status === 'pending' && (
                            <button type="button" className="btn btn-sm btn-success d-flex align-items-center" onClick={() => handleStatusChange('confirmed')}>
                                <FiCheckCircle className="me-2" /> Xác nhận
                            </button>
                        )}

                        {status === 'ready' && (
                            <button type="button" className="btn btn-sm btn-primary d-flex align-items-center" onClick={() => handleStatusChange('shipping')}>
                                <FiTruck className="me-2" /> Giao hàng
                            </button>
                        )}
                        {status === 'shipping' && (
                            <button type="button" className="btn btn-sm btn-success d-flex align-items-center" onClick={() => handleStatusChange('delivered')}>
                                <FiCheckCircle className="me-2" /> Hoàn thành
                            </button>
                        )}
                    </div>
                    {status !== 'cancelled' && status !== 'delivered' && (
                        <button
                            type="button"
                            className="btn btn-sm btn-danger d-flex align-items-center ms-2"
                            onClick={() => {
                                if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) handleStatusChange('cancelled');
                            }}
                        >
                            <FiXCircle className="me-2" /> Hủy đơn
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - Order Info */}
                <div className="col-lg-8">
                    {/* Order Items */}
                    <div className="card mb-4">
                        <div className="card-header">Chi tiết sản phẩm</div>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="">
                                    <tr>
                                        <th style={{ minWidth: '250px' }}>Sản phẩm</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="fw-bold">{item.name}</div>
                                            </td>
                                            <td className="text-center">x{item.quantity}</td>
                                            <td className="text-end">{formatPrice(item.price)}</td>
                                            <td className="text-end fw-bold">{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Tạm tính:</td>
                                        <td className="text-end">{formatPrice(order.subtotal || order.totalAmount)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold">Phí vận chuyển:</td>
                                        <td className="text-end">{formatPrice(order.shippingFee || 0)}</td>
                                    </tr>
                                    {order.couponDiscount > 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-end fw-bold text-success">Giảm giá:</td>
                                            <td className="text-end text-success">-{formatPrice(order.couponDiscount)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan="3" className="text-end fw-bold h5">Tổng cộng:</td>
                                        <td className="text-end fw-bold h5 text-danger">{formatPrice(order.totalAmount)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="card mb-4">
                        <div className="card-header">Trạng thái đơn hàng</div>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <span className={`badge ${STATUS_BADGES[status] || 'badge-secondary'} p-2 fs-6`}>
                                    {STATUS_LABELS[status] || status}
                                </span>
                                <span className="ms-3 text-muted">Cập nhật lần cuối: {new Date(order.updatedAt).toLocaleString('vi-VN')}</span>
                            </div>

                            {/* Timeline Section */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <div className="timeline-section">
                                    <h6 className="mb-3 fw-bold text-uppercase text-secondary" style={{ fontSize: '0.8rem' }}>Lịch sử trạng thái</h6>
                                    <ul className="timeline">
                                        {[...order.statusHistory]
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map((history, index) => {
                                                const label = STATUS_LABELS[history.status] || history.status;
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
                                                        <div className="timeline-status" style={{ color: isLatest ? '#007bff' : '#333' }}>
                                                            {label}
                                                        </div>
                                                        {history.note && <div className="timeline-note">{history.note}</div>}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer Info */}
                <div className="col-lg-4">
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
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;
