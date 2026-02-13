import React from 'react'
import './Nav.css';
import { Link } from 'react-router-dom'
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiBox, FiTag, FiPackage, FiMapPin, FiLock } from 'react-icons/fi';

import { useSelector } from 'react-redux';

const Nav = () => {
  const { user } = useSelector(state => state.auth);
  // Extract role name safely (handle both string and object)
  const roleName = user?.role?.name || user?.role;

  // Default to empty array if permissions not loaded/available yet or for legacy users
  const permissions = user?.permissions || user?.role?.permissions || user?.roleId?.permissions || [];

  // Helper to check permission
  // For Admin (legacy string role), allow all. Or check specific permission.
  // The seed script gave 'admin' role all permissions.
  const hasPermission = (perm) => {
    // If user is admin by string role (legacy) or object name, allow all
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
              <FiHome style={{ marginRight: '8px' }} />
              Tổng quan
            </Link>
          </li>

          {hasPermission('orders.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                <FiFileText style={{ marginRight: '8px' }} />
                Đơn hàng
              </Link>
            </li>
          )}

          {hasPermission('kitchen.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/kitchen">
                <FiPackage style={{ marginRight: '8px' }} />
                Bếp
              </Link>
            </li>
          )}

          {hasPermission('products.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <FiShoppingCart style={{ marginRight: '8px' }} />
                Sản phẩm
              </Link>
            </li>
          )}

          {hasPermission('categories.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                <FiTag style={{ marginRight: '8px' }} />
                Danh mục
              </Link>
            </li>
          )}

          {hasPermission('ingredients.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/ingredients">
                <FiBox style={{ marginRight: '8px' }} />
                Nguyên liệu
              </Link>
            </li>
          )}

          {hasPermission('users.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <FiUsers style={{ marginRight: '8px' }} />
                Người dùng
              </Link>
            </li>
          )}

          {(roleName === 'admin' || hasPermission('roles.view')) && (
            <li className="nav-item">
              <Link className="nav-link" to="/roles">
                <FiLock style={{ marginRight: '8px' }} />
                Phân quyền
              </Link>
            </li>
          )}

          {hasPermission('promotions.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/promotions">
                <FiTag style={{ marginRight: '8px' }} />
                Khuyến mãi
              </Link>
            </li>
          )}

          {hasPermission('reports.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/reports">
                <FiBarChart2 style={{ marginRight: '8px' }} />
                Báo cáo
              </Link>
            </li>
          )}

          {hasPermission('stores.view') && (
            <li className="nav-item">
              <Link className="nav-link" to="/stores">
                <FiMapPin style={{ marginRight: '8px' }} />
                Cửa hàng
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link className="nav-link" to="/change-password">
              <FiLock style={{ marginRight: '8px' }} />
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav