import React from 'react'
import StatCard from '../../components/StatCard'
import { FiShoppingBag, FiDollarSign, FiUsers, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi'

const Home = () => {
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
      <div className="row mb-3 g-1">
        <div className="col-4">
          <StatCard
            label="Tổng đơn hàng"
            value="1,250"
            trend="+5% "
            icon={<FiShoppingBag size={24} />}
            color="primary"
          />
        </div>
        <div className="col-4">
          <StatCard
            label="Doanh thu"
            value="245M"
            trend="+12%"
            icon={<FiDollarSign size={24} />}
            color="success"
          />
        </div>
        <div className="col-4">
          <StatCard
            label="Khách hàng mới"
            value="85"
            trend="+2%"
            icon={<FiUsers size={24} />}
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
              <div style={{ height: '180px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #dee2e6', borderRadius: '4px' }}>
                <p className="text-muted mb-0">Khu vực hiển thị biểu đồ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Hoạt động gần đây</h5>
            </div>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                <FiClock size={18} className="text-danger flex-shrink-0" />
                <div className="small">
                  <div className="fw-bold text-truncate">Đơn #1250 cần xác nhận</div>
                  <div className="text-muted text-truncate">Nguyễn Văn A</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                <FiCheckCircle size={18} className="text-success flex-shrink-0" />
                <div className="small">
                  <div className="fw-bold text-truncate">Thanh toán #1249</div>
                  <div className="text-muted text-truncate">189.000đ - Thành công</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiShoppingBag size={18} className="text-primary flex-shrink-0" />
                <div className="small">
                  <div className="fw-bold text-truncate">Đơn hàng mới #1251</div>
                  <div className="text-muted text-truncate">Combo Gà + Nước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home