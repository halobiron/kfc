import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../../features/Cart/cartSlice';
import logo from '../../assets/images/logos/kfc-logo.png';
import { BsGeoAlt, BsPersonCircle, BsShop, BsTruck, BsBag } from 'react-icons/bs';

import './Header.css';
import Button from '../Button';

const Header = () => {

  const cartQuantity = useSelector(selectCartTotalQuantity);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevQuantity, setPrevQuantity] = useState(cartQuantity);

  useEffect(() => {
    if (cartQuantity > prevQuantity) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600); // 0.6s animation
      return () => clearTimeout(timer);
    }
    setPrevQuantity(cartQuantity);
  }, [cartQuantity, prevQuantity]);

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
                  <li className="nav-item">
                    <Link className="nav-link text-danger mx-2" to="/track-order">
                      <BsGeoAlt className="me-1" />Tra cứu đơn
                    </Link>
                  </li>
                </ul>

                {/* Right Action Buttons */}
                <div className="d-flex align-items-center gap-3">
                  {/* User Account Link */}
                  <Link
                    to="/account"
                    className="btn user-acc-btn text-dark fw-bold d-flex align-items-center justify-content-center p-0 border-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <BsPersonCircle style={{ fontSize: '28px', lineHeight: '1' }} />
                  </Link>

                  {/* Cart Icon */}
                  <div className="shopping-cart">
                    <div
                      className={`basket mat-ripple mat-ripple-unbounded ${cartQuantity === 0 ? 'blank' : ''} ${isAnimating ? 'Itemadded' : ''}`}
                      onClick={() => navigate('/cart')}
                      title="Giỏ hàng"
                    >
                      {cartQuantity}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Secondary Utility Bar */}
        <div className="secondary-bar d-none d-lg-block">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between py-2">
              {/* Order Type Toggle */}
              <div className="order-type-toggle d-flex gap-3">
                <div className="order-type-item">
                  <BsShop className="me-1" />
                  Đặt Ngay
                </div>
                <div className="order-type-item">
                  <BsTruck className="me-1" />
                  Giao Hàng
                </div>
                <div className="order-type-item">
                  <BsBag className="me-1" />
                  Mang đi
                </div>
              </div>

              {/* CTA Button */}
              <Button
                variant="primary"
                onClick={() => navigate('/products')}
                className="cta-button"
              >
                Bắt đầu đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}

    </>
  );
};

export default Header;
