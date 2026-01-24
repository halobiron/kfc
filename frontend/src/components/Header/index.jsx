import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/img/KFC-Logo.png';
import Modal from '../Modal';
import './header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cartQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <>
      <header className="sticky-top bg-white shadow-sm">
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
                {/* User/Login */}
                <Link to="/login" className="text-decoration-none text-dark fw-bold d-flex align-items-center">
                  <i className="bi bi-person-circle fs-4 me-2"></i>
                </Link>

                {/* Cart */}
                <div className="position-relative cursor-pointer" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
                  <span className="fw-bold me-2">GIỎ HÀNG</span>
                  <span className="badge rounded-pill bg-danger border border-light p-2">
                    {cartQuantity}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Modal */}
      {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;
