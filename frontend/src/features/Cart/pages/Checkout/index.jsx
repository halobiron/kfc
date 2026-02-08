import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import storeApi from '../../../../api/storeApi';
import orderApi from '../../../../api/orderApi';
import CustomSelect from '../../../../components/CustomSelect';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';

import './Checkout.css';
import { getAllCoupons } from '../../couponSlice';
import { clearCart } from '../../cartSlice';
import { formatCurrency } from '../../../../utils/formatters';
import { calculateDeliveryFee } from '../../../../utils/shipping';
import { getStoresWithDistance } from '../../../../utils/geoUtils';
import useUserProfile from '../../../../hooks/useUserProfile';
import useShippingConfig from '../../../../hooks/useShippingConfig';
import useAddressSelection from '../../../../hooks/useAddressSelection';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { coupons } = useSelector((state) => state.coupons);
    const { items: cartItems } = useSelector((state) => state.cart);

    // Use custom hooks for API data
    const { profile, addresses: savedAddresses } = useUserProfile();
    const { config: shippingConfig } = useShippingConfig();

    const {
        options: locationOptions,
        handleSelect: resolveLocation,
        isLoading: isResolvingLocation
    } = useAddressSelection(savedAddresses);

    const [stores, setStores] = useState([]);

    useEffect(() => {
        dispatch(getAllCoupons());

        // Fetch stores using storeApi
        const fetchStores = async () => {
            try {
                const response = await storeApi.getAll();
                setStores(response.data.data || []);
            } catch (error) {
                console.error('Lỗi khi tải cửa hàng:', error);
                toast.error('Không thể tải danh sách cửa hàng.');
            }
        };

        fetchStores();
    }, [dispatch]);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    const [deliveryType, setDeliveryType] = useState('delivery');
    const [selectedStore, setSelectedStore] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
    const deliveryFee = useMemo(
        () => calculateDeliveryFee({ subtotal, deliveryType, config: shippingConfig }),
        [deliveryType, subtotal, shippingConfig]
    );

    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;

        if (appliedCoupon.type === 'fixed') {
            return appliedCoupon.discount;
        } else if (appliedCoupon.type === 'percent') {
            return (subtotal * appliedCoupon.discount) / 100;
        } else if (appliedCoupon.type === 'shipping') {
            return deliveryFee;
        }
        return 0;
    }, [appliedCoupon, subtotal, deliveryFee]);

    const total = useMemo(() => Math.max(0, subtotal + deliveryFee - discountAmount), [subtotal, deliveryFee, discountAmount]);

    // Auto-fill form data from user profile
    useEffect(() => {
        if (profile) {
            const defaultAddress = savedAddresses.find(addr => addr.isDefault);
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || profile.name || '',
                phone: prev.phone || profile.phone || '',
                address: prev.address || defaultAddress?.fullAddress || ''
            }));
        }
    }, [profile, savedAddresses]);

    const handleApplyCoupon = () => {
        if (!couponCode) return;

        const coupon = Array.isArray(coupons)
            ? coupons.find(c => c.code === couponCode.toUpperCase())
            : null;

        if (!coupon) {
            setCouponError('Mã khuyến mãi không hợp lệ!');
            setAppliedCoupon(null);
            return;
        }

        if (!coupon.isActive) {
            setCouponError('Mã khuyến mãi đã ngưng hoạt động!');
            setAppliedCoupon(null);
            return;
        }

        const now = new Date();
        if (coupon.startDate && new Date(coupon.startDate) > now) {
            setCouponError('Mã khuyến mãi chưa đến đợt sử dụng!');
            setAppliedCoupon(null);
            return;
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
            setCouponError('Mã khuyến mãi đã hết hạn!');
            setAppliedCoupon(null);
            return;
        }

        if (coupon.maxUsage <= coupon.usedCount) {
            setCouponError('Mã khuyến mãi đã hết lượt sử dụng!');
            setAppliedCoupon(null);
            return;
        }

        if (subtotal < coupon.minOrder) {
            setCouponError(`Đơn tối thiểu để áp dụng là ${formatCurrency(coupon.minOrder)}`);
            setAppliedCoupon(null);
            return;
        }

        setAppliedCoupon(coupon);
        setCouponError('');
    };

    const handleAddressSelect = async (val) => {
        if (!val) return;

        const location = await resolveLocation(val);
        if (location) {
            setFormData(prev => ({
                ...prev,
                address: location.address
            }));
            toast.info(`Đã chọn địa chỉ!`, { autoClose: 2000 });
        }
    };

    const handleFindNearestStore = (lat, lng) => {
        const sorted = getStoresWithDistance(lat, lng, stores);
        setStores(sorted);

        if (sorted.length > 0 && sorted[0].distance !== null) {
            const nearest = sorted[0];
            setSelectedStore(nearest.id || nearest._id);
            toast.success(`Đã tìm thấy quán gần: ${nearest.name} (${nearest.distance.toFixed(1)}km)`);
        }
    };

    const handleLocationSearchSelect = async (val) => {
        if (!val) return;

        const location = await resolveLocation(val);

        if (location) {
            handleFindNearestStore(location.lat, location.lng);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        // Basic Validation
        if (!formData.fullName || !formData.phone) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (deliveryType === 'delivery' && !formData.address) {
            toast.error("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        if (deliveryType === 'pickup' && !selectedStore) {
            toast.error("Vui lòng chọn cửa hàng để lấy món!");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                deliveryInfo: {
                    name: formData.fullName,
                    phone: formData.phone,
                    address: deliveryType === 'delivery' ? formData.address : null,
                    storeId: deliveryType === 'pickup' ? selectedStore : null
                },
                deliveryType,
                paymentMethod,
                couponCode: appliedCoupon?.code || null,
                note: formData.note,
                total
            };

            const response = await orderApi.createOrder(orderData);

            // Clear cart immediately upon successful request
            dispatch(clearCart());

            if (response.data.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
                return;
            }

            toast.success(
                <div>
                    <strong>Đặt hàng thành công!</strong><br />
                    Mã đơn: {response.data.data._id}<br />
                    Tổng: {formatCurrency(total)}
                </div>,
                { autoClose: 5000 }
            );

            // Redirect to Success Page with orderId
            navigate(`/order-success?orderId=${response.data.data._id}`);
        } catch (error) {
            toast.error('Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="kfc-page-wrapper">
            <div className="container kfc-container">
                <div className="section-header">
                    <h2>Thanh Toán</h2>
                    <hr className="section-underline" />
                </div>

                <div className="checkout-layout">
                    {/* Left Column: Information & Payment */}
                    <div className="checkout-form-section">
                        {/* Delivery Type Selection */}
                        <Card>
                            <h3 className="form-title">
                                <i className="bi bi-bicycle"></i>
                                Hình Thức Nhận Hàng
                            </h3>
                            <div className="checkout-options-grid">
                                <div
                                    className={`checkout-option ${deliveryType === 'delivery' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryType('delivery')}
                                >
                                    <i className="bi bi-house-door-fill"></i>
                                    <span>Giao hàng tận nơi</span>
                                    <small>Giao tận địa chỉ</small>
                                </div>

                                <div
                                    className={`checkout-option ${deliveryType === 'pickup' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryType('pickup')}
                                >
                                    <i className="bi bi-shop"></i>
                                    <span>Đặt Hẹn Đến Lấy</span>
                                    <small>Miễn phí ship</small>
                                </div>
                            </div>
                        </Card>

                        {/* Delivery/Pickup Info */}
                        <Card>
                            <h3 className="form-title">
                                <i className="bi bi-geo-alt-fill"></i>
                                {deliveryType === 'delivery' ? 'Thông Tin Giao Hàng' : 'Thông Tin Nhận Hàng'}
                            </h3>
                            <div className="row">
                                <FormInput
                                    containerClass="col-md-6"
                                    label="Họ và tên *"
                                    type="text"
                                    name="fullName"
                                    placeholder="Nhập họ tên"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <FormInput
                                    containerClass="col-md-6"
                                    label="Số điện thoại *"
                                    type="tel"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />

                                {deliveryType === 'delivery' ? (
                                    <>
                                        {savedAddresses.length > 0 && (
                                            <CustomSelect
                                                className="col-12 mb-3"
                                                label={<><i className="bi bi-journal-bookmark-fill me-1 text-danger"></i>Chọn từ sổ địa chỉ</>}
                                                options={locationOptions.filter(opt => opt.label === 'Từ địa chỉ đã lưu')[0]?.options || []}
                                                value=""
                                                onChange={handleAddressSelect}
                                                placeholder="-- Chọn địa chỉ đã lưu --"
                                            />
                                        )}

                                        <FormInput
                                            containerClass="col-12"
                                            label="Địa chỉ nhận hàng *"
                                            type="text"
                                            name="address"
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <FormInput
                                            containerClass="col-12"
                                            label="Ghi chú cho tài xế"
                                            type="textarea"
                                            name="note"
                                            rows="2"
                                            placeholder="Ví dụ: Lấy nhiều tương ớt, không lấy đá, giao lên tận phòng..."
                                            value={formData.note}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <CustomSelect
                                            className="col-12 mb-3"
                                            label={<><i className="bi bi-geo-alt-fill me-1 text-danger"></i>Tìm quán theo vị trí...</>}
                                            options={locationOptions}
                                            value=""
                                            onChange={handleLocationSearchSelect}
                                            placeholder="Chọn cách tìm kiếm..."
                                        />

                                        <div className="col-12">
                                            {isResolvingLocation && <div className="text-center small text-muted mb-2"><span className="spinner-border spinner-border-sm me-1"></span>Đang tìm kiếm...</div>}

                                            <CustomSelect
                                                className="mb-3"
                                                label="Chọn cửa hàng KFC *"
                                                options={[
                                                    { value: '', label: '-- Chọn cửa hàng --' },
                                                    ...stores.map(store => ({
                                                        value: store.id || store._id,
                                                        label: `${store.name} - ${store.address}${store.distance !== undefined ? ` (${store.distance.toFixed(1)}km)` : ''}`
                                                    }))
                                                ]}
                                                value={selectedStore}
                                                onChange={(val) => setSelectedStore(val)}
                                                placeholder="Chọn cửa hàng"
                                            />
                                            <small className="text-muted store-pickup-hint">
                                                <i className="bi bi-info-circle"></i> Vui lòng đến cửa hàng trong vòng 30 phút sau khi đặt
                                            </small>
                                        </div>
                                        <FormInput
                                            containerClass="col-12"
                                            label="Ghi chú cho cửa hàng"
                                            type="textarea"
                                            name="note"
                                            rows="2"
                                            placeholder="Ví dụ: Tôi sẽ đến lấy lúc 18h..."
                                            value={formData.note}
                                            onChange={handleInputChange}
                                        />
                                    </>
                                )}
                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <h3 className="form-title">
                                <i className="bi bi-credit-card-2-front-fill"></i>
                                Phương Thức Thanh Toán
                            </h3>
                            <div className="checkout-options-grid payment-methods">
                                {[
                                    { id: 'cod', icon: 'bi bi-cash-coin', label: 'Thanh toán khi nhận hàng (COD)' },
                                    { id: 'payos', icon: 'bi bi-qr-code-scan', label: 'Thanh toán Online (QR/Thẻ/Ví)' }
                                ].map(method => (
                                    <div
                                        key={method.id}
                                        className={`checkout-option ${paymentMethod === method.id ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <i className={method.icon}></i>
                                        <span>{method.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-summary-section">
                        <Card className="checkout-summary-sidebar">
                            <h3 className="form-title">
                                Tóm Tắt Đơn Hàng
                            </h3>

                            <div>
                                {cartItems.map(item => (
                                    <div key={item._id || item.id} className="summary-item">
                                        <div className="item-name-qty">
                                            <span className="item-qty">{item.quantity}x</span>
                                            <span>{item.title || item.name}</span>
                                        </div>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            {/* Promotion Section */}
                            <div className="mb-3">
                                <label className="form-label d-flex justify-content-between align-items-center">
                                    <span className="fw-bold"><i className="bi bi-ticket-perforated-fill me-1 text-danger"></i>Mã khuyến mãi</span>
                                </label>
                                <div className="d-flex gap-2 align-items-start">
                                    <div className="flex-grow-1">
                                        <FormInput
                                            type="text"
                                            placeholder="Nhập mã voucher"
                                            value={couponCode}
                                            containerClass="mb-0"
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <Button
                                        variant="dark"
                                        onClick={handleApplyCoupon}
                                        className="btn-apply-coupon"
                                    >
                                        Áp dụng
                                    </Button>
                                </div>

                                {couponError && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{couponError}</div>}
                                {appliedCoupon && (
                                    <div className="alert alert-success mt-2 d-flex justify-content-between align-items-center p-2 mb-0">
                                        <small><i className="bi bi-check-circle-fill me-1"></i> Đã áp dụng: <strong>{appliedCoupon.code}</strong></small>
                                        <button className="btn-close btn-close-white p-2 small" onClick={removeCoupon} aria-label="Remove"></button>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính</span>
                                <span className="fw-bold">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Phí giao hàng</span>
                                <div className="text-end">
                                    {deliveryType === 'pickup' ? (
                                        <span className="text-success fw-bold">Miễn phí <i className="bi bi-check-circle-fill"></i></span>
                                    ) : (
                                        <>
                                            {deliveryFee === 0 ? "Miễn phí" : formatCurrency(deliveryFee)}
                                            {appliedCoupon?.type === 'shipping' && <div className="text-success small fst-italic">(Đã giảm phí ship)</div>}
                                        </>
                                    )}
                                </div>
                            </div>
                            {discountAmount > 0 && (
                                <div className="d-flex justify-content-between mb-2 text-danger">
                                    <span><i className="bi bi-tag-fill me-1"></i>Giảm tiền</span>
                                    <span className="fw-bold">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            <div className="summary-divider thick"></div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold fs-5">TỔNG CỘNG</span>
                                <span className="fw-bold fs-4 text-danger">{formatCurrency(total)}</span>
                            </div>

                            <Button
                                variant="primary"
                                onClick={handlePlaceOrder}
                                loading={isSubmitting}
                                fullWidth
                            >
                                ĐẶT HÀNG
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
