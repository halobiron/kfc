import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../userSlice';
import { getAllRoles } from '../../../Role/roleSlice';
import { FiMail, FiPhone, FiUsers, FiDollarSign, FiUserCheck, FiPackage, FiBell } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import StatCard from '../../../../components/Common/StatCard';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import { formatDate } from '../../../../utils/formatters';
import UserModal from './UserModal';
import './Users.css';

const ROLE_LABELS = {
    admin: { label: 'Quản trị viên', color: 'primary', icon: <FiUserCheck size={20} /> },
    cashier: { label: 'Thu ngân', color: 'success', icon: <FiDollarSign size={20} /> },
    receptionist: { label: 'Lễ tân', color: 'warning', icon: <FiBell size={20} /> },
    chef: { label: 'Đầu bếp', color: 'danger', icon: <MdRestaurant size={20} /> },
    warehouse: { label: 'Thủ kho', color: 'secondary', icon: <FiPackage size={20} /> },
    customer: { label: 'Khách hàng', color: 'info', icon: <FiUsers size={20} /> }
};

const Users = () => {
    const dispatch = useDispatch();
    const { users: usersList } = useSelector((state) => state.users);
    const { roles } = useSelector((state) => state.roles);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getAllRoles());
    }, [dispatch]);

    // Optimize stats calculation
    const stats = useMemo(() => {
        const counts = {
            admin: 0, cashier: 0, receptionist: 0, chef: 0, warehouse: 0, customer: 0
        };
        
        usersList.forEach(user => {
            if (user.isActive) {
                const roleName = user.role?.name || user.role || 'customer';
                if (counts[roleName] !== undefined) {
                    counts[roleName]++;
                }
            }
        });
        
        return counts;
    }, [usersList]);

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (formData, isEditMode) => {
        if (isEditMode) {
             if (formData.password === '') {
                const { password, ...dataWithoutPassword } = formData;
                dispatch(updateUser({ id: formData._id, data: dataWithoutPassword }));
            } else {
                dispatch(updateUser({ id: formData._id, data: formData }));
            }
        } else {
            dispatch(createUser(formData));
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

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center">
                <h1 className="page-title">Quản lý người dùng</h1>
                <AddButton onClick={() => handleOpenModal()} />
            </div>

            {/* Stats Overview */}
            <div className="row mb-4 g-3">
                {Object.keys(ROLE_LABELS).map(roleKey => (
                    <div className="col-md-2" key={roleKey}>
                        <StatCard
                            label={ROLE_LABELS[roleKey].label.replace('Quản trị viên', 'Quản trị')}
                            value={stats[roleKey]}
                            icon={ROLE_LABELS[roleKey].icon}
                            color={ROLE_LABELS[roleKey].color}
                        />
                    </div>
                ))}
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
                                            <div>
                                                <div className="fw-bold">{user.name}</div>
                                                <small className="text-muted">Tham gia: {formatDate(user.createdAt)}</small>
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
                                            <Badge
                                                variant={ROLE_LABELS[roleName]?.color || 'secondary'}
                                            >
                                                <span className="me-1">{ROLE_LABELS[roleName]?.icon || <FiUsers size={20} />}</span>
                                                {ROLE_LABELS[roleName]?.label || roleName}
                                            </Badge>
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
                                            <EditButton
                                                className="me-2"
                                                onClick={() => handleOpenModal(user)}
                                            />
                                            <DeleteButton
                                                onClick={() => handleDelete(user._id)}
                                                disabled={roleName === 'admin'}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <UserModal 
                show={showModal}
                onClose={handleCloseModal}
                user={selectedUser}
                roles={roles}
                onSubmit={handleSaveUser}
                roleLabels={ROLE_LABELS}
            />
        </>
    );
};

export default Users;
