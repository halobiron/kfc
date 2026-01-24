import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item">
            <Link class="nav-link active" aria-current="page" to="/home">
              <span data-feather="home"></span>
              Tổng quan
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/orders">
              <span data-feather="file"></span>
              Đơn hàng
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/products">
              <span data-feather="shopping-cart"></span>
              Sản phẩm
            </Link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="users"></span>
              Khách hàng
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="bar-chart-2"></span>
              Báo cáo
            </a>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Báo cáo đã lưu</span>
          <a class="link-secondary" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="file-text"></span>
              Tháng này
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span data-feather="file-text"></span>
              Quý trước
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav