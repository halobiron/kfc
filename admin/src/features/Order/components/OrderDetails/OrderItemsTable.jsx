import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

const OrderItemsTable = ({ order }) => {
    return (
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
                        {order.items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className="fw-bold">{item.name}</div>
                                </td>
                                <td className="text-center">x{item.quantity}</td>
                                <td className="text-end">{formatCurrency(item.price)}</td>
                                <td className="text-end fw-bold">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="text-end fw-bold">Tạm tính:</td>
                            <td className="text-end">{formatCurrency(order.subtotal || order.totalAmount)}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="text-end fw-bold">Phí vận chuyển:</td>
                            <td className="text-end">{formatCurrency(order.shippingFee || 0)}</td>
                        </tr>
                        {order.couponDiscount > 0 && (
                            <tr>
                                <td colSpan="3" className="text-end fw-bold text-success">Giảm giá:</td>
                                <td className="text-end text-success">-{formatCurrency(order.couponDiscount)}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="text-end fw-bold h5">Tổng cộng:</td>
                            <td className="text-end fw-bold h5 text-danger">{formatCurrency(order.totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default OrderItemsTable;
