import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../../features/Cart/cartSlice';
import logo from '../../assets/images/logos/kfc-logo.png';
import { BsGeoAlt, BsPersonCircle } from 'react-icons/bs';

import './Header.css';

const Header = () => {
  const cartQuantity = useSelector(selectCartTotalQuantity);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const previousQuantityRef = useRef(cartQuantity);

  useEffect(() => {
    const shouldAnimate = cartQuantity > previousQuantityRef.current;
    previousQuantityRef.current = cartQuantity;
    if (!shouldAnimate) return undefined;

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [cartQuantity]);

  const basketClassName = `basket mat-ripple mat-ripple-unbounded ${cartQuantity === 0 ? 'blank' : ''} ${isAnimating ? 'Itemadded' : ''}`;

  return (
    <header className="kfc-header sticky-top">
      <div className="main-nav bg-white shadow-sm">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light py-3">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="KFC Vietnam" height="40" />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#kfcNavbar">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="kfcNavbar">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/products">Thực Đơn</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stores">Cửa hàng</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-danger" to="/track-order">
                    <BsGeoAlt className="me-1" />
                    Tra cứu đơn
                  </Link>
                </li>
              </ul>

              <div className="header-actions">
                <Link to="/account" className="btn user-acc-btn">
                  <BsPersonCircle />
                </Link>

                <div className="shopping-cart">
                  <div className={basketClassName} onClick={() => navigate('/cart')} title="Giỏ hàng">
                    {cartQuantity}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
