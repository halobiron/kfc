import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/img/KFC-Logo.png';
import Modal from '../Modal';
import './header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery', 'pickup', 'dine-in'
  const cartQuantity = useSelector(state => state.cart.totalQuantity);
  const navigate = useNavigate();

  return (
    <>
      <header className="kfc-header sticky-top">
        {/* Main Navigation Bar */}
        <div className="main-nav bg-white shadow-sm">
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light py-2">
              {/* Logo */}
              <Link className="navbar-brand me-5" to="/">
                <img src={logo} alt="KFC Vietnam" height="40" />
              </Link>

              {/* Mobile Toggle */}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#kfcNavbar">
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Main Navigation */}
              <div className="collapse navbar-collapse" id="kfcNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold text-uppercase">
                  <li className="nav-item">
                    <Link className="nav-link text-dark mx-2" to="/products">Thực Đơn</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark mx-2" to="/promotions">Khuyến Mãi</Link>
                  </li>
                </ul>

                {/* Right Action Buttons */}
                <div className="d-flex align-items-center gap-3">
                  {/* User/Login - Dropdown */}
                  <div className="dropdown">
                    <button
                      className="btn text-dark fw-bold d-flex align-items-center p-0 border-0"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle fs-4"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li>
                        <Link className="dropdown-item" to="/my-orders">
                          <i className="bi bi-clock-history me-2"></i>
                          Đơn hàng của tôi
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/login">
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Đăng nhập
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Cart with improved badge */}
                  <div className="cart-wrapper position-relative" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
                    <i className="bi bi-basket fs-4 text-dark"></i>
                    {cartQuantity > 0 && (
                      <span className="cart-badge">{cartQuantity}</span>
                    )}
                  </div>

                  {/* Hamburger Menu */}
                  <button className="hamburger-menu" type="button">
                    <i className="bi bi-list fs-3"></i>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Secondary Utility Bar */}
        <div className="secondary-bar">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between py-2">
              {/* Order Type Toggle */}
              <div className="order-type-toggle d-flex gap-3">
                <button
                  className={`order-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  <i className="bi bi-shop me-1"></i>
                  Đặt Ngay
                </button>
                <button
                  className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <i className="bi bi-truck me-1"></i>
                  Giao Hàng
                </button>
                <button
                  className={`order-type-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                >
                  <i className="bi bi-bag me-1"></i>
                  Mang đi
                </button>
              </div>

              {/* CTA Button */}
              <button className="cta-button" onClick={() => navigate('/products')}>
                Bắt đầu đặt hàng
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;
