
import React, { useState } from 'react';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import Button from '../../../../components/Common/Button';

const Customers = () => {
    // Mock data for customers
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@gmail.com', role: 'Khách hàng', status: 'Active', phone: '0901234567' },
        { id: 2, name: 'Tran Thi B', email: 'tranthib@gmail.com', role: 'Khách hàng', status: 'Active', phone: '0912345678' },
        { id: 3, name: 'Le Van C', email: 'levanc@gmail.com', role: 'Khách hàng', status: 'Active', phone: '0987654321' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // Filter customers
    const filteredCustomers = customers.filter(customer => {
        const matchName = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchName;
    });

    const handleStatusToggle = (id) => {
        const updatedCustomers = customers.map(c =>
            c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
        );
        setCustomers(updatedCustomers);
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Quản lý khách hàng</h1>
            </div>

            {/* Filters */}
            <div className="row g-3 mb-4">
                <div className="col-md-12">
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
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-header">Danh sách khách hàng</div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Thông tin khách hàng</th>
                                <th scope="col">Liên hệ</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="fw-bold">CUS{1000 + customer.id}</td>
                                        <td>
                                            {customer.name}
                                            <div className="small text-muted">{customer.email}</div>
                                        </td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <Badge
                                                variant={customer.status === 'Active' ? 'success' : 'danger'}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleStatusToggle(customer.id)}
                                            >
                                                {customer.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {customer.status === 'Active' ? (
                                                <Button size="sm" variant="outline-danger" onClick={() => handleStatusToggle(customer.id)}>
                                                    <FiUserX className="me-1" /> Khóa
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline-success" onClick={() => handleStatusToggle(customer.id)}>
                                                    <FiUserCheck className="me-1" /> Mở
                                                </Button>
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
        </>
    );
};

export default Customers;
