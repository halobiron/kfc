
import React, { useState } from 'react';
import { FiCalendar, FiDownload, FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const Reports = () => {
    const [dateRange, setDateRange] = useState('month');

    // Mock statistics data
    const stats = [
        {
            label: 'Tổng doanh thu',
            value: '1.250.000.000 đ',
            icon: <FiDollarSign size={24} />,
            trend: '+12.5%',
            color: 'primary'
        },
        {
            label: 'Đơn hàng',
            value: '3,450',
            icon: <FiShoppingBag size={24} />,
            trend: '+5.2%',
            color: 'success'
        },
        {
            label: 'Khách hàng mới',
            value: '890',
            icon: <FiUsers size={24} />,
            trend: '+28.4%',
            color: 'warning'
        },
        {
            label: 'Trung bình đơn',
            value: '362.000 đ',
            icon: <FiTrendingUp size={24} />,
            trend: '-2.1%',
            color: 'info'
        }
    ];

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
                <h1 className="page-title">Báo cáo & Thống kê</h1>
                <div className="d-flex gap-3 align-items-center mt-3 mt-md-0">
                    <div className="btn-group border rounded overflow-hidden">
                        <button
                            className={`btn btn-sm ${dateRange === 'week' ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setDateRange('week')}
                        >
                            Tuần
                        </button>
                        <button
                            className={`btn btn-sm ${dateRange === 'month' ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setDateRange('month')}
                        >
                            Tháng
                        </button>
                        <button
                            className={`btn btn-sm ${dateRange === 'year' ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => setDateRange('year')}
                        >
                            Năm
                        </button>
                    </div>
                    <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
                        <FiDownload /> Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4 g-4">
                {stats.map((stat, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className={`p-2 rounded bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`badge ${stat.trend.startsWith('+') ? 'badge-success' : 'badge-danger'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <h3 className="stats-card-value mb-1">{stat.value}</h3>
                                <p className="text-muted mb-0 font-weight-bold text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Biểu đồ doanh thu</h5>
                            <select className="form-select form-control" style={{ width: 'auto' }}>
                                <option>Tháng này</option>
                                <option>Quý trước</option>
                            </select>
                        </div>
                        <div className="card-body">
                            <div className="bg-light d-flex align-items-center justify-content-center text-muted rounded" style={{ height: '300px' }}>
                                <div className="text-center">
                                    <FiTrendingUp size={48} className="mb-3 opacity-50" />
                                    <p>Biểu đồ doanh thu thị trường (Placeholder)</p>
                                    <small>Chart.js hoặc Recharts sẽ được tích hợp tại đây</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products & Recent Orders */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header">Sản phẩm bán chạy</div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col" className="text-end">Đã bán</th>
                                        <th scope="col" className="text-end">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Combo Gà Rán (2 miếng)', sold: 1245, revenue: '105.825.000 đ' },
                                        { name: 'Burger Tôm', sold: 850, revenue: '59.500.000 đ' },
                                        { name: 'Cơm Gà Giòn Cay', sold: 620, revenue: '31.000.000 đ' },
                                        { name: 'Khoai tây chiên (L)', sold: 2100, revenue: '84.000.000 đ' },
                                        { name: 'Pepsi (L)', sold: 3400, revenue: '68.000.000 đ' }
                                    ].map((product, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-bold">{product.name}</td>
                                            <td className="text-end">{product.sold}</td>
                                            <td className="text-end fw-bold text-danger">{product.revenue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0">
                            <h5 className="mb-0 fw-bold">Tổng quan theo danh mục</h5>
                        </div>
                        <div className="card-body">
                            <div className="bg-light d-flex align-items-center justify-content-center text-muted rounded h-100" style={{ minHeight: '200px' }}>
                                <div className="text-center">
                                    <FiShoppingBag size={48} className="mb-3 opacity-50" />
                                    <p>Biểu đồ tròn tỉ lệ danh mục (Placeholder)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Reports;
