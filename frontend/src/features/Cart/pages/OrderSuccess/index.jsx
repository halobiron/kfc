import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import orderApi from '../../../../api/orderApi';
import { clearCart } from '../../cartSlice';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
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
        window.scrollTo(0, 0);
        dispatch(clearCart());

        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const res = await orderApi.getOrderById(orderId, status === 'success');
                    setOrderData(res.data.data);
                } catch (error) {
                    console.error('Lỗi tải thông tin đơn hàng:', error);
                }
            }
        };
        fetchOrder();
    }, [orderId, status, dispatch]);

    return (
        <>
            <Card className="order-success-card">
                <i className="bi bi-check-circle-fill success-icon"></i>

                <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>

                <div className="order-info-box">
                    <p>
                        Đơn hàng đã được tiếp nhận.<br />
                        Chuẩn bị thưởng thức <strong>"Vị ngon trên từng ngón tay"</strong> nhé!
                    </p>
                    {orderData && (
                        <div className="order-summary-grid">
                            <div
                                className="order-detail-box"
                                onClick={() => handleCopy(orderData.orderNumber, 'mã đơn hàng')}
                            >
                                <p className="detail-label">
                                    Mã đơn hàng <i className="bi bi-copy"></i>
                                </p>
                                <h4 className="detail-value highlight">{orderData.orderNumber}</h4>
                            </div>
                            <div
                                className="order-detail-box"
                                onClick={() => handleCopy(orderData.deliveryInfo?.phone, 'số điện thoại')}
                            >
                                <p className="detail-label">
                                    Số điện thoại <i className="bi bi-copy"></i>
                                </p>
                                <h4 className="detail-value">{orderData.deliveryInfo?.phone}</h4>
                            </div>
                            <p className="info-help">
                                <i className="bi bi-info-circle"></i>
                                Click vào thông tin trên để <strong>Sao chép</strong> nhanh.
                            </p>
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <Button
                        to="/"
                        variant="secondary"
                        startIcon={<i className="bi bi-house-door"></i>}
                    >
                        Về Trang Chủ
                    </Button>
                    {isAuthenticated ? (
                        <Button
                            to="/my-orders"
                            variant="primary"
                            startIcon={<i className="bi bi-receipt"></i>}
                        >
                            Xem Đơn Hàng
                        </Button>
                    ) : (
                        <Button
                            to="/track-order"
                            variant="primary"
                            startIcon={<i className="bi bi-search"></i>}
                        >
                            Tra Cứu Đơn
                        </Button>
                    )}
                </div>
            </Card>
        </>
    );
};

export default OrderSuccess;
