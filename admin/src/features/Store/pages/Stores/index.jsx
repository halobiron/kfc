import React, { useState, useEffect } from 'react'
import AddStoreModal from './AddStoreModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStores, deleteStore } from '../../storeSlice';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Table from '../../../../components/Common/Table';
import './Stores.css';
import { FiPhone, FiClock } from 'react-icons/fi';

const Stores = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const { stores, loading, error } = useSelector(state => state.stores);
    const { keyword } = useSelector(state => state.search);

    useEffect(() => {
        dispatch(getAllStores());
    }, [dispatch]);

    const filteredStores = stores.filter(store =>
        (store.name && store.name.toLowerCase().includes((keyword || '').toLowerCase())) ||
        (store.address && store.address.toLowerCase().includes((keyword || '').toLowerCase())) ||
        (store.phone && store.phone.includes(keyword))
    );

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cửa hàng này?')) {
            try {
                await dispatch(deleteStore(id)).unwrap();
                toast.success('Xóa cửa hàng thành công');
            } catch (error) {
                toast.error('Không thể xóa cửa hàng');
            }
        }
    }

    const handleEdit = (store) => {
        setSelectedStore(store);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStore(null);
    };

    const columns = [
        {
            header: '#',
            className: 'ps-4',
            render: (_, i) => <span className="fw-bold">STR{1000 + i + 1}</span>
        },
        {
            header: 'Tên cửa hàng',
            className: 'fw-bold',
            key: 'name'
        },
        {
            header: 'Địa chỉ',
            className: 'text-muted small store-address-cell',
            key: 'address'
        },
        {
            header: 'Điện thoại',
            render: (store) => (
                <div className="d-flex align-items-center gap-1">
                    <FiPhone size={14} className="text-secondary" />
                    <span>{store.phone}</span>
                </div>
            )
        },
        {
            header: 'Giờ mở cửa',
            render: (store) => (
                <div className="d-flex align-items-center gap-1">
                    <FiClock size={14} className="text-secondary" />
                    <span>{store.openTime} - {store.closeTime}</span>
                </div>
            )
        },
        {
            header: 'Thao tác',
            className: 'text-end pe-4',
            render: (store) => (
                <>
                    <EditButton
                        className="me-2"
                        onClick={() => handleEdit(store)}
                    />
                    <DeleteButton
                        onClick={() => handleDelete(store._id)}
                    />
                </>
            )
        }
    ];

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center">
                <h1 className="page-title">Quản lý Cửa Hàng</h1>
                <AddButton
                    onClick={() => {
                        setSelectedStore(null);
                        setShowModal(true);
                    }}
                />
            </div>

            <div className="card">
                <div className="card-header">Danh sách cửa hàng</div>
                <Table
                    columns={columns}
                    data={filteredStores}
                    loading={loading}
                    emptyMessage={error ? error : "Chưa có cửa hàng nào được tạo."}
                />
            </div>

            {showModal && (
                <AddStoreModal
                    setShowModal={handleCloseModal}
                    initialStore={selectedStore}
                />
            )}
        </>
    )
}

export default Stores
