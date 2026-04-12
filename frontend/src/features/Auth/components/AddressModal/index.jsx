import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import FormInput from '../../../../components/FormInput';
import CustomSelect from '../../../../components/CustomSelect';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import { getCurrentLocation } from '../../../../utils/geoUtils';
import mapApi from '../../../../api/mapApi';
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

    // Dropdown states cho Tỉnh/Phường
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [street, setStreet] = useState('');
    const [isCustomEditing, setIsCustomEditing] = useState(true);

    // Dùng để tránh over-write khi đang parse address
    const isInitializingRef = useRef(false);

    useEffect(() => {
        if (show && initialData) {
            setAddressForm({
                label: initialData.label || '',
                fullAddress: initialData.fullAddress || '',
                isDefault: initialData.isDefault || false,
                latitude: initialData.latitude || null,
                longitude: initialData.longitude || null
            });
            setIsCustomEditing(false);
            setSelectedProvince('');
            setSelectedWard('');
            setStreet('');
        } else if (show) {
            setAddressForm({
                label: '',
                fullAddress: '',
                isDefault: false,
                latitude: null,
                longitude: null
            });
            setIsCustomEditing(true);
            setSelectedProvince('');
            setSelectedWard('');
            setStreet('');
        }
    }, [show, initialData]);

    // Fetch Provinces
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/v2/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(console.error);
    }, []);

    // Fetch Wards
    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/v2/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setWards(data.wards || []);
                    if (!isInitializingRef.current) {
                        setSelectedWard('');
                    }
                })
                .catch(console.error);
        } else {
            setWards([]);
        }
    }, [selectedProvince]);

    // Sync from dropdowns to addressForm
    useEffect(() => {
        if (isCustomEditing && !gettingLocation && !isInitializingRef.current) {
            const pName = provinces.find(p => p.code == selectedProvince)?.name || '';
            const wName = wards.find(w => w.code == selectedWard)?.name || '';
            
            const parts = [street, wName, pName].filter(Boolean);
            const fullAddress = parts.join(', ');
            
            if (fullAddress !== addressForm.fullAddress) {
                setAddressForm(prev => ({ ...prev, fullAddress }));
            }
        }
    }, [selectedProvince, selectedWard, street, isCustomEditing, provinces, wards, addressForm.fullAddress, gettingLocation]);

    const handleGetCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const location = await getCurrentLocation();
            const { lat, lng } = location;

            setAddressForm(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
            }));

            // Reverse Geocoding
            const data = await mapApi.reverseGeocode(lat, lng);
            if (data && data.displayName) {
                setIsCustomEditing(false);
                setSelectedProvince('');
                setSelectedWard('');
                setStreet('');
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
            toast.error(error.message || "Có lỗi xảy ra khi lấy vị trí.");
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
                <div className="label-with-button mb-2">
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
                
                {isCustomEditing ? (
                    <div className="row">
                        <CustomSelect
                            className="col-md-6 mb-3"
                            options={[{ value: '', label: 'Tỉnh/Thành' }, ...provinces.map(p => ({ value: p.code, label: p.name }))]}
                            value={selectedProvince}
                            onChange={v => {
                                isInitializingRef.current = false;
                                setSelectedProvince(v);
                            }}
                        />
                        <CustomSelect
                            className="col-md-6 mb-3"
                            options={[{ value: '', label: 'Phường/Xã' }, ...wards.map(w => ({ value: w.code, label: w.name }))]}
                            value={selectedWard}
                            onChange={v => setSelectedWard(v)}
                        />
                        <FormInput
                            containerClass="col-12 mb-3"
                            type="text"
                            placeholder="Số nhà, tên đường..."
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required={isCustomEditing}
                        />
                        <div className="col-12 mb-3 small text-muted">
                            <i className="bi bi-info-circle"></i> Kết quả: <strong>{addressForm.fullAddress || '(Chưa có địa chỉ)'}</strong>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3">
                        <div className="d-flex justify-content-end mb-1">
                            <button type="button" className="btn btn-sm btn-link text-danger p-0 text-decoration-none" onClick={() => {
                                setIsCustomEditing(true);
                                setAddressForm(prev => ({ ...prev, fullAddress: '' }));
                            }}>
                                <i className="bi bi-pencil-square me-1"></i>Nhập địa chỉ khác
                            </button>
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
                            readOnly={true}
                        />
                    </div>
                )}
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
