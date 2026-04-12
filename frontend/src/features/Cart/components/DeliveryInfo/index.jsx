import { useState, useEffect } from 'react';
import Card from '../../../../components/Card';
import FormInput from '../../../../components/FormInput';
import CustomSelect from '../../../../components/CustomSelect';
import Spinner from '../../../../components/Spinner';
import './DeliveryInfo.css';

const DeliveryInfo = ({
    deliveryType,
    formData,
    handleInputChange,
    savedAddresses,
    locationOptions,
    handleAddressSelect,
    handleLocationSearchSelect,
    isResolvingLocation,
    stores,
    selectedStore,
    setSelectedStore
}) => {
    // Dropdown states cho Tỉnh/Phường
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [street, setStreet] = useState('');
    const [isCustomEditing, setIsCustomEditing] = useState(true);

    // Tự động tắt form nhập mới nếu Checkout đã truyền sẵn địa chỉ (từ profile)
    useEffect(() => {
        if (formData.address && !selectedProvince && !street && isCustomEditing) {
            setIsCustomEditing(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.address]);

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
                    setSelectedWard('');
                })
                .catch(console.error);
        } else {
            setWards([]);
        }
    }, [selectedProvince]);

    // Sync from dropdowns to formData
    useEffect(() => {
        if (isCustomEditing) {
            const pName = provinces.find(p => p.code == selectedProvince)?.name || '';
            const wName = wards.find(w => w.code == selectedWard)?.name || '';
            
            const parts = [street, wName, pName].filter(Boolean);
            const fullAddress = parts.join(', ');
            
            if (fullAddress !== formData.address) {
                handleInputChange({ target: { name: 'address', value: fullAddress } });
            }
        }
    }, [selectedProvince, selectedWard, street, isCustomEditing]);

    const handleSavedAddressSelect = (val) => {
        // Reset manual edits
        setIsCustomEditing(false);
        setSelectedProvince('');
        setSelectedWard('');
        setStreet('');
        handleAddressSelect(val);
    };

    return (
        <Card>
            <h3 className="form-title">
                <i className="bi bi-geo-alt-fill"></i>
                {deliveryType === 'Giao hàng' ? 'Thông Tin Giao Hàng' : 'Thông Tin Nhận Hàng'}
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

                {deliveryType === 'Giao hàng' ? (
                    <>
                        <CustomSelect
                            className="col-12 mb-3"
                            label={<><i className="bi bi-geo-alt-fill me-1 text-danger"></i>Chọn nhanh địa chỉ</>}
                            options={locationOptions}
                            value=""
                            onChange={handleSavedAddressSelect}
                            placeholder="-- Vị trí hiện tại hoặc địa chỉ đã lưu --"
                        />

                        {isCustomEditing ? (
                            <>
                                <label className="form-label col-12 mb-2">Địa chỉ nhận hàng *</label>
                                <CustomSelect
                                    className="col-md-6 mb-3"
                                    options={[{ value: '', label: 'Tỉnh/Thành' }, ...provinces.map(p => ({ value: p.code, label: p.name }))]}
                                    value={selectedProvince}
                                    onChange={v => setSelectedProvince(v)}
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
                                    name="street"
                                    placeholder="Số nhà, tên đường..."
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    required={isCustomEditing}
                                />
                                <div className="col-12 mb-3 small text-muted">
                                    <i className="bi bi-info-circle"></i> Kết quả: <strong>{formData.address || '(Chưa có địa chỉ)'}</strong>
                                </div>
                            </>
                        ) : (
                            <div className="col-12 mb-3">
                                <div className="d-flex justify-content-between align-items-end mb-1">
                                    <label className="form-label mb-0">Địa chỉ nhận hàng *</label>
                                    <button type="button" className="btn btn-sm btn-link text-danger p-0 text-decoration-none" onClick={() => {
                                        setIsCustomEditing(true);
                                        handleInputChange({ target: { name: 'address', value: '' } });
                                    }}>
                                        <i className="bi bi-pencil-square me-1"></i>Nhập địa chỉ khác
                                    </button>
                                </div>
                                <FormInput
                                    containerClass="w-100"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    readOnly={true}
                                    required
                                />
                            </div>
                        )}

                        <CustomSelect
                            className="col-12 mb-3"
                            label="Chế biến tại cửa hàng *"
                            options={[
                                { value: '', label: '-- Chọn cửa hàng --' },
                                ...stores.map(store => ({
                                    value: store.id || store._id,
                                    label: `${store.name} - ${store.address}`
                                }))
                            ]}
                            value={selectedStore}
                            onChange={(val) => setSelectedStore(val)}
                            placeholder="Chọn cửa hàng"
                        />

                        {/* <FormInput
                            containerClass="col-12"
                            label="Ghi chú cho tài xế"
                            type="textarea"
                            name="note"
                            rows="2"
                            placeholder="Ví dụ: Lấy nhiều tương ớt, không lấy đá, giao lên tận phòng..."
                            value={formData.note}
                            onChange={handleInputChange}
                        /> */}
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
                            {isResolvingLocation && <div className="text-center small text-muted mb-2"><Spinner size="sm" variant={null} className="me-1" />Đang tìm kiếm...</div>}

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
                        {/* <FormInput
                            containerClass="col-12"
                            label="Ghi chú cho cửa hàng"
                            type="textarea"
                            name="note"
                            rows="2"
                            placeholder="Ví dụ: Tôi sẽ đến lấy lúc 18h..."
                            value={formData.note}
                            onChange={handleInputChange}
                        /> */}
                    </>
                )}
            </div>
        </Card>
    );
};

export default DeliveryInfo;
