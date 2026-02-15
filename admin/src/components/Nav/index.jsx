import React from 'react'
import './Nav.css';
import { Link } from 'react-router-dom'
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiBox, FiTag, FiPackage, FiMapPin, FiLock } from 'react-icons/fi';

import { useSelector } from 'react-redux';

const Nav = () => {
  const { user } = useSelector(state => state.auth);
  const roleName = user?.role?.name || user?.role;

  // Default to empty array if permissions not loaded/available yet or for legacy users
  const permissions = user?.permissions || user?.role?.permissions || user?.roleId?.permissions || [];

  const hasPermission = (perm) => {
    if (roleName === 'admin') return true;
    return permissions.includes(perm);
  };

  // Debug logs
  console.log('Nav User:', user);
  console.log('Nav RoleName:', roleName);
  console.log('Nav Permissions:', permissions);

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/home">
              <FiHome className="nav-icon" />
              Tổng quan
            </Link>
          </li>

          {hasPermission('orders.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                <FiFileText className="nav-icon" />
                Đơn hàng
              </Link>
            </li>
          )}

          {hasPermission('kitchen.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/kitchen">
                <FiPackage className="nav-icon" />
                Bếp
              </Link>
            </li>
          )}

          {hasPermission('products.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <FiShoppingCart className="nav-icon" />
                Sản phẩm
              </Link>
            </li>
          )}

          {hasPermission('categories.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                <FiTag className="nav-icon" />
                Danh mục
              </Link>
            </li>
          )}

          {hasPermission('ingredients.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/ingredients">
                <FiBox className="nav-icon" />
                Nguyên liệu
              </Link>
            </li>
          )}

          {hasPermission('users.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <FiUsers className="nav-icon" />
                Người dùng
              </Link>
            </li>
          )}

          {(roleName === 'admin' || hasPermission('roles.view')) && (
            <li className="nav-item">
              <Link className="nav-link" to="/roles">
                <FiLock className="nav-icon" />
                Phân quyền
              </Link>
            </li>
          )}

          {hasPermission('promotions.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/promotions">
                <FiTag className="nav-icon" />
                Khuyến mãi
              </Link>
            </li>
          )}

          {hasPermission('reports.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/reports">
                <FiBarChart2 className="nav-icon" />
                Báo cáo
              </Link>
            </li>
          )}

          {hasPermission('stores.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/stores">
                <FiMapPin className="nav-icon" />
                Cửa hàng
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link className="nav-link" to="/change-password">
              <FiLock className="nav-icon" />
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
