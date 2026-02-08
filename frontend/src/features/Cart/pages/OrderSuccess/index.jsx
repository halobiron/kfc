import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../../../api/axiosClient';
import { clearCart } from '../../cartSlice';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const [orderData, setOrderData] = useState(null);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}!`, { autoClose: 1500, hideProgressBar: true });
    };

    useEffect(() => {
        // Scroll to top when loaded
        window.scrollTo(0, 0);

        // Clear cart to ensure it's empty after success
        dispatch(clearCart());

        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const res = await axiosClient.get(`/order/${orderId}${status === 'success' ? '/verify-payment' : ''}`);
                    setOrderData(res.data.data);
                } catch (error) {
                    console.error('Lỗi tải thông tin đơn hàng:', error);
                }
            }
        };
        fetchOrder();
    }, [orderId, status, dispatch]);

    return (
        <div className="kfc-page-wrapper">
            <div className="container">
                <div className="success-card text-center py-5">
                    <div className="success-icon-wrapper mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                    </div>

                    <h2 className="success-title mb-3 fw-bold">ĐẶT HÀNG THÀNH CÔNG!</h2>

                    <div className="order-info-box bg-light p-4 rounded-4 mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                        <p className="success-message text-muted mb-3 fs-5">
                            Đơn hàng đã được tiếp nhận.<br />
                            Chuẩn bị thưởng thức <strong>"Vị ngon trên từng ngón tay"</strong> nhé!
                        </p>
                        {orderData && (
                            <div className="mt-3 border-top pt-3">
                                <div className="row g-2">
                                    <div className="col-6 cursor-pointer" onClick={() => handleCopy(orderData.orderNumber, 'mã đơn hàng')}>
                                        <p className="mb-1 text-uppercase fw-bold small text-muted">
                                            Mã đơn hàng <i className="bi bi-copy ms-1"></i>
                                        </p>
                                        <h4 className="text-danger fw-bold">{orderData.orderNumber}</h4>
                                    </div>
                                    <div className="col-6 cursor-pointer" onClick={() => handleCopy(orderData.deliveryInfo?.phone, 'số điện thoại')}>
                                        <p className="mb-1 text-uppercase fw-bold small text-muted">
                                            Số điện thoại <i className="bi bi-copy ms-1"></i>
                                        </p>
                                        <h4 className="text-dark fw-bold">{orderData.deliveryInfo?.phone}</h4>
                                    </div>
                                </div>
                                <p className="small text-muted mt-3 mb-0">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Click vào thông tin trên để <strong>Sao chép</strong> nhanh.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="order-actions d-flex justify-content-center gap-3">
                        <Link to="/" className="btn btn-outline-dark px-4 py-2 rounded-pill fw-bold">
                            <i className="bi bi-house-door me-2"></i>
                            Về Trang Chủ
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/my-orders" className="btn btn-danger px-4 py-2 rounded-pill fw-bold">
                                <i className="bi bi-receipt me-2"></i>
                                Xem Đơn Hàng
                            </Link>
                        ) : (
                            <Link to="/track-order" className="btn btn-danger px-4 py-2 rounded-pill fw-bold">
                                <i className="bi bi-search me-2"></i>
                                Tra Cứu Đơn
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
