import React from 'react';
import logo from '../../assets/img/KFC-Logo.png';
import './header.css';
import Menu from '../Menu'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <div className="headerWrapper">
      <div className="logo">
        <Link to="/"><img width="150px" src={logo}alt="" /></Link>
      </div>
      <div className="auth-link">
        <ul>
          <li><Link to=""><i className="bi bi-geo-alt-fill"></i> Tìm chi nhánh</Link></li>
          <li><Link to="/login"><i className="bi bi-person-fill"></i> Đăng nhập/Đăng ký</Link></li>
          <li><Link to=""> Tài khoản của tôi</Link></li>
          <li><Link to=""> Đăng xuất</Link></li>
        </ul>
      </div>
    </div>
    <Menu/>
    </>
  )
}

export default Header