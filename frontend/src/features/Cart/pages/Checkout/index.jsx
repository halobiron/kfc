import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import storeApi from '../../../../api/storeApi';
import orderApi from '../../../../api/orderApi';
import DeliveryMethod from '../../components/DeliveryMethod';
import DeliveryInfo from '../../components/DeliveryInfo';
import PaymentMethod from '../../components/PaymentMethod';
import OrderSummary from '../../components/OrderSummary';

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
                        <DeliveryMethod
                            deliveryType={deliveryType}
                            setDeliveryType={setDeliveryType}
                        />

                        <DeliveryInfo
                            deliveryType={deliveryType}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            savedAddresses={savedAddresses}
                            locationOptions={locationOptions}
                            handleAddressSelect={handleAddressSelect}
                            handleLocationSearchSelect={handleLocationSearchSelect}
                            isResolvingLocation={isResolvingLocation}
                            stores={stores}
                            selectedStore={selectedStore}
                            setSelectedStore={setSelectedStore}
                        />

                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="checkout-summary-section">
                        <OrderSummary
                            cartItems={cartItems}
                            formatCurrency={formatCurrency}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            handleApplyCoupon={handleApplyCoupon}
                            couponError={couponError}
                            appliedCoupon={appliedCoupon}
                            removeCoupon={removeCoupon}
                            subtotal={subtotal}
                            deliveryFee={deliveryFee}
                            discountAmount={discountAmount}
                            total={total}
                            isSubmitting={isSubmitting}
                            handlePlaceOrder={handlePlaceOrder}
                            deliveryType={deliveryType}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

