import React, { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiDownload, FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import StatCard from '../../../../components/Common/StatCard';
import Button from '../../../../components/Common/Button';
import statsApi from '../../../../api/statsApi';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../../../utils/formatters';

const TIME_RANGES = [
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' },
];

const STATS_CONFIG = [
    {
        label: 'Tổng doanh thu',
        key: 'revenue',
        icon: <FiDollarSign size={24} />,
        color: 'primary',
        formatter: (val) => formatCurrency(val)
    },
    {
        label: 'Đơn hàng',
        key: 'orders',
        icon: <FiShoppingBag size={24} />,
        color: 'success'
    },
    {
        label: 'Khách hàng mới',
        key: 'customers',
        icon: <FiUsers size={24} />,
        color: 'warning'
    },
    {
        label: 'Trung bình đơn',
        key: 'avgOrderValue',
        icon: <FiTrendingUp size={24} />,
        color: 'info',
        formatter: (val) => formatCurrency(val)
    }
];

const getDateRangeLabel = (range) => {
    switch (range) {
        case 'week': return 'Tuần này';
        case 'month': return 'Tháng này';
        case 'year': return 'Năm nay';
        default: return '';
    }
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const [dateRange, setDateRange] = useState('month');
    const [loading, setLoading] = useState(false);
    const [statsData, setStatsData] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        avgOrderValue: 0,
        chart: [],
        topProducts: [],
        categoryStats: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await statsApi.getDashboardStats(dateRange);
                if (data.status) {
                    setStatsData(data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast.error("Không thể tải dữ liệu thống kê");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dateRange]);

    // Transform backend data to stats card format
    const stats = useMemo(() => STATS_CONFIG.map(config => ({
        ...config,
        value: config.formatter ? config.formatter(statsData[config.key]) : statsData[config.key],
        trend: 'N/A'
    })), [statsData]);

    // Chart Data Preparation
    const lineChartData = useMemo(() => ({
        labels: statsData.chart?.map(item => item._id) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: statsData.chart?.map(item => item.revenue) || [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
            }
        ]
    }), [statsData.chart]);

    const pieChartData = useMemo(() => ({
        labels: statsData.categoryStats?.map(item => item.name) || [],
        datasets: [
            {
                data: statsData.categoryStats?.map(item => item.revenue) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    }), [statsData.categoryStats]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value, { maximumSignificantDigits: 3 });
                    }
                }
            }
        }
    };

    return (
        <>
            <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
                <h1 className="page-title">Báo cáo & Thống kê</h1>
                <div className="d-flex gap-3 align-items-center mt-3 mt-md-0">
                    <div className="btn-group border rounded overflow-hidden">
                        {TIME_RANGES.map((range) => (
                            <Button
                                key={range.value}
                                size="sm"
                                variant={dateRange === range.value ? 'primary' : 'light'}
                                onClick={() => setDateRange(range.value)}
                            >
                                {range.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="row mb-4 g-4">
                        {stats.map((stat, index) => (
                            <div className="col-12 col-sm-6 col-xl-3" key={index}>
                                <StatCard
                                    label={stat.label}
                                    value={stat.value}
                                    icon={stat.icon}
                                    trend={stat.trend}
                                    color={stat.color}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Revenue Chart */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border">
                                <div className="card-header">
                                    <h5 className="mb-0 fw-bold">Biểu đồ doanh thu <small className="text-muted fw-normal ms-2">({getDateRangeLabel(dateRange)})</small></h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ height: '300px', width: '100%' }}>
                                        {statsData.chart && statsData.chart.length > 0 ? (
                                            <Line options={{ ...chartOptions, maintainAspectRatio: false }} data={lineChartData} />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                Chưa có dữ liệu cho khoảng thời gian này
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Products & Category Overview */}
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0 fw-bold">Sản phẩm bán chạy <small className="text-muted fw-normal ms-2">({getDateRangeLabel(dateRange)})</small></h5>
                                </div>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sản phẩm</th>
                                                <th scope="col" className="text-end">Đã bán</th>
                                                <th scope="col" className="text-end">Doanh thu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statsData.topProducts.length > 0 ? (
                                                statsData.topProducts.map((product, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-bold">{product.name}</td>
                                                        <td className="text-end">{product.sold}</td>
                                                        <td className="text-end fw-bold text-danger">{formatCurrency(product.revenue)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center text-muted py-3">Chưa có dữ liệu</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card border shadow-sm h-100">
                                <div className="card-header">
                                    <h5 className="mb-0 fw-bold">Doanh thu theo danh mục <small className="text-muted fw-normal ms-2">({getDateRangeLabel(dateRange)})</small></h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '300px' }}>
                                        {statsData.categoryStats && statsData.categoryStats.length > 0 ? (
                                            <div style={{ maxWidth: '350px', width: '100%' }}>
                                                <Doughnut data={pieChartData} />
                                            </div>
                                        ) : (
                                            <div className="text-muted">Chưa có dữ liệu</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Reports;
