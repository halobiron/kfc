
import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';

const Customers = () => {
    // Mock data for customers
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@gmail.com', role: 'Khách hàng', status: 'Active', phone: '0901234567' },
        { id: 2, name: 'Tran Thi B', email: 'tranthib@gmail.com', role: 'Nhân viên', status: 'Active', phone: '0912345678' },
        { id: 3, name: 'Le Van C', email: 'levanc@gmail.com', role: 'Quản lý', status: 'Active', phone: '0987654321' },
        { id: 4, name: 'Pham Thi D', email: 'phamthid@gmail.com', role: 'Đầu bếp', status: 'Inactive', phone: '0977889900' },
        { id: 5, name: 'Hoang Van E', email: 'hoangvane@gmail.com', role: 'Thủ kho', status: 'Active', phone: '0933445566' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');

    // Filter customers
    const filteredCustomers = customers.filter(customer => {
        const matchName = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = selectedRole === 'All' || customer.role === selectedRole;
        return matchName && matchRole;
    });

    const handleRoleChange = (id, newRole) => {
        const updatedCustomers = customers.map(c =>
            c.id === id ? { ...c, role: newRole } : c
        );
        setCustomers(updatedCustomers);
    };

    const handleStatusToggle = (id) => {
        const updatedCustomers = customers.map(c =>
            c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
        );
        setCustomers(updatedCustomers);
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="page-header">
                <h1 className="page-title">Quản lý khách hàng</h1>
            </div>

            {/* Filters */}
            {/* Filters */}
            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <div className="input-group-search">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            className="form-control form-control-search"
                            placeholder="Tìm kiếm khách hàng theo tên, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-control form-select-custom"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="All">Tất cả vai trò</option>
                        <option value="Khách hàng">Khách hàng</option>
                        <option value="Nhân viên">Nhân viên</option>
                        <option value="Quản lý">Quản lý</option>
                        <option value="Đầu bếp">Đầu bếp</option>
                        <option value="Thủ kho">Thủ kho</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-header">Danh sách người dùng</div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Thông tin khách hàng</th>
                                <th scope="col">Liên hệ</th>
                                <th scope="col">Vai trò</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>#{customer.id}</td>
                                        <td>
                                            {customer.name}
                                            <div className="small text-muted">{customer.email}</div>
                                        </td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <select
                                                className="form-control form-control-sm"
                                                value={customer.role}
                                                onChange={(e) => handleRoleChange(customer.id, e.target.value)}
                                                style={{ width: '130px' }}
                                            >
                                                <option value="Khách hàng">Khách hàng</option>
                                                <option value="Nhân viên">Nhân viên</option>
                                                <option value="Quản lý">Quản lý</option>
                                                <option value="Đầu bếp">Đầu bếp</option>
                                                <option value="Thủ kho">Thủ kho</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${customer.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleStatusToggle(customer.id)}
                                            >
                                                {customer.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-action btn-edit border-0 d-inline-flex align-items-center">
                                                <FiEdit2 style={{ marginRight: '4px' }} />
                                                Sửa
                                            </button>
                                            {customer.status === 'Active' ? (
                                                <button className="btn-action btn-delete border-0 d-inline-flex align-items-center" onClick={() => handleStatusToggle(customer.id)}>
                                                    <FiUserX style={{ marginRight: '4px' }} />
                                                    Khóa
                                                </button>
                                            ) : (
                                                <button className="btn-action btn-edit border-0 d-inline-flex align-items-center bg-success text-white" onClick={() => handleStatusToggle(customer.id)}>
                                                    <FiUserCheck style={{ marginRight: '4px' }} />
                                                    Mở
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Không tìm thấy khách hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Customers;
