import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients, updateIngredientStock } from '../../redux/actions/ingredientActions';
import { FiBox, FiPlus, FiAlertTriangle, FiRefreshCw, FiArrowDown } from 'react-icons/fi';
import StatCard from '../../components/StatCard';
import './ingredient.css';

const Ingredient = () => {
    const dispatch = useDispatch();
    const { ingredients } = useSelector(state => state.ingredients);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [selectedIng, setSelectedIng] = useState(null);
    const [restockAmount, setRestockAmount] = useState('');

    useEffect(() => {
        dispatch(getAllIngredients());
    }, [dispatch]);

    const handleRestock = (e) => {
        e.preventDefault();
        if (selectedIng && restockAmount) {
            dispatch(updateIngredientStock(selectedIng._id, restockAmount));
            setShowRestockModal(false);
            setRestockAmount('');
            alert(`Đã nhập thêm ${restockAmount} ${selectedIng.unit} vào kho cho ${selectedIng.name}`);
        }
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
                    <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={() => dispatch(getAllIngredients())}
                    >
                        <FiRefreshCw /> Làm mới
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
                        <FiBox size={20} /> Thống kê kho
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="row mb-4 g-3">
                <div className="col-md-4">
                    <StatCard
                        label="Tổng nguyên liệu"
                        value={ingredients?.length || 0}
                        icon={<FiBox size={24} />}
                        color="primary"
                    />
                </div>
                <div className="col-md-4">
                    <StatCard
                        label="Cần nhập thêm"
                        value={ingredients?.filter(i => i.stock <= i.minStock).length || 0}
                        icon={<FiAlertTriangle size={24} />}
                        color="danger"
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-header">Danh mục nguyên liệu thực tế (KFC Mock)</div>
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th scope="col" className="ps-4">Mã</th>
                                <th scope="col">Tên nguyên liệu</th>
                                <th scope="col">Danh mục</th>
                                <th scope="col" className="text-center">Đơn vị</th>
                                <th scope="col" className="text-end">Hiện có</th>
                                <th scope="col" className="text-center">Trạng thái</th>
                                <th scope="col" className="text-end pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients && ingredients.map((ing, i) => {
                                const status = getStockStatus(ing);
                                const isLow = ing.stock <= ing.minStock;

                                return (
                                    <tr key={ing._id} className={isLow ? 'row-alert' : ''}>
                                        <td className="ps-4 text-muted small">{ing._id}</td>
                                        <td>
                                            <div className="fw-bold">{ing.name}</div>
                                        </td>
                                        <td><span className="badge badge-light text-dark">{ing.category}</span></td>
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
                                                className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                                                onClick={() => {
                                                    setSelectedIng(ing);
                                                    setShowRestockModal(true);
                                                }}
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
                    <div className="modal-overlay-inner overflow-hidden" style={{ width: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 fw-bold">Nhập thêm nguyên liệu</h5>
                            <button className="btn-close" onClick={() => setShowRestockModal(false)}></button>
                        </div>
                        <form onSubmit={handleRestock}>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Nguyên liệu</label>
                                <div className="fw-bold fs-5">{selectedIng?.name}</div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Số lượng nhập thêm ({selectedIng?.unit})</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    value={restockAmount}
                                    onChange={(e) => setRestockAmount(e.target.value)}
                                    placeholder={`Ví dụ: 10`}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary w-100 py-2">Xác nhận nhập kho</button>
                                <button type="button" className="btn btn-light w-100 py-2" onClick={() => setShowRestockModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Ingredient;
