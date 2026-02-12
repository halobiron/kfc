import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiChevronRight, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderApi from '../../../api/orderApi';
import StatCard from '../../../components/Common/StatCard';
import StatusModal from '../../../components/Common/StatusModal';
import './Kitchen.css';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    confirmed: { label: 'Chờ chế biến', color: 'warning', icon: FiClock },
    preparing: { label: 'Đang chuẩn bị', color: 'info', icon: FiAlertCircle },
    ready: { label: 'Sẵn sàng giao', color: 'success', icon: FiCheckCircle }
  };

  const openStatusModal = (orderId, status) => {
    setSelectedOrder(orderId);
    setTargetStatus(status);
    setShowModal(true);
  };

  const handleConfirmStatusChange = async (note) => {
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      await orderApi.updateStatus(selectedOrder, { status: targetStatus, note });
      toast.success('Cập nhật trạng thái thành công');
      setShowModal(false);
      fetchOrders(); // Reload to sync
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderOrderCard = (order) => {
    const config = statusConfig[order.status];
    if (!config) return null; // Don't show other statuses like pending/shipping/delivered

    const StatusIcon = config.icon;

    return (
      <div key={order._id} className="order-card">
        <div className="order-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold" title={order.orderNumber || order._id}>{order.orderNumber || order._id.slice(0, 8).toUpperCase()}</h5>
              <small className="text-muted">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</small>
            </div>
            <span className={`badge badge-${config.color}`}>
              <StatusIcon size={14} className="me-1" />
              {config.label}
            </span>
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
                  onClick={() => openStatusModal(order._id, 'preparing')}
                >
                  Bắt đầu nấu <FiChevronRight size={14} />
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  className="btn btn-success"
                  onClick={() => openStatusModal(order._id, 'ready')}
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

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Điều phối Chế biến</h1>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
          Làm mới
        </button>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <StatCard
            label="Cần chế biến"
            value={getOrdersByStatus('confirmed').length}
            icon={<FiClock size={24} />}
            color="warning"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Đang nấu"
            value={getOrdersByStatus('preparing').length}
            icon={<FiAlertCircle size={24} />}
            color="info"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Sẵn sàng (Chờ giao)"
            value={getOrdersByStatus('ready').length}
            icon={<FiCheckCircle size={24} />}
            color="success"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Confirmed Orders (To Cook) */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark fw-bold">
              <FiClock className="me-2" />
              CHỜ CHẾ BIẾN ({getOrdersByStatus('confirmed').length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus('confirmed').length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiClock size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Không có đơn mới cần làm</p>
                  </div>
                ) : (
                  getOrdersByStatus('confirmed').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preparing Orders (Cooking) */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-info text-dark fw-bold">
              <FiAlertCircle className="me-2" />
              ĐANG NẤU ({getOrdersByStatus('preparing').length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus('preparing').length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiAlertCircle size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Bếp đang rảnh</p>
                  </div>
                ) : (
                  getOrdersByStatus('preparing').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ready Orders */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white fw-bold">
              <FiCheckCircle className="me-2" />
              SẴN SÀNG GIAO ({getOrdersByStatus('ready').length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus('ready').length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiPackage size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Chưa có món chờ giao</p>
                  </div>
                ) : (
                  getOrdersByStatus('ready').map(order => renderOrderCard(order))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirmStatusChange}
        status={targetStatus}
        loading={updating}
        title="Cập nhật tiến độ nấu"
      />
    </>
  );
};

export default Kitchen;
