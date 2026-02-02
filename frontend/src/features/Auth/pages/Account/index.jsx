import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserSuccess } from '../../authSlice';
import axiosClient from '../../../../api/axiosClient';
import CustomSelect from '../../../../components/CustomSelect';
import './Account.css';

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('orders');

    // User profile state
    const [userInfo, setUserInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthdate: user?.birthdate || ''
    });

    const [addresses, setAddresses] = useState([]);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        label: '',
        fullAddress: '',
        isDefault: false,
        latitude: null,
        longitude: null
    });
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

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

    const statusOptions = [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'pending', label: 'Chờ xác nhận' },
        { value: 'confirmed', label: 'Đã xác nhận' },
        { value: 'preparing', label: 'Đang chuẩn bị' },
        { value: 'ready', label: 'Sẵn sàng giao' },
        { value: 'shipping', label: 'Đang giao hàng' },
        { value: 'delivered', label: 'Hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

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
        } else {
            fetchProfile();
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
                (order.orderNumber || order._id).toLowerCase().includes(lowerTerm) ||
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
            toast.error('Không thể tải đơn hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            setLoadingAddresses(true);
            const response = await axiosClient.get('/users/profile');
            if (response.data?.status) {
                const userData = response.data.data;
                setAddresses(userData.addresses || []);
                setUserInfo({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    birthdate: userData.birthdate ? userData.birthdate.split('T')[0] : ''
                });
            }
        } catch (error) {
            toast.error('Không thể tải thông tin người dùng. Vui lòng thử lại.');
        } finally {
            setLoadingAddresses(false);
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
            toast.success(`Đơn hàng #${orderToCancel.orderNumber || orderToCancel._id} đã được hủy thành công.`);
            setOrderToCancel(null);
            setCancelReason('');
            fetchOrders();
        } catch (error) {
            toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
        }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.put('/users/profile/update', {
                name: userInfo.name,
                phone: userInfo.phone,
                birthdate: userInfo.birthdate
            });

            if (response.data?.status) {
                toast.success('Cập nhật thông tin thành công!');
                dispatch(updateUserSuccess(response.data.data));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin.');
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setAddressForm({ label: '', fullAddress: '', isDefault: false, latitude: null, longitude: null });
        setShowAddressForm(true);
    };

    const handleEditAddress = (address, idx) => {
        setEditingAddress(idx);
        setAddressForm({
            label: address.label || '',
            fullAddress: address.fullAddress || '',
            isDefault: address.isDefault || false,
            latitude: address.latitude || null,
            longitude: address.longitude || null
        });
        setShowAddressForm(true);
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Trình duyệt không hỗ trợ Geolocation');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Cập nhật tọa độ ngay lập tức
                setAddressForm(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));

                try {
                    // Reverse Geocoding sử dụng OpenStreetMap Nominatim API (Miễn phí)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();

                    if (data && data.display_name) {
                        setAddressForm(prev => ({
                            ...prev,
                            fullAddress: data.display_name,
                            latitude,
                            longitude
                        }));
                        toast.success('Đã lấy được địa chỉ!');
                    } else {
                        toast.warning('Lấy được tọa độ nhưng không tìm thấy tên đường.');
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    toast.warning('Không thể lấy tên đường (Lỗi mạng hoặc API).');
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error('Không thể lấy vị trí của bạn. Hãy kiểm tra quyền truy cập.');
                setGettingLocation(false);
            }
        );
    };

    const handleSaveAddress = async () => {
        try {
            if (!addressForm.label.trim() || !addressForm.fullAddress.trim()) {
                toast.error('Vui lòng nhập đầy đủ tên và địa chỉ');
                return;
            }

            const addressData = {
                label: addressForm.label,
                fullAddress: addressForm.fullAddress,
                isDefault: addressForm.isDefault,
                latitude: addressForm.latitude,
                longitude: addressForm.longitude
            };

            if (editingAddress !== null) {
                const response = await axiosClient.put(`/users/address/update/${editingAddress}`, addressData);
                if (response.data?.status) {
                    toast.success('Cập nhật địa chỉ thành công!');
                    setShowAddressForm(false);
                    fetchProfile();
                }
            } else {
                const response = await axiosClient.post('/users/address/add', {
                    ...addressData,
                    isDefault: addressForm.isDefault || addresses.length === 0
                });
                if (response.data?.status) {
                    toast.success('Thêm địa chỉ thành công!');
                    setShowAddressForm(false);
                    fetchProfile();
                }
            }
        } catch (error) {
            toast.error('Không thể lưu địa chỉ. Vui lòng thử lại.');
        }
    };

    const handleSetDefaultAddress = async (idx) => {
        try {
            const address = addresses[idx];
            const response = await axiosClient.put(`/users/address/update/${idx}`, {
                label: address.label,
                fullAddress: address.fullAddress,
                isDefault: true,
                latitude: address.latitude,
                longitude: address.longitude
            });
            if (response.data?.status) {
                toast.success('Cập nhật địa chỉ mặc định thành công!');
                fetchProfile();
            }
        } catch (error) {
            toast.error('Không thể cập nhật địa chỉ mặc định.');
        }
    };

    const handleDeleteAddress = async (idx) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                const response = await axiosClient.delete(`/users/address/delete/${idx}`);
                if (response.data?.status) {
                    toast.success('Xóa địa chỉ thành công!');
                    fetchProfile();
                }
            } catch (error) {
                toast.error('Không thể xóa địa chỉ. Vui lòng thử lại.');
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await axiosClient.post('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            if (response.data?.status) {
                toast.success('Đổi mật khẩu thành công!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu.');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Đăng xuất thành công!');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusLabel = (status) => {
        const statuses = {
            'pending': { text: 'Chờ xác nhận', color: '#ffc107', icon: 'bi-clock' },
            'confirmed': { text: 'Đã xác nhận', color: '#007bff', icon: 'bi-check2-circle' },
            'preparing': { text: 'Đang chuẩn bị', color: '#17a2b8', icon: 'bi-egg-fried' },
            'shipping': { text: 'Đang giao hàng', color: '#fd7e14', icon: 'bi-truck' },
            'ready': { text: 'Sẵn sàng giao', color: '#28a745', icon: 'bi-check-circle' },
            'delivered': { text: 'Đã giao hàng', color: '#28a745', icon: 'bi-check-all' },
            'cancelled': { text: 'Đã hủy', color: '#dc3545', icon: 'bi-x-circle' }
        };
        return statuses[status] || { text: status, color: '#6c757d', icon: 'bi-question-circle' };
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
                                            <CustomSelect
                                                className="w-100"
                                                options={statusOptions}
                                                value={filterStatus}
                                                onChange={setFilterStatus}
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
                                    <div className="empty-bucket">
                                        <div>
                                            <h2>Bắt đầu đặt món!</h2>
                                            <p>Bạn chưa có đơn hàng nào</p>
                                            <button
                                                className="btn btn-danger start-ordering-btn"
                                                onClick={() => navigate('/products')}
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
                                                        <h5 title={order.orderNumber || order._id}>Đơn hàng {order.orderNumber || order._id}</h5>
                                                        <span className="order-date">
                                                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <span className={`order-status status-${order.status}`}>
                                                        {order.status === 'pending' ? 'Đang chờ xử lý' :
                                                            order.status === 'confirmed' ? 'Đã xác nhận' :
                                                                order.status === 'preparing' ? 'Đang chuẩn bị' :
                                                                    order.status === 'ready' ? 'Sẵn sàng giao' :
                                                                        order.status === 'shipping' ? 'Đang giao hàng' :
                                                                            order.status === 'delivered' ? 'Hoàn thành' :
                                                                                order.status === 'cancelled' ? 'Đã hủy' : order.status}
                                                    </span>
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

                                {loadingAddresses ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-danger" role="status">
                                            <span className="visually-hidden">Đang tải...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="addresses-list">
                                        {addresses && addresses.length > 0 ? (
                                            addresses.map((address, idx) => (
                                                <div key={idx} className="address-card">
                                                    <div className="address-header">
                                                        <h5>
                                                            {address.label}
                                                            {address.isDefault && <span className="badge-default">Mặc định</span>}
                                                        </h5>
                                                        <div className="address-actions">
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => handleEditAddress(address, idx)}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            {!address.isDefault && (
                                                                <button
                                                                    className="btn-default"
                                                                    onClick={() => handleSetDefaultAddress(idx)}
                                                                    title="Đặt làm mặc định"
                                                                >
                                                                    Đặt làm mặc định
                                                                </button>
                                                            )}
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteAddress(idx)}
                                                                title="Xóa"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="address-text">{address.fullAddress}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-addresses">
                                                <i className="bi bi-geo-alt" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                                                <p>Chưa có địa chỉ nào.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal Thêm/Sửa Địa Chỉ */}
            {showAddressForm && (
                <div className="address-modal-overlay" onClick={() => setShowAddressForm(false)}>
                    <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="address-modal-header">
                            <h5>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}</h5>
                            <button className="btn-close-modal" onClick={() => setShowAddressForm(false)}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="address-modal-body">
                            <div className="form-group">
                                <label>Tên địa chỉ <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    placeholder="VD: Nhà, Công ty, Nhà bạn..."
                                    value={addressForm.label}
                                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div className="label-with-button">
                                    <label>Địa chỉ đầy đủ <span className="text-danger">*</span></label>
                                    <button
                                        type="button"
                                        className="btn-get-location"
                                        onClick={handleGetCurrentLocation}
                                        disabled={gettingLocation}
                                        title="Lấy vị trí hiện tại"
                                    >
                                        {gettingLocation ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Đang lấy...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-geo-alt"></i> Lấy vị trí
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    placeholder="Nhập địa chỉ chi tiết (đường, quận, thành phố...)"
                                    rows="3"
                                    value={addressForm.fullAddress}
                                    onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            {(addressForm.latitude || addressForm.longitude) && (
                                <div className="location-info">
                                    <small>
                                        <i className="bi bi-pin-fill"></i> Tọa độ: {addressForm.latitude?.toFixed(4)}, {addressForm.longitude?.toFixed(4)}
                                    </small>
                                </div>
                            )}

                            <div className="form-group form-check">
                                <input
                                    type="checkbox"
                                    id="addressDefault"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                />
                                <label htmlFor="addressDefault">Đặt làm địa chỉ mặc định</label>
                            </div>
                        </div>
                        <div className="address-modal-footer">
                            <button className="btn btn-outline-secondary" onClick={() => setShowAddressForm(false)}>
                                Hủy
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveAddress}>
                                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h5>Chi tiết đơn hàng #{selectedOrder.orderNumber || selectedOrder._id}</h5>
                            <button className="btn-close-custom" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        <div className="order-modal-body">
                            <div className="detail-grid">
                                <div className="detail-card">
                                    <span>Trạng thái</span>
                                    <span
                                        className="order-status"
                                        style={{
                                            backgroundColor: getStatusLabel(selectedOrder.status).color,
                                            color: '#fff',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {getStatusLabel(selectedOrder.status).text}
                                    </span>
                                </div>
                                <div className="detail-card">
                                    <span>Thời gian đặt</span>
                                    <p>{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
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
                                <span className="total-amount">{formatCurrency(selectedOrder.totalAmount)}</span>
                            </div>

                            {/* Timeline Section */}
                            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                                <div className="timeline-section">
                                    <h6 className="mb-3 fw-bold text-uppercase text-secondary" style={{ fontSize: '0.9rem' }}>Lịch sử trạng thái</h6>
                                    <ul className="timeline">
                                        {[...selectedOrder.statusHistory]
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map((history, index) => {
                                                const statusInfo = getStatusLabel(history.status);
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
                                                        <div className="timeline-status" style={{ color: isLatest ? statusInfo.color : '#333' }}>
                                                            {statusInfo.text}
                                                        </div>
                                                        {history.note && <div className="timeline-note">{history.note}</div>}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            )}
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
                            <p>Đơn hàng: #{orderToCancel.orderNumber || orderToCancel._id} - Tổng tiền: {formatCurrency(orderToCancel.totalAmount)}</p>
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
                                    rows="3"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="order-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setOrderToCancel(null)}>Đóng</button>
                            <button className="btn btn-danger" onClick={confirmCancelOrder}>Xác nhận hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
