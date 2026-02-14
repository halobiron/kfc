import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderApi from '../../../../api/orderApi';
import { FiArrowLeft, FiXCircle, FiCheckCircle, FiTruck, FiClock } from 'react-icons/fi';
import StatusModal from '../../../../components/Common/StatusModal';
import Button from '../../../../components/Common/Button';
import { getOrderStatusMeta, ORDER_STATUS } from '../../components/OrderStatusBadge/orderStatus';
import { getErrorMessage } from '../../../../utils/errors';
import { formatDateTime } from '../../../../utils/formatters';
import './OrderDetails.css';

// Components
import OrderItemsTable from '../../components/OrderDetails/OrderItemsTable';
import OrderTimeline from '../../components/OrderDetails/OrderTimeline';
import CustomerInfoCard from '../../components/OrderDetails/CustomerInfoCard';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const data = await orderApi.get(id);
            const orderData = data.data || data;
            setOrder(orderData);
            setStatus(orderData.status);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
            toast.error(getErrorMessage(error, 'Không thể tải chi tiết đơn hàng.'));
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const openStatusModal = (newStatus) => {
        setTargetStatus(newStatus);
        setShowModal(true);
    };

    const handleConfirmStatusChange = async (note) => {
        setUpdating(true);
        try {
            await orderApi.updateStatus(id, { status: targetStatus, note });
            setStatus(targetStatus);
            toast.success(`Cập nhật trạng thái thành công`);
            setShowModal(false);
            fetchOrderDetails();
        } catch (error) {
            console.error(error);
            toast.error(getErrorMessage(error, 'Không thể cập nhật trạng thái đơn hàng.'));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner spinner-lg"></div></div>;
    if (!order) return <div className="text-center p-5">Không tìm thấy đơn hàng</div>;

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div className="d-flex align-items-center">
                    <Button variant="link" onClick={() => navigate('/orders')} className="text-dark p-0 me-3" title="Quay lại">
                        <FiArrowLeft size={24} />
                    </Button>
                    <div>
                        <h1 className="h2 mb-0 font-weight-bold">
                            Đơn hàng {order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                        </h1>
                        <span className="text-muted small">
                            <FiClock className="me-1" /> {formatDateTime(order.createdAt)}
                        </span>
                    </div>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        {/* Status buttons */}
                        {status === ORDER_STATUS.PENDING && (
                            <Button size="sm" variant="success" className="d-flex align-items-center" onClick={() => openStatusModal(ORDER_STATUS.CONFIRMED)}>
                                <FiCheckCircle className="me-2" /> Xác nhận
                            </Button>
                        )}

                        {status === ORDER_STATUS.READY && (
                            <Button size="sm" variant="primary" className="d-flex align-items-center" onClick={() => openStatusModal(ORDER_STATUS.SHIPPING)}>
                                <FiTruck className="me-2" /> Giao hàng
                            </Button>
                        )}
                        {status === ORDER_STATUS.SHIPPING && (
                            <Button size="sm" variant="success" className="d-flex align-items-center" onClick={() => openStatusModal(ORDER_STATUS.DELIVERED)}>
                                <FiCheckCircle className="me-2" /> Hoàn thành
                            </Button>
                        )}
                    </div>
                    {status !== ORDER_STATUS.CANCELLED && status !== ORDER_STATUS.DELIVERED && (
                        <Button
                            size="sm"
                            variant="danger"
                            className="d-flex align-items-center ms-2"
                            onClick={() => {
                                openStatusModal(ORDER_STATUS.CANCELLED);
                            }}
                        >
                            <FiXCircle className="me-2" /> Hủy đơn
                        </Button>
                    )}
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - Order Info */}
                <div className="col-lg-8">
                    {/* Order Items */}
                    <OrderItemsTable order={order} />

                    {/* Order Status */}
                    <OrderTimeline order={order} status={status} />
                </div>

                {/* Right Column - Customer Info */}
                <div className="col-lg-4">
                    <CustomerInfoCard order={order} />
                </div>
            </div>

            <StatusModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleConfirmStatusChange}
                status={targetStatus}
                statusLabel={getOrderStatusMeta(targetStatus).label}
                loading={updating}
                title={targetStatus === ORDER_STATUS.CANCELLED ? 'Xác nhận Hủy đơn hàng' : 'Cập nhật trạng thái'}
            />
        </>
    );
};

export default OrderDetails;
