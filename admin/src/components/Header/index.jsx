import React from 'react'
import './Header.css';
import { FiSearch, FiLogOut } from 'react-icons/fi';
import kfcLogo from '@shared-assets/images/logos/footer-logo.png';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/Auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow-sm header-container">
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 header-brand-link" href="#">
        <img src={kfcLogo} alt="KFC" className="header-logo" />
      </a>
      <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="w-100 d-flex align-items-center px-3">
        <FiSearch className="header-search-icon" />
        <input className="form-control form-control-dark w-100 header-search-input" type="text" placeholder="Tìm kiếm..." aria-label="Search" />
      </div>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <a className="nav-link px-3 d-flex align-items-center header-logout-link" href="#" onClick={handleLogout}>
            <FiLogOut className="header-logout-icon" />
            Đăng xuất
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
