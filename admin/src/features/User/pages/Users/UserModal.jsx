import React, { useState, useEffect } from 'react';
import Button from '../../../../components/Common/Button';

const UserModal = ({ show, onClose, user, roles, onSubmit }) => {
    const isEditMode = !!user;
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', role: '', password: '', isActive: true
    });

    useEffect(() => {
        if (show) {
            if (user) {
                setFormData({
                    ...user,
                    role: user.role?._id || user.role,
                    password: ''
                });
            } else {
                setFormData({
                    name: '', email: '', phone: '',
                    role: roles?.[0]?._id,
                    password: '', isActive: true
                });
            }
        }
    }, [show, user, roles]);

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
                        <h5 className="modal-title">{isEditMode ? 'Chỉnh sửa' : 'Thêm mới'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Họ và tên</label>
                                <input type="text" className="form-control" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input type="tel" className="form-control" value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Vai trò</label>
                                <select className="form-select" value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                                    {roles?.map(role => (
                                        <option key={role._id} value={role._id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">{isEditMode ? 'Đổi mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}</label>
                                <input type="password" className="form-control" value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditMode} minLength="6" />
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} id="isActiveCheck" />
                                <label className="form-check-label" htmlFor="isActiveCheck">Kích hoạt tài khoản</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" onClick={onClose}>Hủy</Button>
                            <Button type="submit" variant="primary">{isEditMode ? 'Cập nhật' : 'Thêm mới'}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
