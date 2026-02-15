import React from 'react'
import './Nav.css';
import { NavLink } from 'react-router-dom'
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiBox, FiTag, FiPackage, FiMapPin, FiLock } from 'react-icons/fi';

import { useSelector } from 'react-redux';

const Nav = () => {
  const { user } = useSelector(state => state.auth);
  const roleName = user?.role?.name || user?.role;
  const getNavLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const permissions = user?.permissions || user?.role?.permissions || user?.roleId?.permissions || [];

  const hasPermission = (perm) => {
    if (roleName === 'admin') return true;
    return permissions.includes(perm);
  };

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className={getNavLinkClass} to="/home" end>
              <FiHome className="nav-icon" />
              Tổng quan
            </NavLink>
          </li>

          {hasPermission('orders.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/orders">
                <FiFileText className="nav-icon" />
                Đơn hàng
              </NavLink>
            </li>
          )}

          {hasPermission('kitchen.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/kitchen">
                <FiPackage className="nav-icon" />
                Bếp
              </NavLink>
            </li>
          )}

          {hasPermission('products.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/products">
                <FiShoppingCart className="nav-icon" />
                Sản phẩm
              </NavLink>
            </li>
          )}

          {hasPermission('categories.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/categories">
                <FiTag className="nav-icon" />
                Danh mục
              </NavLink>
            </li>
          )}

          {hasPermission('ingredients.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/ingredients">
                <FiBox className="nav-icon" />
                Nguyên liệu
              </NavLink>
            </li>
          )}

          {hasPermission('users.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/users">
                <FiUsers className="nav-icon" />
                Người dùng
              </NavLink>
            </li>
          )}

          {(roleName === 'admin' || hasPermission('roles.view')) && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/roles">
                <FiLock className="nav-icon" />
                Phân quyền
              </NavLink>
            </li>
          )}

          {hasPermission('promotions.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/promotions">
                <FiTag className="nav-icon" />
                Khuyến mãi
              </NavLink>
            </li>
          )}

          {hasPermission('reports.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/reports">
                <FiBarChart2 className="nav-icon" />
                Báo cáo
              </NavLink>
            </li>
          )}

          {hasPermission('stores.view') && (
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/stores">
                <FiMapPin className="nav-icon" />
                Cửa hàng
              </NavLink>
            </li>
          )}

          <li className="nav-item">
            <NavLink className={getNavLinkClass} to="/change-password">
              <FiLock className="nav-icon" />
              Đổi mật khẩu
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
