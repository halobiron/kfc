import React, { useState } from 'react';
import { toast } from 'react-toastify';

import './Profile.css';

const Profile = () => {
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

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="row mb-4 align-items-center">
          <div className="col-12">
            <h2 className="section-title text-uppercase mb-0 border-start border-4 border-danger ps-3">Quản lý hồ sơ</h2>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Personal Info AND Password */}
          <div className="col-lg-8">

            {/* Card 1: Personal Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white p-4 border-bottom-0 pb-0">
                <h5 className="card-title fw-bold mb-0">Thông tin cá nhân</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleUpdateInfo}>
                  <div className="row">
                    {/* Avatar Column */}
                    <div className="col-md-4 text-center mb-4 mb-md-0 d-flex flex-column align-items-center justify-content-center border-end-md">
                      <div className="profile-avatar mb-3">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <h6 className="fw-bold">{userInfo.name}</h6>
                      <p className="text-muted small text-break">{userInfo.email}</p>
                    </div>

                    {/* Form Column */}
                    <div className="col-md-8 ps-md-4">
                      <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Họ và tên</label>
                        <input
                          type="text"
                          className="form-control"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Số điện thoại</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          required
                          disabled
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase fw-bold">Ngày sinh</label>
                        <input
                          type="date"
                          className="form-control"
                          value={userInfo.birthdate}
                          onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                        />
                      </div>
                      <div className="text-end">
                        <button type="submit" className="btn btn-danger px-4">Lưu thông tin</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Card 2: Password Change */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white p-4 border-bottom-0 pb-0">
                <h5 className="card-title fw-bold mb-0">Đổi mật khẩu</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleChangePassword}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Xác nhận</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="col-12 text-end mt-3">
                      <button type="submit" className="btn btn-danger px-4">Cập nhật mật khẩu</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Address Book */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white p-4 d-flex justify-content-between align-items-center">
                <h5 className="card-title fw-bold mb-0">Sổ địa chỉ</h5>
                <button className="btn btn-sm btn-light text-danger rounded-circle" onClick={handleAddAddress} style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {addresses.map(address => (
                    <div key={address.id} className="list-group-item p-4 border-top-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0 text-dark">
                          {address.label}
                          {address.isDefault && <span className="badge bg-danger ms-2" style={{ fontWeight: 'normal', fontSize: '0.65rem' }}>Mặc định</span>}
                        </h6>
                        <div className="dropdown">
                          <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                            {!address.isDefault && (
                              <li><button className="dropdown-item small" onClick={() => handleSetDefaultAddress(address.id)}>Đặt làm mặc định</button></li>
                            )}
                            <li><button className="dropdown-item small text-danger" onClick={() => handleDeleteAddress(address.id)}>Xóa địa chỉ</button></li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-muted small mb-0">{address.fullAddress || 'Chưa cập nhật địa chỉ'}</p>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="p-4 text-center text-muted small">
                      Chưa có địa chỉ nào.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
