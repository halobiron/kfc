import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { AVAILABLE_COUPONS } from '../../data/coupons';
import './Promotions.css';

const Promotions = () => {
    const navigate = useNavigate();

    const handleUseNow = () => {
        navigate('/products');
    };

    return (
        <Layout>
            <div className="promotions-wrapper">
                <div className="container py-5">
                    <div className="section-header text-center mb-5">
                        <h2 className="section-title text-uppercase">Khuyến Mãi & Ưu Đãi</h2>
                        <div className="title-underline mx-auto"></div>
                        <p className="section-subtitle mt-3 text-muted">Danh sách các chương trình khuyến mãi đang diễn ra tại KFC</p>
                    </div>

                    <div className="row g-4">
                        {AVAILABLE_COUPONS.map(coupon => (
                            <div key={coupon.id} className="col-12 col-md-6 col-lg-4">
                                <div className="promo-card h-100">
                                    <div className="promo-image-container">
                                        <img
                                            src={coupon.image}
                                            alt={coupon.title}
                                            className="promo-image"
                                            onError={(e) => {
                                                e.target.src = 'https://static.kfcvietnam.com.vn/images/content/home/promotions/lg/D-C-Ga-Ran.jpg?v=gXQ2pg';
                                            }}
                                        />
                                        <div className="promo-badge">HOT</div>
                                    </div>
                                    <div className="promo-content">
                                        <h3 className="promo-title">{coupon.title}</h3>
                                        <div className="promo-code-box">
                                            <span className="promo-label">MÃ:</span>
                                            <span className="promo-code">{coupon.code}</span>
                                            <button
                                                className="btn-copy"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(coupon.code);
                                                    alert(`Đã sao chép mã: ${coupon.code}`);
                                                }}
                                                title="Sao chép mã"
                                            >
                                                <i className="bi bi-clipboard"></i>
                                            </button>
                                        </div>
                                        <p className="promo-desc">{coupon.description}</p>
                                        <div className="promo-meta">
                                            <span className="promo-expiry"><i className="bi bi-clock me-1"></i>HSD: 31/12/2026</span>
                                            <span className="promo-min"><i className="bi bi-bag me-1"></i>Min: {coupon.minOrder.toLocaleString()}đ</span>
                                        </div>
                                        <button className="btn-use-now" onClick={handleUseNow}>
                                            Sử dụng ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Promotions;
