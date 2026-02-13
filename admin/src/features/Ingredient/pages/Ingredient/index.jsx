import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients, updateIngredientStock, createIngredient, updateIngredient } from '../../ingredientSlice';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import Button, { AddButton, EditButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import RestockModal from '../../components/RestockModal';
import IngredientFormModal from '../../components/IngredientFormModal';
import './Ingredient.css';

const Ingredient = () => {
    const dispatch = useDispatch();
    const { ingredients } = useSelector(state => state.ingredients);
    
    // UI State
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIng, setSelectedIng] = useState(null);

    // Initial data for the form modal
    const [formInitialData, setFormInitialData] = useState(null);

    useEffect(() => {
        dispatch(getAllIngredients());
    }, [dispatch]);

    const handleRestockSubmit = ({ amount, updates }) => {
        if (selectedIng && amount > 0) {
            dispatch(updateIngredientStock({
                id: selectedIng._id,
                amount: amount,
                updates: updates
            })).unwrap().then(() => {
                toast.success(`Đã nhập thêm ${amount} ${selectedIng.unit} vào kho.`);
                dispatch(getAllIngredients()); // Refresh list
                setShowRestockModal(false);
            }).catch(err => {
                toast.error(err.message || 'Lỗi khi nhập kho');
            });
        }
    };

    const handleIngredientSubmit = (formData) => {
        if (isEditing && selectedIng) {
            dispatch(updateIngredient({ id: selectedIng._id, data: formData }))
                .unwrap()
                .then(() => {
                    setShowAddModal(false);
                    setIsEditing(false);
                    toast.success('Đã cập nhật nguyên liệu');
                    dispatch(getAllIngredients());
                })
                .catch(err => toast.error(err.message || 'Lỗi khi cập nhật nguyên liệu'));
        } else {
            dispatch(createIngredient(formData))
                .unwrap()
                .then(() => {
                    setShowAddModal(false);
                    toast.success('Đã thêm nguyên liệu mới');
                    dispatch(getAllIngredients());
                })
                .catch(err => toast.error(err.message || 'Lỗi khi tạo nguyên liệu'));
        }
    };

    const openEditModal = (ing) => {
        setSelectedIng(ing);
        setFormInitialData({
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
        setFormInitialData(null); // Will use default in modal
        setShowAddModal(true);
    };

    const openRestockModal = (ing) => {
        setSelectedIng(ing);
        setShowRestockModal(true);
    };

    const getStockStatus = (ing) => {
        if (ing.stock <= 0) return { label: 'Hết hàng', variant: 'danger' };
        if (ing.stock <= ing.minStock) return { label: 'Sắp hết', variant: 'warning' };
        return { label: 'Đủ hàng', variant: 'success' };
    };

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center">
                <h1 className="page-title">Quản lý Nguyên liệu (Kho)</h1>
                <div className="d-flex gap-2">
                    <AddButton onClick={openCreateModal} />
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
                            {ingredients && ingredients.map((ing, i) => {
                                const status = getStockStatus(ing);
                                const isLow = ing.stock <= ing.minStock;

                                return (
                                    <tr key={ing._id} className={isLow ? 'row-alert' : ''}>
                                        <td className="ps-4 fw-bold">ING{1000 + i + 1}</td>
                                        <td>
                                            <div className="fw-bold">{ing.name}</div>
                                        </td>
                                        <td><Badge variant="light" className="text-dark">{ing.category}</Badge></td>
                                        <td>
                                            <div className="fw-bold small">{ing.supplier || '---'}</div>
                                            <div className="text-muted supplier-contact-text">{ing.supplierContact || ''}</div>
                                        </td>
                                        <td className="text-center">{ing.unit}</td>
                                        <td className="text-end fw-bold">
                                            <span className={isLow ? 'text-danger' : ''}>
                                                {ing.stock}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <Badge variant={status.variant}>
                                                {status.label}
                                            </Badge>
                                        </td>
                                        <td className="text-end pe-4">
                                            <EditButton
                                                className="me-2"
                                                onClick={() => openEditModal(ing)}
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline-success"
                                                title="Nhập kho"
                                                aria-label="Nhập kho"
                                                onClick={() => openRestockModal(ing)}
                                            >
                                                <FiPlus />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <RestockModal
                show={showRestockModal}
                onHide={() => setShowRestockModal(false)}
                onSubmit={handleRestockSubmit}
                ingredient={selectedIng}
            />

            <IngredientFormModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSubmit={handleIngredientSubmit}
                initialData={formInitialData}
                isEditing={isEditing}
            />
        </>
    );
};

export default Ingredient;
