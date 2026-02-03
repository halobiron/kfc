import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../userSlice';
import { getAllRoles } from '../../../Role/roleSlice';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiUsers, FiDollarSign, FiUserCheck, FiPackage, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { MdRestaurant } from 'react-icons/md';
import StatCard from '../../../../components/StatCard';
import './users.css';

const Users = () => {
    const dispatch = useDispatch();
    const { users: usersList, loading } = useSelector((state) => state.users);
    const { roles } = useSelector((state) => state.roles);

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getAllRoles());
    }, [dispatch]);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        password: '',
        isActive: true
    });

    const roleLabels = {
        admin: { label: 'Quản trị viên', color: 'primary', icon: <FiUserCheck size={20} /> },
        cashier: { label: 'Thu ngân', color: 'success', icon: <FiDollarSign size={20} /> },
        receptionist: { label: 'Lễ tân', color: 'warning', icon: <FiBell size={20} /> },
        chef: { label: 'Đầu bếp', color: 'danger', icon: <MdRestaurant size={20} /> },
        warehouse: { label: 'Thủ kho', color: 'secondary', icon: <FiPackage size={20} /> },
        customer: { label: 'Khách hàng', color: 'info', icon: <FiUsers size={20} /> }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditMode(true);
            const roleName = user.role?.name || user.role || 'customer';
            setCurrentUser({ ...user, role: roleName, password: '' });
        } else {
            setEditMode(false);
            setCurrentUser({ name: '', email: '', phone: '', role: 'customer', password: '', isActive: true });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentUser({ name: '', email: '', phone: '', role: 'customer', password: '', isActive: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            if (currentUser.password === '') {
                // Removes password if empty so backend doesn't update it to empty string
                const { password, ...dataWithoutPassword } = currentUser;
                dispatch(updateUser({ id: currentUser._id, data: dataWithoutPassword }));
            } else {
                dispatch(updateUser({ id: currentUser._id, data: currentUser }));
            }
        } else {
            dispatch(createUser(currentUser));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            dispatch(deleteUser(id));
        }
    };

    const handleToggleActive = (id) => {
        const userToToggle = usersList.find(u => u._id === id);
        if (!userToToggle) return;

        const roleName = userToToggle.role?.name || userToToggle.role;

        if (roleName === 'admin') {
            alert("Không thể vô hiệu hóa tài khoản Quản trị viên!");
            return;
        }

        dispatch(updateUser({
            id: id,
            data: { isActive: !userToToggle.isActive }
        }));
    };

    const getUserCountByRole = (role) => {
        return usersList.filter(user => {
            const rName = user.role?.name || user.role;
            return rName === role && user.isActive;
        }).length;
    };

    return (
        <>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div className="page-header d-flex justify-content-between align-items-center">
                    <h1 className="page-title">Quản lý người dùng</h1>
                    <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => handleOpenModal()}
                    >
                        <FiPlus size={20} /> Thêm người dùng
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="row mb-4 g-3">
                    <div className="col-md-2">
                        <StatCard
                            label="Quản trị"
                            value={getUserCountByRole('admin')}
                            icon={roleLabels.admin.icon}
                            color={roleLabels.admin.color}
                        />
                    </div>
                    <div className="col-md-2">
                        <StatCard
                            label="Thu ngân"
                            value={getUserCountByRole('cashier')}
                            icon={roleLabels.cashier.icon}
                            color={roleLabels.cashier.color}
                        />
                    </div>
                    <div className="col-md-2">
                        <StatCard
                            label="Lễ tân"
                            value={getUserCountByRole('receptionist')}
                            icon={roleLabels.receptionist.icon}
                            color={roleLabels.receptionist.color}
                        />
                    </div>
                    <div className="col-md-2">
                        <StatCard
                            label="Đầu bếp"
                            value={getUserCountByRole('chef')}
                            icon={roleLabels.chef.icon}
                            color={roleLabels.chef.color}
                        />
                    </div>
                    <div className="col-md-2">
                        <StatCard
                            label="Thủ kho"
                            value={getUserCountByRole('warehouse')}
                            icon={roleLabels.warehouse.icon}
                            color={roleLabels.warehouse.color}
                        />
                    </div>
                    <div className="col-md-2">
                        <StatCard
                            label="Khách hàng"
                            value={getUserCountByRole('customer')}
                            icon={roleLabels.customer.icon}
                            color={roleLabels.customer.color}
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="card">
                    <div className="card-header">Danh sách người dùng</div>
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
                                {usersList.map((user, index) => {
                                    const roleName = user.role?.name || user.role || 'customer';
                                    return (
                                        <tr key={user._id}>
                                            <td className="ps-4 fw-bold">USR{1000 + index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar-circle">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{user.name}</div>
                                                        <small className="text-muted">Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 text-muted">
                                                    <FiMail size={14} />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 text-muted">
                                                    <FiPhone size={14} />
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge badge-${roleLabels[roleName]?.color || 'secondary'} role-badge`}>
                                                    <span className="me-1">{roleLabels[roleName]?.icon || <FiUsers size={20} />}</span>
                                                    {roleLabels[roleName]?.label || roleName}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="form-check form-switch d-flex justify-content-center">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={user.isActive}
                                                        onChange={() => handleToggleActive(user._id)}
                                                        disabled={roleName === 'admin'}
                                                        title={roleName === 'admin' ? "Không thể vô hiệu hóa Quản trị viên" : ""}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button
                                                    className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                                                    onClick={() => handleOpenModal(user)}
                                                >
                                                    <FiEdit2 style={{ marginRight: '4px' }} />
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={roleName === 'admin'}
                                                >
                                                    <FiTrash2 style={{ marginRight: '4px' }} />
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
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
                                    {editMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
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
                                            value={currentUser.name}
                                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                            required
                                            placeholder="VD: Nguyễn Văn A"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={currentUser.email}
                                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                            required
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={currentUser.phone}
                                            onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                            required
                                            placeholder="0901234567"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Vai trò <span className="text-danger">*</span></label>
                                        <select
                                            className="form-select"
                                            value={currentUser.role}
                                            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                            required
                                        >
                                            {roles && roles.length > 0 ? (
                                                roles.map(role => (
                                                    <option key={role._id} value={role.name}>{role.name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="customer">customer</option>
                                                    <option value="admin">admin</option>
                                                </>
                                            )}
                                        </select>
                                        <small className="text-muted d-block mt-1">
                                            {roles?.find(r => r.name === currentUser.role)?.description ||
                                                (roleLabels[currentUser.role]?.label ? `Vai trò: ${roleLabels[currentUser.role]?.label}` : '')}
                                        </small>
                                    </div>
                                    {!editMode && (
                                        <div className="mb-3">
                                            <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={currentUser.password}
                                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
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
                                                value={currentUser.password}
                                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
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
                                            checked={currentUser.isActive}
                                            onChange={(e) => setCurrentUser({ ...currentUser, isActive: e.target.checked })}
                                            id="isActiveCheck"
                                            disabled={currentUser.role === 'admin'}
                                        />
                                        <label className="form-check-label" htmlFor="isActiveCheck">
                                            {currentUser.role === 'admin' ? 'Tài khoản Quản trị viên luôn hoạt động' : 'Kích hoạt tài khoản này'}
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

export default Users;
