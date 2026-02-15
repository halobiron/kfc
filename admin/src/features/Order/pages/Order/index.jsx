import React, { useEffect, useState } from 'react'
import { FiEye, FiCheck, FiMapPin, FiXCircle, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../orderSlice';
import { toast } from 'react-toastify';
import StatusModal from '../../../../components/Common/StatusModal';
import Button from '../../../../components/Common/Button';
import Table from '../../../../components/Common/Table';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { getOrderStatusMeta } from '../../components/OrderStatusBadge/orderStatus';
import { formatCurrency } from '../../../../utils/formatters';
import './Order.css';

const OrderCustomerCell = ({ order }) => {
  const shortAddress = order.deliveryInfo?.address && order.deliveryInfo.address.length > 30
    ? `${order.deliveryInfo.address.substring(0, 30)}...`
    : order.deliveryInfo?.address;

  return (
    <td>
      <div>{order.deliveryInfo?.fullName}</div>
      <small className="text-muted d-block">{order.deliveryInfo?.phone}</small>
      <small className="text-muted d-block" style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
        <FiMapPin className="me-1" size={12} />
        {order.deliveryType === 'pickup' ? 'Tại cửa hàng' : shortAddress}
      </small>
    </td>
  );
};

const OrderItemsCell = ({ items = [] }) => (
  <td>
    <ul className="list-unstyled mb-0 small">
      {items.slice(0, 2).map((item, idx) => (
        <li key={idx}>- {item.name} (x{item.quantity})</li>
      ))}
      {items.length > 2 && <li>...</li>}
    </ul>
  </td>
);

const OrderActionButtons = ({ order, onOpenUpdateModal, onCancelClick }) => (
  <div className="order-actions">
    <Link
      to={`/orders/${order._id}`}
      className="btn btn-sm btn-outline-dark"
      title="Xem chi tiết"
    >
      <FiEye />
    </Link>
    {order.status === 'pending' && (
      <Button
        size="sm"
        variant="outline-success"
        onClick={() => onOpenUpdateModal(order._id, 'confirmed')}
        title="Duyệt đơn"
        icon={<FiCheck />}
      />
    )}
    {order.status === 'ready' && (
      <Button
        size="sm"
        variant="outline-primary"
        onClick={() => onOpenUpdateModal(order._id, 'shipping')}
        title="Giao hàng"
        icon={<FiTruck />}
      />
    )}
    {order.status === 'shipping' && (
      <Button
        size="sm"
        variant="outline-success"
        onClick={() => onOpenUpdateModal(order._id, 'delivered')}
        title="Hoàn thành"
        icon={<FiCheckCircle />}
      />
    )}
    {(order.status !== 'cancelled' && order.status !== 'delivered') && (
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => onCancelClick(order._id)}
        title="Hủy đơn"
        icon={<FiXCircle />}
      />
    )}
  </div>
);

const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const openUpdateModal = (orderId, status) => {
    setSelectedOrder(orderId);
    setTargetStatus(status);
    setShowModal(true);
  };

  const handleConfirmUpdate = async (note) => {
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      await dispatch(updateOrderStatus({ id: selectedOrder, status: targetStatus, note })).unwrap();
      toast.success('Cập nhật trạng thái thành công');
      setShowModal(false);
    } catch (error) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelClick = (id) => {
    openUpdateModal(id, 'cancelled');
  };

  const columns = [
    {
      header: 'Mã đơn hàng',
      render: (order) => <span className="fw-bold">#{order._id?.substring(-6).toUpperCase() || 'N/A'}</span>
    },
    {
      header: 'Khách hàng',
      render: (order) => <OrderCustomerCell order={order} />
    },
    {
      header: 'Sản phẩm',
      render: (order) => <OrderItemsCell items={order.items} />
    },
    {
      header: 'Tổng tiền',
      render: (order) => <span className="fw-bold text-primary">{formatCurrency(order.totalAmount)}</span>
    },
    {
      header: 'Trạng thái',
      render: (order) => <OrderStatusBadge status={order.status} />
    },
    {
      header: 'Thao tác',
      render: (order) => (
        <OrderActionButtons 
          order={order} 
          onOpenUpdateModal={openUpdateModal} 
          onCancelClick={handleCancelClick} 
        />
      )
    }
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>
      </div>

      <div className="card">
        <div className="card-header">Danh sách đơn hàng</div>
        <Table 
          columns={columns}
          data={orders}
          loading={loading}
          emptyMessage="Chưa có đơn hàng nào"
        />
      </div>

      <StatusModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirmUpdate}
        status={targetStatus}
        statusLabel={getOrderStatusMeta(targetStatus).label}
        loading={updating}
        title={targetStatus === 'cancelled' ? 'Xác nhận Hủy đơn hàng' : 'Cập nhật trạng thái'}
      />
    </>
  )
}

export default Order
