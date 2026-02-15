import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoles, createRole, updateRole, deleteRole, clearErrors, resetSuccess } from '../../roleSlice';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button, { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import Form from 'react-bootstrap/Form';
import './Roles.css';

const RoleManagement = ({ resources = [] }) => {
    const dispatch = useDispatch();
    const { roles, loading, error, success } = useSelector((state) => state.roles);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: []
    });

    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            toast.success(isEdit ? 'Cập nhật vai trò thành công' : 'Tạo vai trò thành công');
            dispatch(resetSuccess());
            handleClose();
        }
    }, [error, success, dispatch, isEdit]);

    const handleClose = () => {
        setShowModal(false);
        setFormData({ name: '', description: '', permissions: [] });
        setCurrentRole(null);
        setIsEdit(false);
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (role) => {
        setCurrentRole(role);
        setFormData({
            name: role.name,
            description: role.description,
            permissions: role.permissions || []
        });
        setIsEdit(true);
        handleShow();
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
            dispatch(deleteRole(id));
        }
    };

    const togglePermission = (resourceId, type) => {
        setFormData(prev => {
            const currentPerms = prev.permissions;
            const viewPerm = `${resourceId}.view`;
            const editPerm = `${resourceId}.edit`;

            let newPerms = [...currentPerms];

            if (type === 'view') {
                if (currentPerms.includes(viewPerm)) {
                    // Uncheck View -> Remove View AND Edit
                    newPerms = newPerms.filter(p => p !== viewPerm && p !== editPerm);
                } else {
                    // Check View -> Add View
                    newPerms.push(viewPerm);
                }
            } else if (type === 'edit') {
                if (currentPerms.includes(editPerm)) {
                    // Uncheck Edit -> Remove Edit only
                    newPerms = newPerms.filter(p => p !== editPerm);
                } else {
                    // Check Edit -> Add Edit AND View
                    newPerms.push(editPerm);
                    if (!newPerms.includes(viewPerm)) {
                        newPerms.push(viewPerm);
                    }
                }
            }

            return { ...prev, permissions: newPerms };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            dispatch(updateRole({ id: currentRole._id, roleData: formData }));
        } else {
            dispatch(createRole(formData));
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
                <h2>Quản lý Phân quyền</h2>
                <AddButton onClick={() => { setIsEdit(false); handleShow(); }} />
            </div>

            <div className="table-responsive bg-white rounded shadow-sm p-4">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Tên vai trò</th>
                            <th>Mô tả</th>
                            <th>Quyền hạn</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center">Đang tải...</td></tr>
                        ) : roles && roles.length > 0 ? (
                            roles.map((role) => {
                                // Group permissions
                                const groupedPerms = (role.permissions || []).reduce((acc, p) => {
                                    const [res, type] = p.split('.');
                                    if (!acc[res]) acc[res] = [];
                                    acc[res].push(type === 'view' ? 'Xem' : 'Sửa');
                                    return acc;
                                }, {});

                                return (
                                    <tr key={role._id}>
                                        <td>{role.name}</td>
                                        <td>{role.description}</td>
                                        <td>
                                            <div className="role-permissions-wrap">
                                                {Object.keys(groupedPerms).length > 0 ? (
                                                    Object.entries(groupedPerms).map(([res, types]) => {
                                                        const resLabel = resources.find(r => r.id === res)?.label || res;
                                                        return (
                                                            <Badge
                                                                key={res}
                                                                variant="light"
                                                                className="border me-1 mb-1 text-dark role-permission-badge"
                                                            >
                                                                <strong>{resLabel}:</strong> {types.join(', ')}
                                                            </Badge>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-muted small">Không có quyền</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <EditButton onClick={() => handleEdit(role)} />
                                                {!role.isDefault && (
                                                    <DeleteButton onClick={() => handleDelete(role._id)} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr><td colSpan="4" className="text-center">Chưa có vai trò nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên vai trò <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isEdit && currentRole?.isDefault}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>

                        <div className="mb-3">
                            <Form.Label>Phân quyền chi tiết</Form.Label>
                            <div className="table-responsive border rounded">
                                <table className="table table-sm table-striped mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="role-col-feature">Chức năng</th>
                                            <th className="text-center role-col-view">Xem</th>
                                            <th className="text-center role-col-edit">Sửa (Thêm/Sửa/Xóa)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map(resource => (
                                            <tr key={resource.id}>
                                                <td className="align-middle px-3">{resource.label}</td>
                                                <td className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(`${resource.id}.view`)}
                                                        onChange={() => togglePermission(resource.id, 'view')}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(`${resource.id}.edit`)}
                                                        onChange={() => togglePermission(resource.id, 'edit')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit" loading={loading}>
                                {isEdit ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RoleManagement;
