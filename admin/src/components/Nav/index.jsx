import React from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiBox, FiTag, FiPackage, FiMapPin } from 'react-icons/fi';

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
            <Link className="nav-link" to="/kitchen">
              <FiPackage style={{ marginRight: '8px' }} />
              Bếp
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/products">
              <FiShoppingCart style={{ marginRight: '8px' }} />
              Sản phẩm
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/categories">
              <FiTag style={{ marginRight: '8px' }} />
              Danh mục
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ingredients">
              <FiBox style={{ marginRight: '8px' }} />
              Nguyên liệu
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/staff">
              <FiUsers style={{ marginRight: '8px' }} />
              Người dùng
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/promotions">
              <FiTag style={{ marginRight: '8px' }} />
              Khuyến mãi
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reports">
              <FiBarChart2 style={{ marginRight: '8px' }} />
              Báo cáo
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/stores">
              <FiMapPin style={{ marginRight: '8px' }} />
              Cửa hàng
            </Link>
          </li>
        </ul>


      </div>
    </nav>
  )
}

export default Nav