import React, { useState, useEffect } from 'react'
import AddStoreModal from './AddStoreModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStores, deleteStore } from '../../storeSlice';
import './Stores.css';
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const CITY_LABELS = {
    hcm: 'TP.HCM',
    hn: 'Hà Nội',
    dn: 'Đà Nẵng',
    hp: 'Hải Phòng',
    ct: 'Cần Thơ'
};

const Stores = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const { stores, loading } = useSelector(state => state.stores);

    useEffect(() => {
        dispatch(getAllStores());
    }, [dispatch]);

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

    return (
        <>
            <>
                <div className="page-header d-flex justify-content-between align-items-center">
                    <h1 className="page-title">Quản lý Cửa Hàng</h1>
                    <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => {
                            setSelectedStore(null);
                            setShowModal(true);
                        }}
                    >
                        <FiPlus size={20} /> Thêm cửa hàng
                    </button>
                </div>

                <div className="card">
                    <div className="card-header">Danh sách cửa hàng</div>
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th scope="col" className="ps-4">#</th>
                                    <th scope="col">Tên cửa hàng</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Thành phố</th>
                                    <th scope="col">Điện thoại</th>
                                    <th scope="col">Giờ mở cửa</th>
                                    <th scope="col" className="text-end pe-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map((store, i) => (
                                    <tr key={store._id}>
                                        <td className="ps-4 fw-bold">STR{1000 + i + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="store-img-wrapper">
                                                    <FiMapPin size={24} className="text-danger" />
                                                </div>
                                                <div className="fw-bold">{store.name}</div>
                                            </div>
                                        </td>
                                        <td className="text-muted small" style={{ maxWidth: '300px' }}>{store.address}</td>
                                        <td>{CITY_LABELS[store.city] || store.city}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <FiPhone size={14} className="text-secondary" />
                                                <span>{store.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                <FiClock size={14} className="text-secondary" />
                                                <span>{store.openTime}</span>
                                            </div>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                                                onClick={() => handleEdit(store)}
                                            >
                                                <FiEdit2 className="me-1" /> Sửa
                                            </button>
                                            <button
                                                className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                                                onClick={() => handleDelete(store._id)}
                                            >
                                                <FiTrash2 className="me-1" /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
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
