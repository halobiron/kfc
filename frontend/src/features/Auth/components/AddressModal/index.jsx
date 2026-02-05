import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import './AddressModal.css';

const AddressModal = ({ show, onClose, onSubmit, initialData }) => {
    const [addressForm, setAddressForm] = useState({
        label: '',
        fullAddress: '',
        isDefault: false,
        latitude: null,
        longitude: null
    });
    const [gettingLocation, setGettingLocation] = useState(false);

    useEffect(() => {
        if (show && initialData) {
            setAddressForm({
                label: initialData.label || '',
                fullAddress: initialData.fullAddress || '',
                isDefault: initialData.isDefault || false,
                latitude: initialData.latitude || null,
                longitude: initialData.longitude || null
            });
        } else if (show) {
            // Reset form when opening for create new
            setAddressForm({
                label: '',
                fullAddress: '',
                isDefault: false,
                latitude: null,
                longitude: null
            });
        }
    }, [show, initialData]);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Trình duyệt không hỗ trợ Geolocation');
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Cập nhật tọa độ ngay lập tức
                setAddressForm(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));

                try {
                    // Reverse Geocoding sử dụng OpenStreetMap Nominatim API (Miễn phí)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();

                    if (data && data.display_name) {
                        setAddressForm(prev => ({
                            ...prev,
                            fullAddress: data.display_name,
                            latitude,
                            longitude
                        }));
                        toast.success('Đã lấy được địa chỉ!');
                    } else {
                        toast.warning('Lấy được tọa độ nhưng không tìm thấy tên đường.');
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    toast.warning('Không thể lấy tên đường (Lỗi mạng hoặc API).');
                } finally {
                    setGettingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error('Không thể lấy vị trí của bạn. Hãy kiểm tra quyền truy cập.');
                setGettingLocation(false);
            }
        );
    };

    const handleSave = () => {
        if (!addressForm.label.trim() || !addressForm.fullAddress.trim()) {
            toast.error('Vui lòng nhập đầy đủ tên và địa chỉ');
            return;
        }
        onSubmit(addressForm);
    };

    if (!show) return null;

    return (
        <div className="address-modal-overlay" onClick={onClose}>
            <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="address-modal-header">
                    <h5>{initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}</h5>
                    <button className="btn-close-modal" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="address-modal-body">
                    <FormInput
                        label={<>Tên địa chỉ <span className="text-danger">*</span></>}
                        type="text"
                        placeholder="VD: Nhà, Công ty, Nhà bạn..."
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        required
                    />

                    <div>
                        <div className="label-with-button">
                            <label>Địa chỉ đầy đủ <span className="text-danger">*</span></label>
                            <button
                                type="button"
                                className="btn-get-location"
                                onClick={handleGetCurrentLocation}
                                disabled={gettingLocation}
                                title="Lấy vị trí hiện tại"
                            >
                                {gettingLocation ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1"></span>
                                        Đang lấy...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-geo-alt"></i> Lấy vị trí
                                    </>
                                )}
                            </button>
                        </div>
                        <FormInput
                            type="textarea"
                            placeholder="Nhập địa chỉ chi tiết (đường, quận, thành phố...)"
                            rows="3"
                            value={addressForm.fullAddress}
                            onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                            required
                        />
                    </div>

                    {(addressForm.latitude || addressForm.longitude) && (
                        <div className="location-info">
                            <small>
                                <i className="bi bi-pin-fill"></i> Tọa độ: {addressForm.latitude?.toFixed(4)}, {addressForm.longitude?.toFixed(4)}
                            </small>
                        </div>
                    )}

                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            id="addressDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        />
                        <label htmlFor="addressDefault">Đặt làm địa chỉ mặc định</label>
                    </div>
                </div>
                <div className="address-modal-footer">
                    <button className="btn btn-outline-secondary" onClick={onClose}>
                        Hủy
                    </button>
                    <Button variant="primary" onClick={handleSave}>
                        {initialData ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
