import React from 'react'

const Order = () => {
  return (
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Orders</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2">
            <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            This week
          </button>
        </div>
      </div>

      <h2>Đơn hàng gần đây</h2>
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Khách hàng</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1001</td>
              <td>Nguyen Van A</td>
              <td>Combo Gà Rán Truyền Thống (x2), Pepsi (L)</td>
              <td>189.000 đ</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#1002</td>
              <td>Tran Thi B</td>
              <td>Burger Tôm, Khoai tây chiên (M)</td>
              <td>75.000 đ</td>
              <td><span className="badge bg-warning text-dark">Processing</span></td>
            </tr>
            <tr>
              <td>#1003</td>
              <td>Le Van C</td>
              <td>Cơm Gà Giòn Cay, 7Up (M)</td>
              <td>55.000 đ</td>
              <td><span className="badge bg-secondary">Pending</span></td>
            </tr>
            <tr>
              <td>#1004</td>
              <td>Pham Thi D</td>
              <td>Gà Rán (3 miếng), Salad Bắp Cải</td>
              <td>120.000 đ</td>
              <td><span className="badge bg-success">Completed</span></td>
            </tr>
            <tr>
              <td>#1005</td>
              <td>Hoang Van E</td>
              <td>Combo Nhóm (4 người)</td>
              <td>350.000 đ</td>
              <td><span className="badge bg-danger">Cancelled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Order