import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients, updateIngredientStock, createIngredient, updateIngredient } from '../../redux/slices/ingredientSlice';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2 } from 'react-icons/fi';
import './ingredient.css';

const Ingredient = () => {
    const dispatch = useDispatch();
    const { ingredients } = useSelector(state => state.ingredients);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIng, setSelectedIng] = useState(null);
    const [restockAmount, setRestockAmount] = useState('');
    const [packSize, setPackSize] = useState('1');
    const [importMethod, setImportMethod] = useState('pack'); // 'amount' or 'pack'
    const [editSupplier, setEditSupplier] = useState('');
    const [editSupplierContact, setEditSupplierContact] = useState('');

    const [newIng, setNewIng] = useState({
        name: '',
        category: 'Thực phẩm tươi',
        unit: 'Kg',
        minStock: 10,
        cost: '',
        supplier: '',
        supplierContact: '',
        stock: 0
    });

    useEffect(() => {
        dispatch(getAllIngredients());
    }, [dispatch]);

    const handleRestock = (e) => {
        e.preventDefault();

        // Calculate total amount based on method
        let finalAmount = 0;
        if (importMethod === 'amount') {
            finalAmount = parseFloat(restockAmount);
        } else {
            finalAmount = parseFloat(restockAmount) * parseFloat(packSize);
        }

        if (selectedIng && finalAmount > 0) {
            const updates = {};
            // Only update supplier if changed
            // Only update supplier if changed
            if (editSupplier && editSupplier !== selectedIng.supplier) updates.supplier = editSupplier;
            if (editSupplierContact && editSupplierContact !== selectedIng.supplierContact) updates.supplierContact = editSupplierContact;

            dispatch(updateIngredientStock({
                id: selectedIng._id,
                amount: finalAmount,
                updates: updates
            })).unwrap().then(() => {
                toast.success(`Đã nhập thêm ${finalAmount} ${selectedIng.unit} vào kho.`);
                dispatch(getAllIngredients()); // Refresh list
            }).catch(err => {
                toast.error(err.message || 'Lỗi khi nhập kho');
            });

            setShowRestockModal(false);
            setRestockAmount('');
            setPackSize('1');
            setEditSupplier('');
            setEditSupplierContact('');
        }
    };

    const handleCreateWrapper = (e) => {
        e.preventDefault();

        if (isEditing && selectedIng) {
            dispatch(updateIngredient({ id: selectedIng._id, data: newIng }))
                .unwrap()
                .then(() => {
                    setShowAddModal(false);
                    setIsEditing(false);
                    setNewIng({
                        name: '',
                        category: 'Thực phẩm tươi',
                        unit: 'Kg',
                        minStock: 10,
                        cost: '',
                        supplier: '',
                        supplierContact: '',
                        stock: 0
                    });
                    toast.success('Đã cập nhật nguyên liệu');
                    dispatch(getAllIngredients());
                })
                .catch(err => toast.error(err.message || 'Lỗi khi cập nhật nguyên liệu'));
        } else {
            dispatch(createIngredient(newIng))
                .unwrap()
                .then(() => {
                    setShowAddModal(false);
                    setNewIng({
                        name: '',
                        category: 'Thực phẩm tươi',
                        unit: 'Kg',
                        minStock: 10,
                        cost: '',
                        supplier: '',
                        supplierContact: '',
                        stock: 0
                    });
                    toast.success('Đã thêm nguyên liệu mới');
                    dispatch(getAllIngredients());
                })
                .catch(err => toast.error(err.message || 'Lỗi khi tạo nguyên liệu'));
        }
    };

    const openEditModal = (ing) => {
        setSelectedIng(ing);
        setNewIng({
            name: ing.name,
            category: ing.category,
            unit: ing.unit,
            minStock: ing.minStock,
            stock: ing.stock,
            cost: ing.cost || '',
            supplier: ing.supplier || '',
            supplierContact: ing.supplierContact || ''
        });
        setIsEditing(true);
        setShowAddModal(true);
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setNewIng({
            name: '',
            category: 'Thực phẩm tươi',
            unit: 'Kg',
            minStock: 10,
            cost: '',
            supplier: '',
            supplierContact: '',
            stock: 0
        });
        setShowAddModal(true);
    };

    const openRestockModal = (ing) => {
        setSelectedIng(ing);
        setImportMethod('pack'); // Default to pack for convenience
        setPackSize(''); // Reset pack size
        setPackSize(''); // Reset pack size
        setEditSupplier(ing.supplier || '');
        setEditSupplierContact(ing.supplierContact || '');
        setRestockAmount('');
        setShowRestockModal(true);
    };

    const getStockStatus = (ing) => {
        if (ing.stock <= 0) return { label: 'Hết hàng', class: 'badge-danger' };
        if (ing.stock <= ing.minStock) return { label: 'Sắp hết', class: 'badge-warning' };
        return { label: 'Đủ hàng', class: 'badge-success' };
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="page-header d-flex justify-content-between align-items-center">
                <h1 className="page-title">Quản lý Nguyên liệu (Kho)</h1>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={openCreateModal}>
                        <FiPlus size={20} /> Thêm nguyên liệu
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">Danh mục nguyên liệu</div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th scope="col" className="ps-4">Mã</th>
                                <th scope="col">Tên nguyên liệu</th>
                                <th scope="col">Danh mục</th>
                                <th scope="col">Nhà cung cấp</th>
                                <th scope="col" className="text-center">Đơn vị</th>
                                <th scope="col" className="text-end">Hiện có</th>
                                <th scope="col" className="text-center">Trạng thái</th>
                                <th scope="col" className="text-end pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients && ingredients.slice(0, 5).map((ing, i) => {
                                const status = getStockStatus(ing);
                                const isLow = ing.stock <= ing.minStock;

                                return (
                                    <tr key={ing._id} className={isLow ? 'row-alert' : ''}>
                                        <td className="ps-4 fw-bold">ING{1000 + i + 1}</td>
                                        <td>
                                            <div className="fw-bold">{ing.name}</div>
                                        </td>
                                        <td><span className="badge badge-light text-dark">{ing.category}</span></td>
                                        <td>
                                            <div className="fw-bold small">{ing.supplier || '---'}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{ing.supplierContact || ''}</div>
                                        </td>
                                        <td className="text-center">{ing.unit}</td>
                                        <td className="text-end fw-bold">
                                            <span className={isLow ? 'text-danger' : ''}>
                                                {ing.stock}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${status.class}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 me-2"
                                                onClick={() => openEditModal(ing)}
                                            >
                                                <FiEdit2 /> Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                                                onClick={() => openRestockModal(ing)}
                                            >
                                                <FiPlus /> Nhập
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Restock Modal */}
            {showRestockModal && (
                <div className="modal-overlay-wrapper">
                    <div className="modal-overlay-inner overflow-hidden" style={{ width: '450px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 fw-bold">Nhập kho nguyên liệu</h5>
                            <button className="btn-close" onClick={() => setShowRestockModal(false)}></button>
                        </div>
                        <form onSubmit={handleRestock}>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Nguyên liệu</label>
                                <div className="d-flex align-items-baseline gap-2">
                                    <div className="fw-bold fs-5">{selectedIng?.name}</div>
                                    <span className="badge badge-light text-dark">Đơn vị chuẩn: {selectedIng?.unit}</span>
                                </div>
                            </div>

                            {/* Method Selection */}
                            {/* Method Selection - Tabs */}
                            <ul className="nav nav-tabs nav-fill mb-3">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${importMethod === 'pack' ? 'active fw-bold' : 'text-muted'}`}
                                        onClick={(e) => { e.preventDefault(); setImportMethod('pack'); }}
                                    >
                                        Nhập theo Gói/Bao
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${importMethod === 'amount' ? 'active fw-bold' : 'text-muted'}`}
                                        onClick={(e) => { e.preventDefault(); setImportMethod('amount'); }}
                                    >
                                        Nhập trực tiếp
                                    </button>
                                </li>
                            </ul>

                            {importMethod === 'pack' ? (
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small">Số lượng (Bao/Gói/Thùng)</label>
                                        <input
                                            type="number"
                                            step="1"
                                            className="form-control"
                                            value={restockAmount}
                                            onChange={(e) => setRestockAmount(e.target.value)}
                                            required
                                            autoFocus
                                            placeholder="SL"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small">Quy đổi ({selectedIng?.unit} / 1 gói)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={packSize}
                                            onChange={(e) => setPackSize(e.target.value)}
                                            required
                                            placeholder={`Ví dụ: 10`}
                                        />
                                    </div>
                                    <div className="col-12 mt-2">
                                        <div className="alert alert-light border small py-2 mb-0">
                                            Tổng cộng nhập: <strong>{(parseFloat(restockAmount || 0) * parseFloat(packSize || 0)).toLocaleString()} {selectedIng?.unit}</strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <label className="form-label small">Tổng số lượng nhập thêm ({selectedIng?.unit})</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        value={restockAmount}
                                        onChange={(e) => setRestockAmount(e.target.value)}
                                        placeholder={`Ví dụ: 10.5`}
                                        required
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label small">Thông tin Nhà cung cấp</label>
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editSupplier}
                                            onChange={(e) => setEditSupplier(e.target.value)}
                                            placeholder="Tên NCC (VD: CP Food)"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editSupplierContact}
                                            onChange={(e) => setEditSupplierContact(e.target.value)}
                                            placeholder="SĐT/Liên hệ"
                                        />
                                    </div>
                                </div>
                                <div className="form-text small text-muted">
                                    Cập nhật thông tin nhà cung cấp nếu có thay đổi.
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Xác nhận nhập (+{
                                        importMethod === 'pack'
                                            ? (parseFloat(restockAmount || 0) * parseFloat(packSize || 0)).toLocaleString()
                                            : (parseFloat(restockAmount || 0)).toLocaleString()
                                    } {selectedIng?.unit})
                                </button>
                                <button type="button" className="btn btn-light w-100 py-2" onClick={() => setShowRestockModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add New Ingredient Modal */}
            {showAddModal && (
                <div className="modal-overlay-wrapper">
                    <div className="modal-overlay-inner overflow-hidden" style={{ width: '500px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 fw-bold">{isEditing ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu mới'}</h5>
                            <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                        </div>
                        <form onSubmit={handleCreateWrapper}>
                            <div className="mb-3">
                                <label className="form-label">Tên nguyên liệu</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newIng.name}
                                    onChange={(e) => setNewIng({ ...newIng, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Phân loại</label>
                                    <select
                                        className="form-select"
                                        value={newIng.category}
                                        onChange={(e) => setNewIng({ ...newIng, category: e.target.value })}
                                    >
                                        <option>Thực phẩm tươi</option>
                                        <option>Thực phẩm đông lạnh</option>
                                        <option>Nguyên liệu khô</option>
                                        <option>Gia vị</option>
                                        <option>Rau củ</option>
                                        <option>Đồ uống</option>
                                        <option>Vật tư</option>
                                        <option>Phụ liệu</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Đơn vị tính</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newIng.unit}
                                        onChange={(e) => setNewIng({ ...newIng, unit: e.target.value })}
                                        required
                                        placeholder="Kg, Bao, Can..."
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Tồn kho ban đầu</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        value={newIng.stock}
                                        onChange={(e) => setNewIng({ ...newIng, stock: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Giá nhập (VND)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newIng.cost}
                                        onChange={(e) => setNewIng({ ...newIng, cost: e.target.value })}
                                        required
                                        placeholder="VD: 50000"
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Mức báo động (Min)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control"
                                        value={newIng.minStock}
                                        onChange={(e) => setNewIng({ ...newIng, minStock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Thông tin Nhà cung cấp</label>
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newIng.supplier}
                                            onChange={(e) => setNewIng({ ...newIng, supplier: e.target.value })}
                                            placeholder="Tên nhà cung cấp"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newIng.supplierContact}
                                            onChange={(e) => setNewIng({ ...newIng, supplierContact: e.target.value })}
                                            placeholder="SĐT/Liên hệ"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary w-100 py-2">{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
                                <button type="button" className="btn btn-light w-100 py-2" onClick={() => setShowAddModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Ingredient;
