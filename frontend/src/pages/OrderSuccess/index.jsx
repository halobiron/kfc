import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    useEffect(() => {
        // Scroll to top when loaded
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="order-success-wrapper">
            <div className="container">
                <div className="success-card text-center">
                    <div className="success-icon-wrapper mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                    </div>

                    <h2 className="success-title mb-3 fw-bold">ĐẶT HÀNG THÀNH CÔNG!</h2>

                    <p className="success-message text-muted mb-4 fs-5">
                        Đơn hàng đã được tiếp nhận.<br />
                        Chuẩn bị thưởng thức <strong>"Vị ngon trên từng ngón tay"</strong> nhé!
                    </p>

                    <div className="order-actions d-flex justify-content-center gap-3">
                        <Link to="/" className="btn btn-outline-dark px-4 py-2 rounded-pill fw-bold">
                            <i className="bi bi-house-door me-2"></i>
                            Về Trang Chủ
                        </Link>
                        <Link to="/my-orders" className="btn btn-danger px-4 py-2 rounded-pill fw-bold">
                            <i className="bi bi-receipt me-2"></i>
                            Xem Đơn Hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
