import React, { useEffect, useState } from 'react'
import './Header.css';
import { FiSearch, FiLogOut } from 'react-icons/fi';
import kfcLogo from '@shared-assets/images/logos/footer-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/Auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { setSearchKeyword } from '../../store/searchSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchKeyword = useSelector((state) => state.search.keyword);

  const [placeholder, setPlaceholder] = useState('Tìm kiếm...');

  useEffect(() => {
    dispatch(setSearchKeyword(''));

    // Cập nhật placeholder dựa trên đường dẫn hiện tại
    const path = location.pathname;
    if (path.includes('/products')) setPlaceholder('Tìm kiếm sản phẩm theo tên...');
    else if (path.includes('/orders')) setPlaceholder('Tìm kiếm đơn hàng theo mã, khách hàng...');
    else if (path.includes('/users')) setPlaceholder('Tìm kiếm người dùng theo email, tên...');
    else if (path.includes('/categories')) setPlaceholder('Tìm kiếm danh mục...');
    else if (path.includes('/promotions')) setPlaceholder('Tìm kiếm khuyến mãi...');
    else if (path.includes('/ingredients')) setPlaceholder('Tìm kiếm nguyên liệu...');
    else if (path.includes('/stores')) setPlaceholder('Tìm kiếm cửa hàng...');
    else if (path.includes('/roles')) setPlaceholder('Tìm kiếm vai trò...');
    else setPlaceholder('Tìm kiếm...');

  }, [location.pathname, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchKeyword(e.target.value));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout());
    navigate('/');
  };

  return (
    <header className="navbar navbar-dark sticky-top flex-md-nowrap p-0 shadow-sm header-container">
      <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 header-brand-link" to="/">
        <img src={kfcLogo} alt="KFC" className="header-logo" />
      </Link>
      <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="w-100 d-flex align-items-center px-3">
        <FiSearch className="header-search-icon" />
        <input
          className="form-control form-control-dark w-100 header-search-input"
          type="text"
          placeholder={placeholder}
          aria-label="Search"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <button className="nav-link px-3 d-flex align-items-center header-logout-link btn btn-link border-0 w-100 text-start" onClick={handleLogout}>
            <FiLogOut className="header-logout-icon" />
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
