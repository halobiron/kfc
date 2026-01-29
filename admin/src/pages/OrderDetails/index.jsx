
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPrinter, FiXCircle, FiCheckCircle, FiTruck, FiPackage, FiClock, FiMapPin, FiPhone, FiMail, FiUser } from 'react-icons/fi';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on ID (simplified logic)
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Mock API call simulation
        const mockOrder = {
            id: id || '#1001',
            date: '25/01/2026 10:30',
            customer: {
                name: 'Nguyen Van A',
                email: 'nguyenvana@gmail.com',
                phone: '0901234567',
                address: '123 Nguyen Trai, Thanh Xuan, Ha Noi'
            },
            status: 'Hoàn thành',
            paymentMethod: 'Thanh toán trực tuyến (Momo)',
            paymentStatus: 'Đã thanh toán',
            items: [
                { id: 1, name: 'Combo Gà Rán Truyền Thống', quantity: 2, price: 89000, total: 178000, note: 'Không cay' },
                { id: 2, name: 'Pepsi (L)', quantity: 1, price: 11000, total: 11000, note: '' }
            ],
            subtotal: 189000,
            discount: 0,
            shippingFee: 15000,
            total: 204000,
            history: [
                { status: 'Chờ thanh toán', time: '25/01/2026 10:30' },
                { status: 'Đã xác nhận', time: '25/01/2026 10:32' },
                { status: 'Đang chuẩn bị', time: '25/01/2026 10:35' },
                { status: 'Đang giao', time: '25/01/2026 10:55' },
                { status: 'Hoàn thành', time: '25/01/2026 11:20' }
            ]
        };

        // If ID is different, maybe return different data (mocking)
        if (id === '#1002') {
            mockOrder.status = 'Đang xử lý';
            mockOrder.history = [
                { status: 'Chờ thanh toán', time: '25/01/2026 14:30' },
                { status: 'Đã xác nhận', time: '25/01/2026 14:32' }
            ];
        }

        setOrder(mockOrder);
        setStatus(mockOrder.status);
    }, [id]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        // Alert or API call would go here
        toast.success(`Cập nhật trạng thái đơn hàng thành: ${newStatus}`);
    };

    if (!order) return <div className="text-center p-5"><div className="spinner spinner-lg"></div></div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Hoàn thành': return 'badge-success';
            case 'Đang giao': return 'badge-info';
            case 'Đang chuẩn bị': return 'badge-warning';
            case 'Đã hủy': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            {/* Header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div className="d-flex align-items-center">
                    <button onClick={() => navigate('/orders')} className="btn btn-link text-dark p-0 me-3" title="Quay lại">
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="h2 mb-0 font-weight-bold" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                            Đơn hàng {order.id}
                        </h1>
                        <span className="text-muted small"><FiClock className="me-1" /> {order.date}</span>
                    </div>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                            <FiPrinter className="me-2" /> In hóa đơn
                        </button>
                    </div>
                    {status !== 'Đã hủy' && status !== 'Hoàn thành' && (
                        <button
                            type="button"
                            className="btn btn-sm btn-danger d-flex align-items-center"
                            onClick={() => handleStatusChange('Đã hủy')}
                        >
                            <FiXCircle className="me-2" /> Hủy đơn
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column - Order Info */}
                <div className="col-lg-8">
                    {/* Order Items */}
                    <div className="card mb-4">
                        <div className="card-header">Chi tiết sản phẩm</div>
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="">
                                    <tr>
                                        <th style={{ minWidth: '250px' }}>Sản phẩm</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-end">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="fw-bold">{item.name}</div>
                                                {item.note && <small className="text-muted fst-italic">Ghi chú: {item.note}</small>}
                                            </td>
                                            <td className="text-center">x{item.quantity}</td>
                                            <td className="text-end">{item.price.toLocaleString()} đ</td>
                                            <td className="text-end fw-bold">{item.total.toLocaleString()} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-light">
                                    <tr>
                                        <td colSpan="3" className="text-end">Tạm tính:</td>
                                        <td className="text-end fw-bold">{order.subtotal.toLocaleString()} đ</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="text-end">Phí vận chuyển:</td>
                                        <td className="text-end">{order.shippingFee.toLocaleString()} đ</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="text-end border-0" style={{ fontSize: '16px' }}><strong>Tổng cộng:</strong></td>
                                        <td className="text-end border-0" style={{ fontSize: '18px', color: 'var(--kfc-red)' }}><strong>{order.total.toLocaleString()} đ</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Order History / Timeline */}
                    <div className="card">
                        <div className="card-header">Lịch sử đơn hàng</div>
                        <div className="card-body">
                            <div className="timeline">
                                {order.history.map((h, idx) => (
                                    <div className="d-flex mb-3" key={idx}>
                                        <div className="me-3 d-flex flex-column align-items-center">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center text-white ${idx === order.history.length - 1 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: '30px', height: '30px', fontSize: '14px' }}>
                                                {idx === order.history.length - 1 ? <FiCheckCircle /> : <FiClock />}
                                            </div>
                                            {idx !== order.history.length - 1 && <div className="h-99 bg-secondary opacity-25" style={{ width: '2px', minHeight: '30px', margin: '4px 0' }}></div>}
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{h.status}</h6>
                                            <small className="text-muted">{h.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Status */}
                <div className="col-lg-4">
                    {/* Status Update Card */}
                    <div className="card mb-4">
                        <div className="card-header">Trạng thái đơn hàng</div>
                        <div className="card-body">
                            <div className="mb-3 text-center">
                                <span className={`badge ${getStatusBadge(status)} p-2 fs-6 mb-3`}>{status}</span>
                            </div>
                            <label className="form-label fw-bold">Cập nhật trạng thái:</label>
                            <select
                                className="form-select mb-3"
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={status === 'Đã hủy' || status === 'Hoàn thành'}
                            >
                                <option value="Chờ thanh toán">Chờ thanh toán</option>
                                <option value="Đã xác nhận">Đã xác nhận</option>
                                <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                            <button className="btn btn-primary w-100" onClick={() => toast.success('Đã lưu trạng thái')}>
                                <FiCheckCircle className="me-2" /> Cập nhật
                            </button>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="card mb-4">
                        <div className="card-header">Thông tin khách hàng</div>
                        <div className="card-body pt-0">
                            <div className="mb-3 d-flex align-items-start">
                                <FiUser className="mt-1 me-3 text-muted" />
                                <div>
                                    <small className="text-muted d-block uppercase">Khách hàng</small>
                                    <span className="fw-bold">{order.customer.name}</span>
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-start">
                                <FiMail className="mt-1 me-3 text-muted" />
                                <div>
                                    <small className="text-muted d-block">Email</small>
                                    <span>{order.customer.email}</span>
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-start">
                                <FiPhone className="mt-1 me-3 text-muted" />
                                <div>
                                    <small className="text-muted d-block">Số điện thoại</small>
                                    <span>{order.customer.phone}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-start">
                                <FiMapPin className="mt-1 me-3 text-primary" />
                                <div>
                                    <small className="text-muted d-block">Địa chỉ giao hàng</small>
                                    <span className="fw-bold">{order.customer.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetails;
