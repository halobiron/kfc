import React, { useState } from 'react';
import Layout from '../../components/Layout';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  
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

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    alert('Cập nhật thông tin thành công!');
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
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="container py-4">
          <h2>Tài khoản của tôi</h2>
          <div className="title-underline"></div>
          
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 mb-4">
              <div className="card profile-sidebar">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <div className="profile-avatar">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="mt-3 mb-1">{userInfo.name}</h5>
                    <small className="text-muted">{userInfo.email}</small>
                  </div>
                  <ul className="nav flex-column profile-nav">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                      >
                        <i className="bi bi-person me-2"></i>
                        Thông tin cá nhân
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'address' ? 'active' : ''}`}
                        onClick={() => setActiveTab('address')}
                      >
                        <i className="bi bi-geo-alt me-2"></i>
                        Địa chỉ giao hàng
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                      >
                        <i className="bi bi-lock me-2"></i>
                        Đổi mật khẩu
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <div className="card">
                <div className="card-body">
                  {/* Tab: Thông tin cá nhân */}
                  {activeTab === 'info' && (
                    <div className="profile-content">
                      <h4 className="mb-4">Thông tin cá nhân</h4>
                      <form onSubmit={handleUpdateInfo}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userInfo.name}
                              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={userInfo.phone}
                              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Ngày sinh</label>
                            <input
                              type="date"
                              className="form-control"
                              value={userInfo.birthdate}
                              onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-danger mt-3">
                          Lưu thay đổi
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Tab: Địa chỉ giao hàng */}
                  {activeTab === 'address' && (
                    <div className="profile-content">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Địa chỉ giao hàng</h4>
                        <button className="btn btn-outline-danger" onClick={handleAddAddress}>
                          <i className="bi bi-plus-circle me-2"></i>
                          Thêm địa chỉ
                        </button>
                      </div>
                      <div className="row">
                        {addresses.map(address => (
                          <div key={address.id} className="col-md-6 mb-3">
                            <div className={`address-card ${address.isDefault ? 'default' : ''}`}>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0">
                                  {address.label}
                                  {address.isDefault && (
                                    <span className="badge bg-danger ms-2">Mặc định</span>
                                  )}
                                </h6>
                                <div>
                                  <button
                                    className="btn btn-sm btn-link text-danger p-0 me-2"
                                    onClick={() => handleDeleteAddress(address.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                              <p className="text-muted mb-2">{address.fullAddress}</p>
                              {!address.isDefault && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Đặt làm mặc định
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab: Đổi mật khẩu */}
                  {activeTab === 'password' && (
                    <div className="profile-content">
                      <h4 className="mb-4">Đổi mật khẩu</h4>
                      <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu hiện tại</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu mới</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                            minLength="6"
                          />
                          <small className="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Xác nhận mật khẩu mới</label>
                          <input
                            type="password"
                            className="form-control"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                            minLength="6"
                          />
                        </div>
                        <button type="submit" className="btn btn-danger mt-3">
                          Đổi mật khẩu
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
