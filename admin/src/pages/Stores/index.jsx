import React, { useState } from 'react'
import AddStoreModal from './AddStoreModal';
import { toast } from 'react-toastify';
import './stores.css';
import { FiEdit2, FiTrash2, FiPlus, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const Stores = () => {
    //   const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)

    // Mock data for display purposes until backend is ready
    const [stores] = useState([
        {
            _id: '1',
            name: 'KFC Nguyễn Trãi',
            address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
            city: 'hcm',
            phone: '1900 1166',
            openTime: '08:00 - 22:00',
        },
        {
            _id: '2',
            name: 'KFC Hoàn Kiếm',
            address: '456 Hoàng Diệu, Quận Hoàn Kiếm, Hà Nội',
            city: 'hn',
            phone: '1900 1166',
            openTime: '08:00 - 22:00',
        },
        {
            _id: '3',
            name: 'KFC Đà Nẵng',
            address: '555 Trần Phú, Quận Hải Châu, Đà Nẵng',
            city: 'dn',
            phone: '1900 1166',
            openTime: '08:00 - 22:00',
        }
    ]);

    return (
        <>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div className="page-header d-flex justify-content-between align-items-center">
                    <h1 className="page-title">Quản lý Cửa Hàng</h1>
                    <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => setShowModal(true)}
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
                                {
                                    stores.map((store, i) => {
                                        return (
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
                                                <td>
                                                    {store.city === 'hcm' && 'TP.HCM'}
                                                    {store.city === 'hn' && 'Hà Nội'}
                                                    {store.city === 'dn' && 'Đà Nẵng'}
                                                    {store.city === 'hp' && 'Hải Phòng'}
                                                    {store.city === 'ct' && 'Cần Thơ'}
                                                </td>
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
                                                        onClick={() => {
                                                            // navigate(`/stores/${store._id}`)
                                                            toast.info("Chức năng chỉnh sửa sẽ được cập nhật sau khi có API")
                                                        }}
                                                    >
                                                        <FiEdit2 style={{ marginRight: '4px' }} />
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                                                        onClick={() => toast.info("Chức năng xóa sẽ được cập nhật sau khi có API")}
                                                    >
                                                        <FiTrash2 style={{ marginRight: '4px' }} />
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {showModal ? <AddStoreModal setShowModal={setShowModal} /> : null}
        </>
    )
}

export default Stores
