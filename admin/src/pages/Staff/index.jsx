import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiShield, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import StatCard from '../../components/StatCard';
import './staff.css';

const Staff = () => {
  // Mock data - sẽ thay bằng Redux sau
  const [staffList, setStaffList] = useState([
    { 
      _id: '1', 
      name: 'Nguyễn Văn An', 
      email: 'admin@kfc.vn', 
      phone: '0901234567',
      role: 'admin', 
      isActive: true,
      createdAt: '2024-01-15'
    },
    { 
      _id: '2', 
      name: 'Trần Thị Bình', 
      email: 'binh.tran@kfc.vn', 
      phone: '0912345678',
      role: 'staff', 
      isActive: true,
      createdAt: '2024-02-20'
    },
    { 
      _id: '3', 
      name: 'Lê Văn Cường', 
      email: 'cuong.le@kfc.vn', 
      phone: '0923456789',
      role: 'chef', 
      isActive: true,
      createdAt: '2024-03-10'
    },
    { 
      _id: '4', 
      name: 'Phạm Thị Dung', 
      email: 'dung.pham@kfc.vn', 
      phone: '0934567890',
      role: 'staff', 
      isActive: true,
      createdAt: '2024-04-05'
    },
    { 
      _id: '5', 
      name: 'Hoàng Văn Em', 
      email: 'em.hoang@kfc.vn', 
      phone: '0945678901',
      role: 'chef', 
      isActive: false,
      createdAt: '2024-05-12'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
    isActive: true
  });

  const roleLabels = {
    admin: { label: 'Quản trị viên', color: 'danger', icon: <FiShield size={14} /> },
    staff: { label: 'Nhân viên', color: 'primary', icon: <FiUser size={14} /> },
    chef: { label: 'Đầu bếp', color: 'warning', icon: <FiUser size={14} /> }
  };

  const handleOpenModal = (staff = null) => {
    if (staff) {
      setEditMode(true);
      setCurrentStaff({ ...staff, password: '' });
    } else {
      setEditMode(false);
      setCurrentStaff({ name: '', email: '', phone: '', role: 'staff', password: '', isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentStaff({ name: '', email: '', phone: '', role: 'staff', password: '', isActive: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      setStaffList(staffList.map(staff => 
        staff._id === currentStaff._id ? { ...currentStaff, password: undefined } : staff
      ));
      alert('Cập nhật nhân viên thành công!');
    } else {
      const newStaff = {
        ...currentStaff,
        _id: String(staffList.length + 1),
        createdAt: new Date().toISOString().split('T')[0],
        password: undefined
      };
      setStaffList([...staffList, newStaff]);
      alert('Thêm nhân viên thành công!');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      setStaffList(staffList.filter(staff => staff._id !== id));
      alert('Xóa nhân viên thành công!');
    }
  };

  const handleToggleActive = (id) => {
    setStaffList(staffList.map(staff => 
      staff._id === id ? { ...staff, isActive: !staff.isActive } : staff
    ));
  };

  const getStaffCountByRole = (role) => {
    return staffList.filter(staff => staff.role === role && staff.isActive).length;
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="page-title">Quản lý Nhân viên & Phân quyền</h1>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <FiPlus size={20} /> Thêm nhân viên
          </button>
        </div>

        {/* Stats Overview */}
        <div className="row mb-4 g-3">
          <div className="col-md-3">
            <StatCard
              label="Tổng nhân viên"
              value={staffList.filter(s => s.isActive).length}
              icon={<FiUser size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Quản trị viên"
              value={getStaffCountByRole('admin')}
              icon={<FiShield size={24} />}
              color="danger"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Nhân viên"
              value={getStaffCountByRole('staff')}
              icon={<FiUser size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Đầu bếp"
              value={getStaffCountByRole('chef')}
              icon={<FiUser size={24} />}
              color="warning"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="card">
          <div className="card-header">Danh sách nhân viên</div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Họ và tên</th>
                  <th scope="col">Email</th>
                  <th scope="col">Số điện thoại</th>
                  <th scope="col" className="text-center">Vai trò</th>
                  <th scope="col" className="text-center">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr key={staff._id}>
                    <td className="ps-4 fw-bold">S{1000 + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-circle">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{staff.name}</div>
                          <small className="text-muted">Tham gia: {staff.createdAt}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <FiMail size={14} />
                        {staff.email}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <FiPhone size={14} />
                        {staff.phone}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge badge-${roleLabels[staff.role].color} role-badge`}>
                        <span className="me-1">{roleLabels[staff.role].icon}</span>
                        {roleLabels[staff.role].label}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={staff.isActive}
                          onChange={() => handleToggleActive(staff._id)}
                        />
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                        onClick={() => handleOpenModal(staff)}
                      >
                        <FiEdit2 style={{ marginRight: '4px' }} />
                        Sửa
                      </button>
                      <button
                        className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                        onClick={() => handleDelete(staff._id)}
                        disabled={staff.role === 'admin'}
                      >
                        <FiTrash2 style={{ marginRight: '4px' }} />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentStaff.name}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                      required
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      value={currentStaff.email}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
                      required
                      placeholder="email@kfc.vn"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      value={currentStaff.phone}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
                      required
                      placeholder="0901234567"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={currentStaff.role}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, role: e.target.value })}
                      required
                    >
                      <option value="staff">Nhân viên</option>
                      <option value="chef">Đầu bếp</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                    <small className="text-muted d-block mt-1">
                      {currentStaff.role === 'admin' && '• Toàn quyền quản lý hệ thống'}
                      {currentStaff.role === 'staff' && '• Xử lý đơn hàng, quản lý khách hàng'}
                      {currentStaff.role === 'chef' && '• Xem đơn hàng và cập nhật trạng thái chế biến'}
                    </small>
                  </div>
                  {!editMode && (
                    <div className="mb-3">
                      <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentStaff.password}
                        onChange={(e) => setCurrentStaff({ ...currentStaff, password: e.target.value })}
                        required={!editMode}
                        placeholder="Tối thiểu 6 ký tự"
                        minLength="6"
                      />
                    </div>
                  )}
                  {editMode && (
                    <div className="mb-3">
                      <label className="form-label">Đổi mật khẩu</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentStaff.password}
                        onChange={(e) => setCurrentStaff({ ...currentStaff, password: e.target.value })}
                        placeholder="Để trống nếu không đổi"
                        minLength="6"
                      />
                      <small className="text-muted">Chỉ nhập nếu muốn thay đổi mật khẩu</small>
                    </div>
                  )}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentStaff.isActive}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, isActive: e.target.checked })}
                      id="isActiveCheck"
                    />
                    <label className="form-check-label" htmlFor="isActiveCheck">
                      Kích hoạt tài khoản này
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;
