import React from 'react';
import './footer.css';
import footerLogo from '../../assets/img/footer-logo.png';
import playStore from '../../assets/img/google-play.png';
import appStore from '../../assets/img/app-store.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='footer-wrapper'>
            <div className="container footer-top">
                <div className="row justify-content-between">
                    {/* Brand & Social Column */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <img className='footer-logo' src={footerLogo} alt="KFC Vietnam" />
                        <div className="social-links">
                            <a href="https://www.facebook.com/KFCVietnam" className="social-icon" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
                            <a href="https://www.instagram.com/kfc_vietnam/" className="social-icon" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
                            <a href="https://www.youtube.com/@KFCVietnam2011" className="social-icon" target="_blank" rel="noreferrer"><i className="bi bi-youtube"></i></a>
                        </div>
                    </div>

                    {/* Quick Links (Functional) */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="footer-heading">Liên Kết Nhanh</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Trang Chủ</Link></li>
                            <li><Link to="/products">Thực Đơn</Link></li>
                            <li><Link to="/promotions">Khuyến Mãi</Link></li>
                            <li><Link to="/login">Đăng Nhập / Đăng Ký</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info (Static but realistic) */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <h5 className="footer-heading">Liên Hệ</h5>
                        <ul className="footer-links">
                            <li className="d-flex"><i className="bi bi-geo-alt me-2"></i> <span>Học Viện Công Nghệ Bưu Chính Viễn Thông</span></li>
                            <li className="d-flex"><i className="bi bi-telephone me-2"></i> <span>1900 6886 (Hotline)</span></li>
                            <li className="d-flex"><i className="bi bi-envelope me-2"></i> <span>tranhailong@kfc-demo.vn</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container text-center">
                    <p className="mb-0">© 2026 KFC Vietnam Project. Built for Educational Purpose.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer