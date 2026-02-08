import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userApi from '../../../../api/userApi';
import useUserProfile from '../../../../hooks/useUserProfile';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import EmptyState from '../../../../components/EmptyState';
import AddressModal from '../AddressModal';
import './AccountAddress.css';

const AccountAddress = () => {
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressData, setEditingAddressData] = useState(null); // stores the address object
    const [editingAddressIndex, setEditingAddressIndex] = useState(null); // stores the index

    // Use custom hook for user profile
    const { addresses, refetch } = useUserProfile();

    const handleAddAddress = () => {
        setEditingAddressData(null);
        setEditingAddressIndex(null);
        setShowAddressForm(true);
    };

    const handleEditAddress = (address, idx) => {
        setEditingAddressData(address);
        setEditingAddressIndex(idx);
        setShowAddressForm(true);
    };

    const handleSaveAddress = async (addressForm) => {
        try {
            const addressData = {
                label: addressForm.label,
                fullAddress: addressForm.fullAddress,
                isDefault: addressForm.isDefault,
                latitude: addressForm.latitude,
                longitude: addressForm.longitude
            };

            if (editingAddressIndex !== null) {
                const response = await userApi.updateAddress(editingAddressIndex, addressData);
                if (response.data?.status) {
                    toast.success('Cập nhật địa chỉ thành công!');
                    setShowAddressForm(false);
                    refetch();
                }
            } else {
                const response = await userApi.addAddress({
                    ...addressData,
                    isDefault: addressForm.isDefault || addresses.length === 0
                });
                if (response.data?.status) {
                    toast.success('Thêm địa chỉ thành công!');
                    setShowAddressForm(false);
                    refetch();
                }
            }
        } catch (error) {
            toast.error('Không thể lưu địa chỉ. Vui lòng thử lại.');
        }
    };

    const handleDeleteAddress = async (idx) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                const response = await userApi.deleteAddress(idx);
                if (response.data?.status) {
                    toast.success('Xóa địa chỉ thành công!');
                    refetch();
                }
            } catch (error) {
                toast.error('Không thể xóa địa chỉ. Vui lòng thử lại.');
            }
        }
    };

    const handleSetDefaultAddress = async (idx) => {
        try {
            const address = addresses[idx];
            const response = await userApi.updateAddress(idx, {
                label: address.label,
                fullAddress: address.fullAddress,
                isDefault: true,
                latitude: address.latitude,
                longitude: address.longitude
            });
            if (response.data?.status) {
                toast.success('Cập nhật địa chỉ mặc định thành công!');
                refetch();
            }
        } catch (error) {
            toast.error('Không thể cập nhật địa chỉ mặc định.');
        }
    };

    return (
        <>
            <Card>

                <div className="addresses-header">
                    <h3>Sổ địa chỉ</h3>
                    <Button
                        variant="primary"
                        onClick={handleAddAddress}
                        size="sm"
                        startIcon={<i className="bi bi-plus-lg"></i>}
                    >
                        Thêm địa chỉ
                    </Button>
                </div>

                {loadingAddresses ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : (
                    <div className="addresses-list">
                        {addresses && addresses.length > 0 ? (
                            addresses.map((address, idx) => (
                                <Card key={idx} className="address-item">
                                    <div className="address-item-header">
                                        <h5 className="address-label">
                                            {address.label}
                                            {address.isDefault && <span className="badge bg-kfc-red">Mặc định</span>}
                                        </h5>
                                        <div className="address-actions">
                                            <button
                                                className="action-btn action-btn--edit"
                                                onClick={() => handleEditAddress(address, idx)}
                                                title="Chỉnh sửa"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            {!address.isDefault && (
                                                <button
                                                    className="action-btn action-btn--default"
                                                    onClick={() => handleSetDefaultAddress(idx)}
                                                    title="Đặt làm mặc định"
                                                >
                                                    Đặt làm mặc định
                                                </button>
                                            )}
                                            <button
                                                className="action-btn action-btn--delete"
                                                onClick={() => handleDeleteAddress(idx)}
                                                title="Xóa"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="address-text">{address.fullAddress}</p>
                                </Card>
                            ))
                        ) : (
                            <EmptyState
                                title="Sổ địa chỉ trống"
                                description="Bạn chưa có địa chỉ nào được lưu. Thêm địa chỉ mới để đặt hàng nhanh hơn!"
                                className="address-empty"
                            />
                        )}
                    </div>
                )}

            </Card>
            <AddressModal
                show={showAddressForm}
                onClose={() => setShowAddressForm(false)}
                onSubmit={handleSaveAddress}
                initialData={editingAddressData}
            />
        </>
    );
};

export default AccountAddress;
