import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../../../api/axiosClient';
import CustomSelect from '../../../../components/CustomSelect';
import FormInput from '../../../../components/FormInput';
import EmptyState from '../../../../components/EmptyState';
import Card from '../../../../components/Card';
import OrderStatusBadge, { STATUS_OPTIONS } from '../../../../components/OrderStatusBadge';
import { formatCurrency, formatDateTime } from '../../../../utils/formatters';
import OrderDetailModal from '../OrderDetailModal';
import CancelOrderModal from '../CancelOrderModal';
import './AccountOrders.css';

const AccountOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [loading, setLoading] = useState(true);

    const statusOptions = STATUS_OPTIONS;

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const result = orders.filter(order => {
            const matchesStatus = ['All', order.status].includes(filterStatus);

            const searchableText = [
                order.orderNumber,
                order._id,
                ...order.items.map(item => item.name)
            ].join(' ').toLowerCase();

            return matchesStatus && searchableText.includes(lowerTerm);
        });
        setFilteredOrders(result);
    }, [searchTerm, filterStatus, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/user/orders');
            setOrders(response.data.data || []);
        } catch (error) {
            toast.error('Không thể tải đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancelOrder = async (reason) => {
        if (!orderToCancel) return;
        try {
            await axiosClient.post(`/order/${orderToCancel._id}/cancel`, {
                reason: reason
            });
            toast.success(`Đơn hàng #${orderToCancel.orderNumber || orderToCancel._id} đã được hủy thành công.`);
            setOrderToCancel(null);
            fetchOrders();
        } catch (error) {
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
    };

    return (
        <Card>
            <h2>Các đơn hàng đã đặt</h2>

            {orders.length > 0 && (
                <div className="search-filter-section">
                    <div className="search-box">
                        <FormInput
                            type="text"
                            placeholder="Tìm theo Mã đơn hàng hoặc Tên món..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <CustomSelect
                            className="w-100"
                            options={statusOptions}
                            value={filterStatus}
                            onChange={setFilterStatus}
                            placeholder="Lọc theo trạng thái"
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    title="Bắt đầu đặt món!"
                    description="Bạn chưa có đơn hàng nào"
                    actionText="Bắt đầu đặt hàng"
                    actionPath="/products"
                />
            ) : filteredOrders.length === 0 ? (
                <div className="empty-orders-search text-center py-5">
                    <h4>Không tìm thấy đơn hàng nào</h4>
                    <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h5 title={order.orderNumber || order._id}>Đơn hàng {order.orderNumber || order._id}</h5>
                                    <span className="order-date">
                                        {formatDateTime(order.createdAt)}
                                    </span>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="order-body">
                                <div className="order-items">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <div>
                                                <span>{item.name}</span>
                                                <span className="quantity">x{item.quantity}</span>
                                            </div>
                                            <span className="price">{formatCurrency(item.price)}</span>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="order-item">
                                            <span className="text-muted">... và {order.items.length - 3} món khác</span>
                                        </div>
                                    )}
                                </div>
                                <div className="order-total">
                                    <span>Tổng cộng:</span>
                                    <span className="total-value">{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                            <div className="order-actions">
                                <button
                                    className="btn btn-view"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    Xem chi tiết
                                </button>
                                {order.status === 'pending' && (
                                    <button
                                        className="btn btn-cancel"
                                        onClick={() => setOrderToCancel(order)}
                                    >
                                        Hủy đơn
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            <CancelOrderModal
                order={orderToCancel}
                onClose={() => setOrderToCancel(null)}
                onConfirm={handleConfirmCancelOrder}
            />
        </Card>
    );
};

export default AccountOrders;
