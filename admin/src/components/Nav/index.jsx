import React from 'react'
import './Nav.css';
import { NavLink } from 'react-router-dom'
import { FiLock } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { routesMetadata } from '../../config/routesConfig';

const Nav = () => {
  const { user } = useSelector(state => state.auth);
  const roleName = user?.role?.name || user?.role;
  const getNavLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const permissions = user?.permissions || user?.role?.permissions || user?.roleId?.permissions || [];

  const hasPermission = (perm) => {
    if (!perm) return true;
    if (roleName === 'admin') return true;
    return permissions.includes(perm);
  };

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {routesMetadata.map((route) => {
            if (route.permission && !hasPermission(route.permission)) return null;
            
            return (
              <li className="nav-item" key={route.id}>
                <NavLink className={getNavLinkClass} to={route.path} end={route.path === '/home'}>
                  {React.cloneElement(route.icon, { className: 'nav-icon' })}
                  {route.label}
                </NavLink>
              </li>
            );
          })}

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
