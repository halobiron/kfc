import React, { useState, useEffect } from 'react';
import Button from '../../../../components/Common/Button';

const UserModal = ({ show, onClose, user, roles, onSubmit, roleLabels }) => {
    const isEditMode = !!user;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        password: '',
        isActive: true
    });

    useEffect(() => {
        if (show) {
            if (user) {
                // Edit mode setup
                const roleName = user.role?.name || user.role || 'customer';
                setFormData({ 
                    ...user, 
                    role: roleName, 
                    password: '' // Reset password field on partial update
                });
            } else {
                // Add mode reset
                setFormData({ 
                    name: '', 
                    email: '', 
                    phone: '', 
                    role: 'customer', 
                    password: '', 
                    isActive: true 
                });
            }
        }
    }, [show, user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, isEditMode);
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block users-modal-backdrop" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="0901234567"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Vai trò <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    {roles && roles.length > 0 ? (
                                        roles.map(role => (
                                            <option key={role._id} value={role.name}>{role.name}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="customer">customer</option>
                                            <option value="admin">admin</option>
                                        </>
                                    )}
                                </select>
                                <small className="text-muted d-block mt-1">
                                    {roles?.find(r => r.name === formData.role)?.description ||
                                        (roleLabels[formData.role]?.label ? `Vai trò: ${roleLabels[formData.role]?.label}` : '')}
                                </small>
                            </div>
                            {!isEditMode && (
                                <div className="mb-3">
                                    <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!isEditMode}
                                        placeholder="Tối thiểu 6 ký tự"
                                        minLength="6"
                                    />
                                </div>
                            )}
                            {isEditMode && (
                                <div className="mb-3">
                                    <label className="form-label">Đổi mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Để trống nếu không đổi"
                                        minLength="6"
                                    />
                                    <small className="text-muted">Chỉ nhập nếu muốn thay đổi mật khẩu</small>
                                </div>
                            )}
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    id="isActiveCheck"
                                    disabled={formData.role === 'admin'}
                                />
                                <label className="form-check-label" htmlFor="isActiveCheck">
                                    {formData.role === 'admin' ? 'Tài khoản Quản trị viên luôn hoạt động' : 'Kích hoạt tài khoản này'}
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="primary">
                                {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
