import React, { useState, useEffect } from 'react';
import Button from '../../../components/Common/Button';

const IngredientFormModal = ({ show, onHide, onSubmit, initialData, isEditing }) => {
    const DEFAULT_DATA = {
        name: '',
        category: 'Thực phẩm tươi',
        unit: 'Kg',
        minStock: 10,
        cost: '',
        supplier: '',
        supplierContact: '',
        stock: 0
    };

    const [formData, setFormData] = useState(DEFAULT_DATA);

    useEffect(() => {
        if (show) {
            setFormData(initialData || DEFAULT_DATA);
        }
    }, [show, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className="modal-overlay-wrapper">
            <div className="modal-overlay-inner overflow-hidden ingredient-add-modal">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold">{isEditing ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu mới'}</h5>
                    <button className="btn-close" onClick={onHide}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên nguyên liệu</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Phân loại</label>
                            <select
                                className="form-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Giá nhập (VND)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
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
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
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
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    placeholder="Tên nhà cung cấp"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.supplierContact}
                                    onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                                    placeholder="SĐT/Liên hệ"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <Button type="submit" variant="primary" className="w-100 py-2">{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
                        <Button variant="light" className="w-100 py-2" onClick={onHide}>Hủy</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IngredientFormModal;
