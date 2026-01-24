import React from 'react'

const Home = () => {
  return (
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Tổng quan</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" class="btn btn-sm btn-outline-secondary">Chia sẻ</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Xuất file</button>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            Tuần này
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">Tổng đơn hàng</h5>
              <p class="card-text fs-2">1,250</p>
              <small>+5% so với tháng trước</small>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h5 class="card-title">Doanh thu</h5>
              <p class="card-text fs-2">245.000.000 đ</p>
              <small>+12% so với tháng trước</small>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card text-white bg-warning">
            <div class="card-body">
              <h5 class="card-title">Khách hàng mới</h5>
              <p class="card-text fs-2">85</p>
              <small>+2% so với tháng trước</small>
            </div>
          </div>
        </div>
      </div>

      <h2>Biểu đồ doanh thu (Demo)</h2>
      <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #dee2e6' }}>
        <p className="text-muted">Khu vực hiển thị biểu đồ</p>
      </div>
    </main>
  )
}

export default Home