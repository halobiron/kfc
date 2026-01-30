import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './Account.css';

const Account = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'

    // User profile state
    const [userInfo, setUserInfo] = useState({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        birthdate: '1990-01-01'
    });

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: 'Nhà riêng',
            fullAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
            isDefault: true
        },
        {
            id: 2,
            label: 'Công ty',
            fullAddress: '456 Đường DEF, Phường GHI, Quận 3, TP.HCM',
            isDefault: false
        }
    ]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Orders state
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(true);

    const statusOptions = ['All', 'Đang chuẩn bị', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

    const cancellationReasons = [
        "Tôi muốn đổi món khác",
        "Tôi nhập sai địa chỉ",
        "Tôi muốn đổi phương thức thanh toán",
        "Thời gian chờ quá lâu",
        "Tôi không muốn đặt nữa"
    ];

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    useEffect(() => {
        let result = orders;
        if (filterStatus !== 'All') {
            result = result.filter(order => order.status === filterStatus);
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(order =>
                order._id.toLowerCase().includes(lowerTerm) ||
                order.items.some(item => item.name.toLowerCase().includes(lowerTerm))
            );
        }
        setFilteredOrders(result);
    }, [searchTerm, filterStatus, orders]);

    const fetchOrders = async () => {
        try {
            const response = await axiosClient.get('/user/orders');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
            toast.error('Không thể tải đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (order) => {
        setOrderToCancel(order);
    };

    const confirmCancelOrder = async () => {
        try {
            await axiosClient.post(`/order/${orderToCancel._id}/cancel`, {
                reason: cancelReason
            });
            toast.success(`Đơn hàng #${orderToCancel._id} đã được hủy thành công.`);
            setOrderToCancel(null);
            setCancelReason('');
            fetchOrders();
        } catch (error) {
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
    };

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        toast.success('Cập nhật thông tin thành công!');
    };

    const handleAddAddress = () => {
        const newAddress = {
            id: addresses.length + 1,
            label: 'Địa chỉ mới',
            fullAddress: '',
            isDefault: false
        };
        setAddresses([...addresses, newAddress]);
    };

    const handleSetDefaultAddress = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const handleDeleteAddress = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            setAddresses(addresses.filter(addr => addr.id !== id));
            toast.success('Đã xóa địa chỉ');
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        toast.success('Đổi mật khẩu thành công!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        toast.success('Đăng xuất thành công!');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="my-account-page">
            <section className="container page-wrapper">
                <div className="page-block">
                    {/* Left Sidebar */}
                    <div className="block-left appear-left">
                        <div className="account-left page-with-bar medium-bar">
                            <div className="account-profile">
                                <img 
                                    src="https://static.kfcvietnam.com.vn/images/web/profile-circle.png?v=5.0" 
                                    alt="Profile" 
                                    className="profile-avatar-img"
                                />
                                <div>
                                    <h2>{userInfo.name}</h2>
                                    <a href="#logout" className="link-underline" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                        Đăng xuất
                                    </a>
                                </div>
                            </div>
                            <ul>
                                <li className={activeTab === 'orders' ? 'active' : ''}>
                                    <a href="#orders" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>
                                        Các đơn hàng đã đặt
                                    </a>
                                </li>
                                <li className={activeTab === 'profile' ? 'active' : ''}>
                                    <a href="#profile" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
                                        Quản lý hồ sơ
                                    </a>
                                </li>
                                <li className={activeTab === 'addresses' ? 'active' : ''}>
                                    <a href="#addresses" onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }}>
                                        Sổ địa chỉ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="block-right appear-right">
                        {activeTab === 'orders' && (
                            <div className="orders-content">
                                <h3>Các đơn hàng đã đặt</h3>

                                {/* Search and Filter */}
                                {orders.length > 0 && (
                                    <div className="search-filter-section">
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                placeholder="Tìm theo Mã đơn hàng hoặc Tên món..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="filter-box">
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status === 'All' ? 'Tất cả trạng thái' : status}
                                                    </option>
                                                ))}
                                            </select>
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
                                    <div className="empty-bucket">
                                        <div>
                                            <h2>Bắt đầu đặt món!</h2>
                                            <p>Bạn chưa có đơn hàng nào</p>
                                            <button 
                                                  className="btn btn-danger start-ordering-btn"
                                                  onClick={() => navigate('/menu')}
                                              >
                                                  Bắt đầu đặt hàng
                                              </button>
                                        </div>
                                    </div>
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
                                                        <h5>Đơn hàng {order._id}</h5>
                                                        <span className="order-date">{order.date}</span>
                                                    </div>
                                                    <span className={`order-status status-${order.statusClass}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="order-body">
                                                    <div className="order-items">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="order-item">
                                                                <div>
                                                                    <span>{item.name}</span>
                                                                    <span className="quantity">x{item.quantity}</span>
                                                                </div>
                                                                <span className="price">{formatCurrency(item.price)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="order-total">
                                                        <span>Tổng cộng:</span>
                                                        <span className="total-value">{formatCurrency(order.total)}</span>
                                                    </div>
                                                </div>
                                                <div className="order-actions">
                                                    <button
                                                        className="btn btn-view"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                    {order.canCancel && (
                                                        <button
                                                            className="btn btn-cancel"
                                                            onClick={() => handleCancelOrder(order)}
                                                        >
                                                            Hủy đơn
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="profile-content">
                                <h3>Quản lý hồ sơ</h3>
                                
                                <div className="profile-section">
                                    <h4>Thông tin cá nhân</h4>
                                    <form onSubmit={handleUpdateInfo}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Họ và tên</label>
                                                <input
                                                    type="text"
                                                    value={userInfo.name}
                                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Số điện thoại</label>
                                                <input
                                                    type="tel"
                                                    value={userInfo.phone}
                                                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    value={userInfo.email}
                                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                                    disabled
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Ngày sinh</label>
                                                <input
                                                    type="date"
                                                    value={userInfo.birthdate}
                                                    onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Lưu thông tin</button>
                                    </form>
                                </div>

                                <div className="profile-section">
                                    <h4>Đổi mật khẩu</h4>
                                    <form onSubmit={handleChangePassword}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Mật khẩu hiện tại</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    required
                                                    minLength="6"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Xác nhận mật khẩu</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    required
                                                    minLength="6"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Cập nhật mật khẩu</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="addresses-content">
                                <div className="addresses-header">
                                    <h3>Sổ địa chỉ</h3>
                                    <button className="btn btn-add-address" onClick={handleAddAddress}>
                                        <i className="bi bi-plus-lg"></i> Thêm địa chỉ
                                    </button>
                                </div>

                                <div className="addresses-list">
                                    {addresses.map(address => (
                                        <div key={address.id} className="address-card">
                                            <div className="address-header">
                                                <h5>
                                                    {address.label}
                                                    {address.isDefault && <span className="badge-default">Mặc định</span>}
                                                </h5>
                                                <div className="address-actions">
                                                    {!address.isDefault && (
                                                        <button onClick={() => handleSetDefaultAddress(address.id)}>
                                                            Đặt làm mặc định
                                                        </button>
                                                    )}
                                                    <button className="btn-delete" onClick={() => handleDeleteAddress(address.id)}>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="address-text">{address.fullAddress || 'Chưa cập nhật địa chỉ'}</p>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="empty-addresses">
                                            <p>Chưa có địa chỉ nào.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h5>Chi tiết đơn hàng #{selectedOrder._id}</h5>
                            <button className="btn-close-custom" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div className="order-modal-body">
                            <div className="detail-grid">
                                <div className="detail-card">
                                    <span>Trạng thái</span>
                                    <span className={`order-status status-${selectedOrder.statusClass}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="detail-card">
                                    <span>Thời gian đặt</span>
                                    <p>{selectedOrder.date}</p>
                                </div>
                            </div>
                            <div className="items-section">
                                <h6>Danh sách món</h6>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="detail-item">
                                        <div>
                                            <span>{item.name}</span>
                                            <span className="quantity">x{item.quantity}</span>
                                        </div>
                                        <span className="price">{formatCurrency(item.price)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-total">
                                <span>Tổng thanh toán</span>
                                <span className="total-amount">{formatCurrency(selectedOrder.total)}</span>
                            </div>
                        </div>
                        <div className="order-modal-footer">
                            <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>ĐÓNG</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Hủy Đơn Hàng */}
            {orderToCancel && (
                <div className="order-modal-overlay" onClick={() => setOrderToCancel(null)}>
                    <div className="order-modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h5>Hủy Đơn Hàng</h5>
                            <button className="btn-close-custom" onClick={() => setOrderToCancel(null)}>×</button>
                        </div>
                        <div className="order-modal-body">
                            <h6>Bạn có chắc chắn muốn hủy đơn hàng này?</h6>
                            <p>Đơn hàng: #{orderToCancel._id} - Tổng tiền: {formatCurrency(orderToCancel.total)}</p>
                            <div className="reason-section">
                                <label>Lý do hủy đơn (Không bắt buộc)</label>
                                {cancellationReasons.map((reason, index) => (
                                    <div key={index} className="reason-item">
                                        <input
                                            type="radio"
                                            name="cancelReason"
                                            id={`reason-${index}`}
                                            value={reason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                        />
                                        <label htmlFor={`reason-${index}`}>{reason}</label>
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Lý do khác..."
                                    rows="2"
                                    value={cancelReason && !cancellationReasons.includes(cancelReason) ? cancelReason : ''}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="order-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setOrderToCancel(null)}>
                                Quay lại
                            </button>
                            <button className="btn btn-danger" onClick={confirmCancelOrder}>
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
