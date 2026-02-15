import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIngredients, updateIngredientStock, createIngredient, updateIngredient } from '../../ingredientSlice';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import Button, { AddButton, EditButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import Table from '../../../../components/Common/Table';
import RestockModal from '../../components/RestockModal';
import IngredientFormModal from '../../components/IngredientFormModal';
import './Ingredient.css';

const getStockStatus = (stock, minStock) => {
    if (stock <= 0) return { label: 'Hết hàng', variant: 'danger' };
    if (stock <= minStock) return { label: 'Sắp hết', variant: 'warning' };
    return { label: 'Đủ hàng', variant: 'success' };
};

const Ingredient = () => {
    const dispatch = useDispatch();
    const { ingredients, loading } = useSelector(state => state.ingredients);
    
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

    const handleRestockSubmit = useCallback(({ amount, updates }) => {
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
    }, [dispatch, selectedIng]);

    const handleIngredientSubmit = useCallback((formData) => {
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
    }, [dispatch, isEditing, selectedIng]);

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

    const columns = [
        {
            header: 'Mã',
            className: 'ps-4 fw-bold text-muted small',
            render: (ing) => `#${ing._id.slice(-6).toUpperCase()}`
        },
        {
            header: 'Tên nguyên liệu',
            className: 'fw-bold',
            key: 'name'
        },
        {
            header: 'Danh mục',
            render: (ing) => <Badge variant="light" className="text-dark">{ing.category}</Badge>
        },
        {
            header: 'Nhà cung cấp',
            render: (ing) => (
                <>
                    <div className="fw-bold small">{ing.supplier || '---'}</div>
                    <div className="text-muted">{ing.supplierContact || ''}</div>
                </>
            )
        },
        {
            header: 'Đơn vị',
            className: 'text-center',
            key: 'unit'
        },
        {
            header: 'Hiện có',
            className: 'text-end fw-bold',
            render: (ing) => (
                <span className={ing.stock <= ing.minStock ? 'text-danger' : ''}>
                    {ing.stock}
                </span>
            )
        },
        {
            header: 'Trạng thái',
            className: 'text-center',
            render: (ing) => {
                const status = getStockStatus(ing.stock, ing.minStock);
                return <Badge variant={status.variant}>{status.label}</Badge>;
            }
        },
        {
            header: 'Thao tác',
            className: 'text-end pe-4',
            render: (ing) => (
                <>
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
                </>
            )
        }
    ];

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
                <Table 
                    columns={columns}
                    data={ingredients}
                    loading={loading}
                    emptyMessage="Không có nguyên liệu nào"
                    rowClassName={(ing) => ing.stock <= ing.minStock ? 'row-alert' : ''}
                />
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
