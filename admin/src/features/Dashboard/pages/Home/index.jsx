import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardStats } from '../../statsSlice'
import Loading from '../../../../components/Common/Loading';
import StatCard from '../../../../components/Common/StatCard';
import { FiShoppingBag, FiDollarSign, FiUsers, FiAlertCircle, FiCalendar } from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.stats);
  const [range, setRange] = useState('month');

  useEffect(() => {
    dispatch(getDashboardStats(range));
  }, [dispatch, range]);

  const rangeOptions = [
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
    { value: 'year', label: '12 tháng qua' }
  ];

  const chartData = useMemo(() => {
    if (!stats.chart || stats.chart.length === 0) return { labels: [], datasets: [] };

    // Extract unique dates and payment methods
    const dates = [...new Set(stats.chart.map(item => item._id.date))].sort();
    const paymentMethods = [...new Set(stats.chart.map(item => item._id.paymentMethod))];

    // Build datasets for each payment method
    const datasets = paymentMethods.map((method, index) => {
      const colors = method === 'Tiền mặt'
        ? { border: 'rgb(25, 135, 84)', bg: 'rgba(25, 135, 84, 0.7)' }
        : { border: 'rgb(13, 110, 253)', bg: 'rgba(13, 110, 253, 0.7)' };

      return {
        label: method,
        data: dates.map(date => {
          const found = stats.chart.find(item => item._id.date === date && item._id.paymentMethod === method);
          return found ? found.revenue : 0;
        }),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
      };
    });

    return {
      labels: dates,
      datasets: datasets,
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
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
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
      <div className="page-header mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="page-title mb-0">Tổng quan</h1>
          <div className="d-flex align-items-center gap-2">
            <FiCalendar className="text-muted" />
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              {rangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="row mb-3 g-3">
        <div className="col-12">
          <div className="alert alert-warning border-0 shadow-sm mb-0 d-flex align-items-center gap-3" role="alert">
            <FiAlertCircle size={24} className="flex-shrink-0" />
            <div>
              <strong>Cần xử lý ngay:</strong> {loading ? "..." : stats.pendingOrders} đơn hàng chờ xác nhận | {loading ? "..." : stats.lowStockIngredients} nguyên liệu sắp hết
              <br />
              <small className="text-muted">Vui lòng kiểm tra để cập nhật kịp thời</small>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4 g-3">
        <div className="col-md-6 col-sm-6">
          <StatCard
            label="Tổng đơn hàng"
            value={loading ? "..." : stats.orders}
            trend="+5%" // Placeholder trend
            icon={<FiShoppingBag size={20} />}
            color="primary"
          />
        </div>
        <div className="col-md-6 col-sm-6">
          <StatCard
            label="Doanh thu"
            value={loading ? "..." : formatCurrency(stats.revenue)}
            trend="+12%" // Placeholder trend
            icon={<FiDollarSign size={20} />}
            color="success"
          />
        </div>
        {/* <div className="col-md-4 col-sm-12">
          <StatCard
            label="Khách hàng mới"
            value={loading ? "..." : stats.customers}
            trend="+2%" // Placeholder trend
            icon={<FiUsers size={20} />}
            color="warning"
          />
        </div> */}
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
                    <Loading />
                  </div>
                ) : (
                  <Bar options={chartOptions} data={chartData} />
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
                <div className="d-flex justify-content-center py-4">
                  <Loading />
                </div>
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
    </>
  )
}

export default Home
