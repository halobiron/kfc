import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_SHIPPING_CONFIG } from '../../utils/shipping';

import './TermsOfUse.css';

const TermsOfUse = () => {
    const [shippingConfig, setShippingConfig] = useState(DEFAULT_SHIPPING_CONFIG);

    useEffect(() => {
        const fetchShippingConfig = async () => {
            try {
                const response = await axiosClient.get('/config/shipping');
                if (response.data?.status && response.data?.data) {
                    setShippingConfig(response.data.data);
                }
            } catch (error) {
                // Fallback to defaults on error
            }
        };

        fetchShippingConfig();
    }, []);

    return (
        <>
            <h1 className="policy-title">CHÍNH SÁCH HOẠT ĐỘNG</h1>

            <section className="policy-section">
                <h2>1. HƯỚNG DẪN ĐẶT HÀNG</h2>

                <div className="policy-subsection">
                    <h3>Cách 1: Đặt hàng trực tuyến qua Website/App</h3>
                    <p>Để đặt hàng trực tuyến, bạn thực hiện các bước sau:</p>
                    <ol>
                        <li>Truy cập website hoặc mở ứng dụng KFC</li>
                        <li>Chọn các món ăn yêu thích và thêm vào giỏ hàng</li>
                        <li>Nhập địa chỉ giao hàng chi tiết (số nhà, tên đường, quận/huyện, thành phố)</li>
                        <li>Chọn phương thức thanh toán (Tiền mặt hoặc Thẻ tín dụng/ATM)</li>
                        <li>Xác nhận đơn hàng</li>
                        <li>Nhận email xác nhận đơn hàng thành công</li>
                    </ol>
                </div>

                <div className="policy-subsection">
                    <h3>Cách 2: Gọi điện thoại đặt hàng</h3>
                    <p>Bạn có thể gọi đến tổng đài KFC theo số:</p>
                    <div className="hotline-card">
                        <div className="hotline-icon">
                            <i className="bi bi-telephone-fill"></i>
                        </div>
                        <div className="hotline-info">
                            <span className="hotline-number">1900 6886</span>
                            <span className="hotline-hours">Giờ làm việc: 09:00 - 21:30 (Hàng ngày)</span>
                        </div>
                    </div>
                    <p>Cung cấp thông tin sau cho nhân viên tổng đài:</p>
                    <ul>
                        <li>Họ tên người nhận</li>
                        <li>Số điện thoại liên hệ</li>
                        <li>Địa chỉ giao hàng cụ thể</li>
                        <li>Các món ăn muốn đặt</li>
                    </ul>
                </div>
            </section>

            <section className="policy-section">
                <h2>2. LƯU Ý VỀ ĐƠN HÀNG</h2>

                <div className="policy-subsection">
                    <h3>Thời gian nhận đơn hàng</h3>
                    <p>
                        KFC nhận đơn hàng từ <strong>09:00 - 21:30</strong> hàng ngày.
                        Các đơn hàng đặt ngoài khung giờ này sẽ được xử lý vào ngày hôm sau.
                    </p>
                </div>

                <div className="policy-subsection">
                    <h3>Giá trị đơn hàng tối thiểu</h3>
                    <ul>
                        <li><strong>Khu vực 1-2 (Hà Nội, TP.HCM, Đà Nẵng...):</strong> 80.000đ</li>
                        <li><strong>Khu vực 3-4 (Các tỉnh thành khác):</strong> 50.000đ</li>
                    </ul>
                    <p className="text-muted">
                        <em>Đơn hàng có giá trị thấp hơn mức tối thiểu sẽ không được chấp nhận.</em>
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>3. PHÍ VẬN CHUYỂN</h2>

                <div className="policy-subsection">
                    <h3>Phí giao hàng tiêu chuẩn</h3>
                    <div className="shipping-table">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Giá trị đơn hàng</th>
                                    <th>Phí vận chuyển</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dưới {formatCurrency(shippingConfig.freeShippingThreshold)}</td>
                                    <td>{formatCurrency(shippingConfig.shippingFee)}</td>
                                </tr>
                                <tr>
                                    <td>Từ {formatCurrency(shippingConfig.freeShippingThreshold)} trở lên</td>
                                    <td className="text-success"><strong>Miễn phí</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-muted">
                        <em>Phí giao hàng có thể thay đổi theo từng thời điểm. Hệ thống sẽ hiển thị phí chính xác tại bước thanh toán.</em>
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>4. GIAO NHẬN HÀNG</h2>

                <div className="policy-subsection">
                    <h3>Thời gian giao hàng</h3>
                    <p>
                        Thời gian giao hàng dự kiến từ <strong>30-45 phút</strong> kể từ khi xác nhận đơn hàng.
                        Trong giờ cao điểm (11:00-13:00 và 17:00-19:00), thời gian có thể kéo dài thêm 10-15 phút.
                    </p>
                </div>

                <div className="policy-subsection">
                    <h3>Quy trình nhận hàng</h3>
                    <ol>
                        <li>Kiểm tra sản phẩm trước khi thanh toán</li>
                        <li>Đối chiếu với đơn hàng đã đặt</li>
                        <li>Thanh toán tiền mặt hoặc đã thanh toán trước qua thẻ</li>
                        <li>Nhận hóa đơn VAT (nếu có yêu cầu)</li>
                    </ol>
                </div>

                <div className="policy-subsection">
                    <h3>Xuất hóa đơn VAT điện tử</h3>
                    <p>
                        Khách hàng có thể quét mã QR trên hóa đơn để xuất hóa đơn VAT điện tử trong vòng
                        <strong> 60 phút</strong> sau khi nhận hàng.
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>5. CHÍNH SÁCH ĐỔI TRẢ</h2>

                <div className="policy-subsection">
                    <h3>Chỉnh sửa đơn hàng</h3>
                    <p>
                        Bạn có thể yêu cầu chỉnh sửa đơn hàng (thêm/bớt món, thay đổi địa chỉ) trong vòng
                        <strong> 3 phút đầu tiên</strong> sau khi đặt hàng thành công bằng cách:
                    </p>
                    <ul>
                        <li>Gọi ngay tổng đài 1900 6886</li>
                        <li>Cung cấp mã đơn hàng để nhân viên hỗ trợ</li>
                    </ul>
                </div>

                <div className="policy-subsection">
                    <h3>Đổi trả sản phẩm</h3>
                    <p>KFC chấp nhận đổi trả sản phẩm trong các trường hợp sau:</p>
                    <ul>
                        <li><strong>Giao nhầm món:</strong> Đổi ngay món đúng hoặc hoàn tiền</li>
                        <li><strong>Sản phẩm lỗi/hư hỏng:</strong> Đổi mới hoặc hoàn tiền 100%</li>
                        <li><strong>Thiếu món:</strong> Giao bù món thiếu hoặc hoàn tiền phần thiếu</li>
                    </ul>
                    <p className="text-danger">
                        <strong>Lưu ý:</strong> Yêu cầu đổi trả phải được thông báo ngay khi nhận hàng
                        hoặc trong vòng 30 phút sau khi nhận hàng.
                    </p>
                </div>

                <div className="policy-subsection">
                    <h3>Trường hợp không áp dụng đổi trả</h3>
                    <ul>
                        <li>Sản phẩm đã sử dụng một phần</li>
                        <li>Khách hàng tự ý làm hư hỏng sản phẩm</li>
                        <li>Khách hàng đổi ý sau khi đã nhận hàng và sản phẩm không có lỗi</li>
                    </ul>
                </div>
            </section>

            <section className="policy-section">
                <h2>6. CHÍNH SÁCH HỦY ĐƠN</h2>

                <div className="policy-subsection">
                    <p>
                        Bạn có thể hủy đơn hàng miễn phí nếu đơn hàng chưa được xác nhận hoặc chưa bắt đầu
                        chế biến. Sau khi đơn hàng đã được chế biến, việc hủy đơn có thể bị tính phí hoặc
                        không được chấp nhận.
                    </p>
                    <p>
                        Để hủy đơn hàng, vui lòng liên hệ ngay tổng đài <strong>1900 6886</strong> với mã đơn hàng.
                    </p>
                </div>
            </section>

            <section className="policy-section">
                <h2>7. LIÊN HỆ HỖ TRỢ</h2>

                <div className="policy-subsection">
                    <p>Nếu bạn cần hỗ trợ hoặc có thắc mắc, vui lòng liên hệ:</p>
                    <div className="contact-info">
                        <ul>
                            <li><strong>Hotline:</strong> 1900 6886 (09:00 - 21:30)</li>
                            <li><strong>Email:</strong> tranhailong@kfc-demo.vn</li>
                            <li><strong>Địa chỉ:</strong> Học Viện Công Nghệ Bưu Chính Viễn Thông</li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="policy-footer">
                <p className="text-muted">
                    <em>Chính sách này có hiệu lực từ ngày 01/01/2026 và có thể được cập nhật định kỳ.</em>
                </p>
            </div>
        </>
    );
};

export default TermsOfUse;
