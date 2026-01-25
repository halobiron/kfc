import React from 'react'
import { FiEye } from 'react-icons/fi';

const Order = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>
      </div>

      <div className="card">
        <div className="card-header">Đơn hàng gần đây</div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1001</td>
                <td>Nguyen Van A</td>
                <td>Combo Gà Rán Truyền Thống (x2), Pepsi (L)</td>
                <td>189.000 đ</td>
                <td><span className="badge badge-success">Hoàn thành</span></td>
                <td>
                  <button className="btn-action btn-edit">
                    <FiEye style={{ marginRight: '4px' }} />
                    Xem
                  </button>
                </td>
              </tr>
              <tr>
                <td>#1002</td>
                <td>Tran Thi B</td>
                <td>Burger Tôm, Khoai tây chiên (M)</td>
                <td>75.000 đ</td>
                <td><span className="badge badge-warning">Đang xử lý</span></td>
                <td>
                  <button className="btn-action btn-edit">
                    <FiEye style={{ marginRight: '4px' }} />
                    Xem
                  </button>
                </td>
              </tr>
              <tr>
                <td>#1003</td>
                <td>Le Van C</td>
                <td>Cơm Gà Giòn Cay, 7Up (M)</td>
                <td>55.000 đ</td>
                <td><span className="badge badge-warning">Chờ xác nhận</span></td>
                <td>
                  <button className="btn-action btn-edit">
                    <FiEye style={{ marginRight: '4px' }} />
                    Xem
                  </button>
                </td>
              </tr>
              <tr>
                <td>#1004</td>
                <td>Pham Thi D</td>
                <td>Gà Rán (3 miếng), Salad Bắp Cải</td>
                <td>120.000 đ</td>
                <td><span className="badge badge-success">Hoàn thành</span></td>
                <td>
                  <button className="btn-action btn-edit">
                    <FiEye style={{ marginRight: '4px' }} />
                    Xem
                  </button>
                </td>
              </tr>
              <tr>
                <td>#1005</td>
                <td>Hoang Van E</td>
                <td>Combo Nhóm (4 người)</td>
                <td>350.000 đ</td>
                <td><span className="badge badge-danger">Đã hủy</span></td>
                <td>
                  <button className="btn-action btn-edit">
                    <FiEye style={{ marginRight: '4px' }} />
                    Xem
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Order