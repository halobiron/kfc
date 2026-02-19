import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../userSlice';
import { getAllRoles } from '../../../Role/roleSlice';
import { FiMail, FiPhone, FiUsers, FiDollarSign, FiUserCheck, FiPackage, FiBell } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import StatCard from '../../../../components/Common/StatCard';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import Table from '../../../../components/Common/Table';
import { formatDate } from '../../../../utils/formatters';
import UserModal from './UserModal';
import './Users.css';

const ROLE_LABELS = {
    'Quản trị viên': { label: 'Quản trị viên', color: 'primary', icon: <FiUserCheck size={20} /> },
    'Thu ngân': { label: 'Thu ngân', color: 'success', icon: <FiDollarSign size={20} /> },
    'Lễ tân': { label: 'Lễ tân', color: 'warning', icon: <FiBell size={20} /> },
    'Đầu bếp': { label: 'Đầu bếp', color: 'danger', icon: <MdRestaurant size={20} /> },
    'Thủ kho': { label: 'Thủ kho', color: 'secondary', icon: <FiPackage size={20} /> },
    'Khách hàng': { label: 'Khách hàng', color: 'info', icon: <FiUsers size={20} /> }
};

const Users = () => {
    const dispatch = useDispatch();
    const { users: usersList, loading } = useSelector((state) => state.users);
    const { roles } = useSelector((state) => state.roles);
    const { keyword } = useSelector(state => state.search);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getAllRoles());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        const searchLower = (keyword || '').toLowerCase();
        return usersList.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower)) ||
            (user.phone && user.phone.includes(keyword))
        );
    }, [usersList, keyword]);

    // Thống kê đơn giản
    const stats = useMemo(() => {
        const counts = {};
        usersList.forEach(user => {
            const name = user.role?.name || 'Khách hàng';
            counts[name] = (counts[name] || 0) + 1;
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
            dispatch(updateUser({ id: formData._id, data: formData }));
        } else {
            dispatch(createUser(formData));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Xóa người dùng này?')) dispatch(deleteUser(id));
    };

    const handleToggleActive = (id) => {
        const user = usersList.find(u => u._id === id);
        if (user?.role?.code === 'ADMIN') return alert("Không thể chặn Admin");
        dispatch(updateUser({ id, data: { isActive: !user.isActive } }));
    };

    const columns = [
        { header: '#', render: (_, index) => index + 1 },
        {
            header: 'Họ và tên',
            render: (user) => (
                <div>
                    <div className="fw-bold">{user.name}</div>
                    <small className="text-muted">{formatDate(user.createdAt)}</small>
                </div>
            )
        },
        { header: 'Email', render: (u) => u.email },
        { header: 'Số điện thoại', render: (u) => u.phone },
        {
            header: 'Vai trò',
            className: 'text-center',
            render: (user) => {
                const name = user.role?.name || 'Khách hàng';
                const style = ROLE_LABELS[name] || ROLE_LABELS['Khách hàng'];
                return (
                    <Badge variant={style.color}>
                        {style.icon} <span className="ms-1">{name}</span>
                    </Badge>
                );
            }
        },
        {
            header: 'Trạng thái',
            className: 'text-center',
            render: (user) => (
                <div className="form-check form-switch d-flex justify-content-center">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={user.isActive}
                        onChange={() => handleToggleActive(user._id)}
                        disabled={user.role?.code === 'ADMIN'}
                    />
                </div>
            )
        },
        {
            header: 'Thao tác',
            className: 'text-end pe-4',
            render: (user) => (
                <>
                    <EditButton className="me-2" onClick={() => handleOpenModal(user)} />
                    <DeleteButton
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role?.code === 'ADMIN'}
                    />
                </>
            )
        }
    ];

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
                <Table
                    columns={columns}
                    data={filteredUsers}
                    loading={loading}
                />
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
