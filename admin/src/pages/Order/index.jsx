import React, { useEffect } from 'react'
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../redux/slices/orderSlice';

const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-warning">Chờ xác nhận</span>;
      case 'confirmed': return <span className="badge badge-info">Đã xác nhận</span>;
      case 'preparing': return <span className="badge badge-info text-dark">Đang chuẩn bị</span>;
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
                        <small className="text-muted">{order.deliveryInfo?.phone}</small>
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
                      <Link to={`/orders/${order._id}`} className="btn-action btn-edit text-decoration-none d-inline-flex align-items-center">
                        <FiEye style={{ marginRight: '4px' }} />
                        Xem
                      </Link>
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