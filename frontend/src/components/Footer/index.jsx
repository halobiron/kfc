import React from 'react';
import './footer.css';
import footerLogo from '../../assets/images/logos/footer-logo.png';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsYoutube, BsGeoAlt, BsTelephone, BsEnvelope } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer className='footer-wrapper'>
            <div className="container footer-top">
                <div className="row justify-content-between">
                    {/* Brand & Social Column */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <img className='footer-logo' src={footerLogo} alt="KFC Vietnam" />
                        <div className="social-links">
                            <a href="https://www.facebook.com/KFCVietnam" className="social-icon" target="_blank" rel="noreferrer"><BsFacebook /></a>
                            <a href="https://www.instagram.com/kfc_vietnam/" className="social-icon" target="_blank" rel="noreferrer"><BsInstagram /></a>
                            <a href="https://www.youtube.com/@KFCVietnam2011" className="social-icon" target="_blank" rel="noreferrer"><BsYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links (Functional) */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="footer-heading">Liên Kết Nhanh</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Trang Chủ</Link></li>
                            <li><Link to="/products">Thực Đơn</Link></li>

                            <li><Link to="/login">Đăng Nhập / Đăng Ký</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="footer-heading">Chính Sách</h5>
                        <ul className="footer-links">
                            <li><Link to="/privacy-policy">Bảo Mật Thông Tin</Link></li>
                            <li><Link to="/terms-of-use">Hoạt Động</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info (Static but realistic) */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="footer-heading">Liên Hệ</h5>
                        <ul className="footer-links">
                            <li className="d-flex"><BsGeoAlt className="me-2" /> <span>Học Viện Công Nghệ Bưu Chính Viễn Thông</span></li>
                            <li className="d-flex"><BsTelephone className="me-2" /> <span>1900 6886 (Hotline)</span></li>
                            <li className="d-flex"><BsEnvelope className="me-2" /> <span>tranhailong@kfc-demo.vn</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container text-center">
                    <p className="mb-0">© 2026 KFC Vietnam Project.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer