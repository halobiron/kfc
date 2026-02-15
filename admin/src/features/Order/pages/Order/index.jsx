import React, { useEffect, useState } from 'react'
import { FiEye, FiCheck, FiMapPin, FiXCircle, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../orderSlice';
import { toast } from 'react-toastify';
import StatusModal from '../../../../components/Common/StatusModal';
import Button from '../../../../components/Common/Button';
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

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>
      </div>

      <div className="card">
        <div className="card-header">Danh sách đơn hàng</div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Đang tải...</td></tr>
              ) : orders && orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td className="fw-bold">{order.orderNumber || order._id.substring(0, 8).toUpperCase()}</td>
                    <OrderCustomerCell order={order} />
                    <OrderItemsCell items={order.items} />
                    <td className="fw-bold text-danger">{formatCurrency(order.totalAmount)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>
                      <OrderActionButtons
                        order={order}
                        onOpenUpdateModal={openUpdateModal}
                        onCancelClick={handleCancelClick}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center">Chưa có đơn hàng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
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
