import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../../../api/axiosClient';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import AddressModal from '../AddressModal';
import './AccountAddress.css';

const AccountAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressData, setEditingAddressData] = useState(null); // stores the address object
    const [editingAddressIndex, setEditingAddressIndex] = useState(null); // stores the index

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await axiosClient.get('/users/profile');
            if (response.data?.status) {
                const userData = response.data.data;
                setAddresses(userData.addresses || []);
            }
        } catch (error) {
            toast.error('Không thể tải sổ địa chỉ.');
        } finally {
            setLoadingAddresses(false);
        }
    };

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
                const response = await axiosClient.put(`/users/address/update/${editingAddressIndex}`, addressData);
                if (response.data?.status) {
                    toast.success('Cập nhật địa chỉ thành công!');
                    setShowAddressForm(false);
                    fetchAddresses();
                }
            } else {
                const response = await axiosClient.post('/users/address/add', {
                    ...addressData,
                    isDefault: addressForm.isDefault || addresses.length === 0
                });
                if (response.data?.status) {
                    toast.success('Thêm địa chỉ thành công!');
                    setShowAddressForm(false);
                    fetchAddresses();
                }
            }
        } catch (error) {
            toast.error('Không thể lưu địa chỉ. Vui lòng thử lại.');
        }
    };

    const handleDeleteAddress = async (idx) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                const response = await axiosClient.delete(`/users/address/delete/${idx}`);
                if (response.data?.status) {
                    toast.success('Xóa địa chỉ thành công!');
                    fetchAddresses();
                }
            } catch (error) {
                toast.error('Không thể xóa địa chỉ. Vui lòng thử lại.');
            }
        }
    };

    const handleSetDefaultAddress = async (idx) => {
        try {
            const address = addresses[idx];
            const response = await axiosClient.put(`/users/address/update/${idx}`, {
                label: address.label,
                fullAddress: address.fullAddress,
                isDefault: true,
                latitude: address.latitude,
                longitude: address.longitude
            });
            if (response.data?.status) {
                toast.success('Cập nhật địa chỉ mặc định thành công!');
                fetchAddresses();
            }
        } catch (error) {
            toast.error('Không thể cập nhật địa chỉ mặc định.');
        }
    };

    return (
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
                            <Card key={idx} style={{ border: '1px solid #e0e0e0', padding: '1.5rem', marginBottom: '1rem', boxShadow: 'none' }}>
                                <div className="address-header">
                                    <h5>
                                        {address.label}
                                        {address.isDefault && <span className="badge-default">Mặc định</span>}
                                    </h5>
                                    <div className="address-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditAddress(address, idx)}
                                            title="Chỉnh sửa"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                className="btn-default"
                                                onClick={() => handleSetDefaultAddress(idx)}
                                                title="Đặt làm mặc định"
                                            >
                                                Đặt làm mặc định
                                            </button>
                                        )}
                                        <button
                                            className="btn-delete"
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
                        <div className="empty-addresses">
                            <i className="bi bi-geo-alt" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                            <p>Chưa có địa chỉ nào.</p>
                        </div>
                    )}
                </div>
            )}

            <AddressModal
                show={showAddressForm}
                onClose={() => setShowAddressForm(false)}
                onSubmit={handleSaveAddress}
                initialData={editingAddressData}
            />
        </Card>
    );
};

export default AccountAddress;
