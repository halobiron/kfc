import { useState, useEffect } from 'react'
import AddStoreModal from './AddStoreModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStores, deleteStore } from '../../storeSlice';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Table from '../../../../components/Common/Table';
import { normalizeVietnamese } from '../../../../utils/formatters';
import './Stores.css';
import { FiPhone, FiClock } from 'react-icons/fi';

const Stores = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [page, setPage] = useState(1);
    
    // Thêm các biến phân trang từ Redux store
    const { stores, storesCount, resPerPage, currentPage, loading, error } = useSelector(state => state.stores);
    const { keyword } = useSelector(state => state.search);

    useEffect(() => {
        dispatch(getAllStores({ page, limit: 12 }));
    }, [dispatch, page]);

    const filteredStores = stores.filter(store => {
        const searchLower = normalizeVietnamese((keyword || '').toLowerCase());
        const name = normalizeVietnamese(store.name?.toLowerCase() || '');
        const address = normalizeVietnamese(store.address?.toLowerCase() || '');
        const phone = store.phone || '';

        return name.includes(searchLower) ||
               address.includes(searchLower) ||
               phone.includes(keyword);
    });

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
                    pagination={{
                        currentPage: currentPage || page,
                        totalPages: Math.ceil((storesCount || 0) / (resPerPage || 12)),
                        onPageChange: (newPage) => setPage(newPage)
                    }}
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
