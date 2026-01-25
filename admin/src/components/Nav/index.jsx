import React from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiPlusCircle } from 'react-icons/fi';

const Nav = () => {
  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/home">
              <FiHome style={{ marginRight: '8px' }} />
              Tổng quan
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/orders">
              <FiFileText style={{ marginRight: '8px' }} />
              Đơn hàng
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products">
              <FiShoppingCart style={{ marginRight: '8px' }} />
              Sản phẩm
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/customers">
              <FiUsers style={{ marginRight: '8px' }} />
              Khách hàng
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              <FiBarChart2 style={{ marginRight: '8px' }} />
              Báo cáo
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Báo cáo đã lưu</span>
          <a className="link-secondary" href="#" aria-label="Add a new report">
            <FiPlusCircle />
          </a>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <FiFileText style={{ marginRight: '8px' }} />
              Tháng này
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <FiFileText style={{ marginRight: '8px' }} />
              Quý trước
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav