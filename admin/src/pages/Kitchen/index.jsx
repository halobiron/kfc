import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';
import './kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: 'warning', icon: FiClock },
    preparing: { label: 'Đang chuẩn bị', color: 'info', icon: FiAlertCircle },
    completed: { label: 'Hoàn thành', color: 'success', icon: FiCheckCircle }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderOrderCard = (order) => {
    const config = statusConfig[order.status];
    const StatusIcon = config.icon;

    return (
      <div key={order._id} className="order-card">
        <div className="order-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">{order.orderNumber}</h5>
              <small className="text-muted">{order.createdAt}</small>
            </div>
            <span className={`badge badge-${config.color}`}>
              <StatusIcon size={14} className="me-1" />
              {config.label}
            </span>
          </div>
        </div>
        <div className="order-card-body">
          <p className="mb-2"><strong>Khách hàng:</strong> {order.customerName}</p>
          <div className="mb-3">
            <strong>Món ăn:</strong>
            <ul className="order-items-list">
              {order.items.map((item, index) => (
                <li key={index}>
                  <span className="item-quantity">{item.quantity}x</span> {item.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <strong className="text-danger">{formatCurrency(order.totalAmount)}</strong>
            <div className="btn-group btn-group-sm">
              {order.status === 'pending' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleStatusChange(order._id, 'preparing')}
                >
                  Bắt đầu <FiChevronRight size={14} />
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusChange(order._id, 'completed')}
                >
                  Hoàn thành <FiCheckCircle size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
      <div className="page-header">
        <h1 className="page-title">Bếp - Quản lý Đơn hàng</h1>
        <p className="text-muted">Xem và cập nhật trạng thái chế biến món ăn</p>
      </div>

      {/* Stats Overview */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <StatCard
            label="Chờ xác nhận"
            value={getOrdersByStatus('pending').length}
            icon={<FiClock size={24} />}
            color="warning"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Đang chuẩn bị"
            value={getOrdersByStatus('preparing').length}
            icon={<FiAlertCircle size={24} />}
            color="info"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Hoàn thành hôm nay"
            value={getOrdersByStatus('completed').length}
            icon={<FiCheckCircle size={24} />}
            color="success"
          />
        </div>
      </div>

      {/* Orders by Status */}
      <div className="row g-4">
        {/* Pending Orders */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <FiClock className="me-2" />
              Chờ xác nhận ({getOrdersByStatus('pending').length})
            </div>
            <div className="card-body p-2">
              <div className="orders-column">
                {getOrdersByStatus('pending').length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <FiClock size={32} className="mb-2 opacity-50" />
                    <p className="mb-0">Không có đơn mới</p>
                  </div>
                ) : (
                  getOrdersByStatus('pending').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preparing Orders */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-info text-white">
              <FiAlertCircle className="me-2" />
              Đang chuẩn bị ({getOrdersByStatus('preparing').length})
            </div>
            <div className="card-body p-2">
              <div className="orders-column">
                {getOrdersByStatus('preparing').length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <FiAlertCircle size={32} className="mb-2 opacity-50" />
                    <p className="mb-0">Chưa có đơn đang chế biến</p>
                  </div>
                ) : (
                  getOrdersByStatus('preparing').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <FiCheckCircle className="me-2" />
              Hoàn thành ({getOrdersByStatus('completed').length})
            </div>
            <div className="card-body p-2">
              <div className="orders-column">
                {getOrdersByStatus('completed').length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <FiCheckCircle size={32} className="mb-2 opacity-50" />
                    <p className="mb-0">Chưa có đơn hoàn thành</p>
                  </div>
                ) : (
                  getOrdersByStatus('completed').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Kitchen;
