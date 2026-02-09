import React from 'react';
import Card from '../../../../components/Card';
import FormInput from '../../../../components/FormInput';
import CustomSelect from '../../../../components/CustomSelect';
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
    return (
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
                        {savedAddresses && savedAddresses.length > 0 && (
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
    );
};

export default DeliveryInfo;
