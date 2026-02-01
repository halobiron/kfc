import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardStats } from '../../redux/slices/statsSlice'
import StatCard from '../../components/StatCard'
import { FiShoppingBag, FiDollarSign, FiUsers, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const chartData = useMemo(() => {
    if (!stats.chart) return { labels: [], datasets: [] };

    const sortedChart = [...stats.chart]; // Ensure it's sorted if backend doesn't guaranteed it, though controller did sort.

    return {
      labels: sortedChart.map(item => item._id),
      datasets: [
        {
          label: 'Doanh thu',
          data: sortedChart.map(item => item.revenue),
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    };
  }, [stats.chart]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Doanh thu theo thời gian',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(value);
          }
        }
      }
    }
  };

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
      <div className="page-header mb-3">
        <h1 className="page-title mb-0">Tổng quan</h1>
      </div>

      {/* Critical Alerts */}
      <div className="row mb-3 g-3">
        <div className="col-12">
          <div className="alert alert-warning border-0 shadow-sm mb-0 d-flex align-items-center gap-3" role="alert">
            <FiAlertCircle size={24} className="flex-shrink-0" />
            <div>
              <strong>Cần xử lý ngay:</strong> 3 đơn hàng chờ xác nhận | 2 nguyên liệu sắp hết
              <br />
              <small className="text-muted">Vui lòng kiểm tra để cập nhật kịp thời</small>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4 g-3">
        <div className="col-md-4 col-sm-6">
          <StatCard
            label="Tổng đơn hàng"
            value={loading ? "..." : stats.orders}
            trend="+5%" // Placeholder trend
            icon={<FiShoppingBag size={20} />}
            color="primary"
          />
        </div>
        <div className="col-md-4 col-sm-6">
          <StatCard
            label="Doanh thu"
            value={loading ? "..." : formatCurrency(stats.revenue)}
            trend="+12%" // Placeholder trend
            icon={<FiDollarSign size={20} />}
            color="success"
          />
        </div>
        <div className="col-md-4 col-sm-12">
          <StatCard
            label="Khách hàng mới"
            value={loading ? "..." : stats.customers}
            trend="+2%" // Placeholder trend
            icon={<FiUsers size={20} />}
            color="warning"
          />
        </div>
      </div>

      {/* Chart & Recent Activity Row */}
      <div className="row g-3">
        {/* Chart Section */}
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Biểu đồ doanh thu</h5>
            </div>
            <div className="card-body p-3">
              <div style={{ height: '300px' }}>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span className="text-muted">Đang tải biểu đồ...</span>
                  </div>
                ) : (
                  <Line options={chartOptions} data={chartData} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Sản phẩm bán chạy</h5>
            </div>
            <div className="card-body p-3">
              {loading ? (
                <div className="text-center text-muted">Đang tải...</div>
              ) : stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={index} className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                    <div className="flex-shrink-0 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      <span className="fw-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="small flex-grow-1">
                      <div className="fw-bold text-truncate">{product.name}</div>
                      <div className="text-muted text-truncate">{product.sold} đã bán - {formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center mb-0">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home