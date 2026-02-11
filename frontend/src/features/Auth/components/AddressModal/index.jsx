import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import { reverseGeocode, getCurrentLocation } from '../../../../utils/geoUtils';
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
            setAddressForm({
                label: '',
                fullAddress: '',
                isDefault: false,
                latitude: null,
                longitude: null
            });
        }
    }, [show, initialData]);

    const handleGetCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const location = await getCurrentLocation();
            if (!location) return; // Error handled in util

            const { lat, lng } = location;

            setAddressForm(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
            }));

            // Reverse Geocoding
            const data = await reverseGeocode(lat, lng);
            if (data && data.displayName) {
                setAddressForm(prev => ({
                    ...prev,
                    fullAddress: data.displayName,
                    latitude: lat,
                    longitude: lng
                }));
                toast.success('Đã lấy được địa chỉ!');
            } else {
                toast.warning('Lấy được tọa độ nhưng không tìm thấy tên đường.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setGettingLocation(false);
        }
    };

    const handleSave = () => {
        if (!addressForm.label.trim() || !addressForm.fullAddress.trim()) {
            toast.error('Vui lòng nhập đầy đủ tên và địa chỉ');
            return;
        }
        onSubmit(addressForm);
    };

    const modalFooter = (
        <>
            <Button variant="secondary" onClick={onClose}>
                Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
                {initialData ? 'Cập nhật' : 'Thêm mới'}
            </Button>
        </>
    );

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={initialData ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
            footer={modalFooter}
        >
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
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleGetCurrentLocation}
                        disabled={gettingLocation}
                        title="Lấy vị trí hiện tại"
                        startIcon={!gettingLocation && <i className="bi bi-geo-alt"></i>}
                        loading={gettingLocation}
                    >
                        {gettingLocation ? "Đang lấy..." : "Lấy vị trí"}
                    </Button>
                </div>
                <FormInput
                    type="textarea"
                    placeholder="Nhập địa chỉ chi tiết (đường, quận, thành phố...)"
                    rows="3"
                    value={addressForm.fullAddress}
                    onChange={(e) => setAddressForm({
                        ...addressForm,
                        fullAddress: e.target.value,
                        latitude: null,
                        longitude: null
                    })}
                    required
                />
            </div>

            <div className="form-group form-check">
                <input
                    type="checkbox"
                    id="addressDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                <label htmlFor="addressDefault">Đặt làm địa chỉ mặc định</label>
            </div>
        </Modal>
    );
};

export default AddressModal;
