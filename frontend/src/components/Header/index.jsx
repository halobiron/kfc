import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/img/KFC-Logo.png';

import './header.css';

const Header = () => {

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
                    <Link className="nav-link text-dark mx-2" to="/stores">Cửa hàng</Link>
                  </li>
                </ul>

                {/* Right Action Buttons */}
                <div className="d-flex align-items-center gap-3">
                  {/* User Account Link */}
                  <Link
                    to="/account"
                    className="btn text-dark fw-bold d-flex align-items-center justify-content-center p-0 border-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-person-circle" style={{ fontSize: '28px', lineHeight: '1' }}></i>
                  </Link>

                  <div className="position-relative d-flex align-items-center justify-content-center" onClick={() => navigate('/cart')} style={{ cursor: 'pointer', width: '36px', height: '36px', overflow: 'visible' }}>
                    <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="kfc-cart-icon" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="popcornGradient" x1="32" y1="7" x2="32" y2="24" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FFC72C" />
                          <stop offset="1" stopColor="#FFB300" />
                        </linearGradient>
                      </defs>
                      <g className="popcorn-kernels" style={{ transformBox: 'fill-box' }}>
                        <circle cx="18" cy="14" r="7" fill="url(#popcornGradient)" stroke="#E4002B" strokeWidth="1.5" />
                        <circle cx="32" cy="7" r="8" fill="url(#popcornGradient)" stroke="#E4002B" strokeWidth="1.5" />
                        <circle cx="46" cy="14" r="7" fill="url(#popcornGradient)" stroke="#E4002B" strokeWidth="1.5" />
                      </g>
                      {/* Scaled bucket for better height match - tapered trapezoid */}
                      <path d="M14 18 L19 57 H45 L50 18 H14Z" fill="white" stroke="#E4002B" strokeWidth="2" strokeLinejoin="round" />
                    </svg>

                    <span className="position-absolute fw-bold" style={{
                      top: '58%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'var(--kfc-red)',
                      fontSize: '0.9rem',
                      zIndex: 2,
                      userSelect: 'none'
                    }}>
                      {cartQuantity}
                    </span>
                  </div>
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
                <div className="order-type-item">
                  <i className="bi bi-shop me-1"></i>
                  Đặt Ngay
                </div>
                <div className="order-type-item">
                  <i className="bi bi-truck me-1"></i>
                  Giao Hàng
                </div>
                <div className="order-type-item">
                  <i className="bi bi-bag me-1"></i>
                  Mang đi
                </div>
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

    </>
  );
};

export default Header;
