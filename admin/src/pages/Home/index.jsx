import React from 'react'

const Home = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
      <div className="page-header">
        <h1 className="page-title">Tổng quan</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4">
        <div className="col-4">
          <div className="stats-card">
            <div className="stats-card-value">1,250</div>
            <div className="stats-card-label">Tổng đơn hàng</div>
            <small className="text-muted">+5% so với tháng trước</small>
          </div>
        </div>
        <div className="col-4">
          <div className="stats-card">
            <div className="stats-card-value">245M</div>
            <div className="stats-card-label">Doanh thu</div>
            <small className="text-muted">+12% so với tháng trước</small>
          </div>
        </div>
        <div className="col-4">
          <div className="stats-card">
            <div className="stats-card-value">85</div>
            <div className="stats-card-label">Khách hàng mới</div>
            <small className="text-muted">+2% so với tháng trước</small>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card">
        <div className="card-header">Biểu đồ doanh thu</div>
        <div className="card-body">
          <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #dee2e6' }}>
            <p className="text-muted">Khu vực hiển thị biểu đồ</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-4">
        <div className="card-header">Hoạt động gần đây</div>
        <div className="card-body">
          <div className="alert alert-info mb-2">
            <strong>Đơn hàng mới:</strong> #1250 - Nguyễn Văn A đã đặt Combo Gà Rán
          </div>
          <div className="alert alert-success mb-2">
            <strong>Thanh toán thành công:</strong> #1249 - 189.000đ
          </div>
          <div className="alert alert-warning mb-0">
            <strong>Cần xử lý:</strong> 3 đơn hàng đang chờ xác nhận
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home