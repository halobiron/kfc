import React, { useState, useEffect } from 'react';
import Button from '../../../components/Common/Button';
import Badge from '../../../components/Common/Badge';

const RestockModal = ({ show, onHide, onSubmit, ingredient }) => {
    const [importMethod, setImportMethod] = useState('pack');
    const [restockAmount, setRestockAmount] = useState('');
    const [packSize, setPackSize] = useState('1');
    const [editSupplier, setEditSupplier] = useState('');
    const [editSupplierContact, setEditSupplierContact] = useState('');

    useEffect(() => {
        if (show && ingredient) {
            setImportMethod('pack');
            setRestockAmount('');
            setPackSize('');
            setEditSupplier(ingredient.supplier || '');
            setEditSupplierContact(ingredient.supplierContact || '');
        }
    }, [show, ingredient]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalAmount = 0;
        if (importMethod === 'amount') {
            finalAmount = parseFloat(restockAmount);
        } else {
            finalAmount = parseFloat(restockAmount) * parseFloat(packSize);
        }

        const updates = {};
        if (editSupplier && editSupplier !== ingredient.supplier) updates.supplier = editSupplier;
        if (editSupplierContact && editSupplierContact !== ingredient.supplierContact) updates.supplierContact = editSupplierContact;

        onSubmit({
            amount: finalAmount,
            updates
        });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay-wrapper">
            <div className="modal-overlay-inner overflow-hidden ingredient-restock-modal">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold">Nhập kho nguyên liệu</h5>
                    <button className="btn-close" onClick={onHide}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small text-muted">Nguyên liệu</label>
                        <div className="d-flex align-items-baseline gap-2">
                            <div className="fw-bold fs-5">{ingredient?.name}</div>
                            <Badge variant="light" className="text-dark">Đơn vị chuẩn: {ingredient?.unit}</Badge>
                        </div>
                    </div>

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
                                <label className="form-label small">Quy đổi ({ingredient?.unit} / 1 gói)</label>
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
                                    Tổng cộng nhập: <strong>{(parseFloat(restockAmount || 0) * parseFloat(packSize || 0)).toLocaleString()} {ingredient?.unit}</strong>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="form-label small">Tổng số lượng nhập thêm ({ingredient?.unit})</label>
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
                        <Button type="submit" variant="primary" className="w-100 py-2">
                            Xác nhận nhập (+{
                                importMethod === 'pack'
                                    ? (parseFloat(restockAmount || 0) * parseFloat(packSize || 0)).toLocaleString()
                                    : (parseFloat(restockAmount || 0)).toLocaleString()
                            } {ingredient?.unit})
                        </Button>
                        <Button variant="light" className="w-100 py-2" onClick={onHide}>Hủy</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestockModal;
