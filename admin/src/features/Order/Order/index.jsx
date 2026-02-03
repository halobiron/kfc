import React, { useEffect } from 'react'
import { FiEye, FiCheck, FiTrash2, FiMapPin, FiXCircle, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../orderSlice';
import { toast } from 'react-toastify';

const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      handleUpdateStatus(id, 'cancelled');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-warning">Chờ xác nhận</span>;
      case 'confirmed': return <span className="badge badge-info">Đã xác nhận</span>;
      case 'preparing': return <span className="badge badge-info text-dark">Đang chuẩn bị</span>;
      case 'ready': return <span className="badge badge-success">Sẵn sàng giao</span>;
      case 'shipping': return <span className="badge badge-primary">Đang giao</span>;
      case 'delivered': return <span className="badge badge-success">Hoàn thành</span>;
      case 'cancelled': return <span className="badge badge-danger">Đã hủy</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
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
                    <td>
                      <div>{order.deliveryInfo?.fullName}</div>
                      <small className="text-muted d-block">{order.deliveryInfo?.phone}</small>
                      <small className="text-muted d-block" style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                        <FiMapPin className="me-1" size={12} />
                        {order.deliveryType === 'pickup'
                          ? 'Tại cửa hàng'
                          : (order.deliveryInfo?.address && order.deliveryInfo.address.length > 30
                            ? order.deliveryInfo.address.substring(0, 30) + '...'
                            : order.deliveryInfo?.address)}
                      </small>
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0 small">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <li key={idx}>- {item.name} (x{item.quantity})</li>
                        ))}
                        {order.items.length > 2 && <li>...</li>}
                      </ul>
                    </td>
                    <td className="fw-bold text-danger">{formatPrice(order.totalAmount)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/orders/${order._id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Xem chi tiết"
                        >
                          <FiEye />
                        </Link>
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                            title="Duyệt đơn"
                          >
                            <FiCheck />
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdateStatus(order._id, 'shipping')}
                            title="Giao hàng"
                          >
                            <FiTruck />
                          </button>
                        )}
                        {order.status === 'shipping' && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(order._id, 'delivered')}
                            title="Hoàn thành"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        {(order.status !== 'cancelled' && order.status !== 'delivered') && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(order._id)}
                            title="Hủy đơn"
                          >
                            <FiXCircle />
                          </button>
                        )}
                      </div>
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
    </main>
  )
}

export default Order