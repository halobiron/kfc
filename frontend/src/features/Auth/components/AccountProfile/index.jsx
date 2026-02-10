import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserSuccess } from '../../authSlice';
import userApi from '../../../../api/userApi';
import useUserProfile from '../../../../hooks/useUserProfile';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import './AccountProfile.css';

const AccountProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    // Use custom hook for user profile
    const { profile } = useUserProfile();

    const [userInfo, setUserInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthdate: user?.birthdate ? user.birthdate.split('T')[0] : ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            setUserInfo({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                birthdate: profile.birthdate ? profile.birthdate.split('T')[0] : ''
            });
            dispatch(updateUserSuccess(profile));
        }
    }, [profile, dispatch]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await userApi.updateProfile({
                name: userInfo.name,
                phone: userInfo.phone,
                birthdate: userInfo.birthdate
            });

            if (response.data?.status) {
                toast.success('Cập nhật thông tin thành công!');
                dispatch(updateUserSuccess(response.data.data));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await userApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            if (response.data?.status) {
                toast.success('Đổi mật khẩu thành công!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể đổi mật khẩu.');
        }
    };

    return (
        <Card>
            <h3>Quản lý hồ sơ</h3>

            <div className="profile-section">
                <h4>Thông tin cá nhân</h4>
                <form onSubmit={handleUpdateInfo}>
                    <div className="form-row">
                        <FormInput
                            label="Họ và tên"
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Số điện thoại"
                            type="tel"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <FormInput
                            label="Email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            disabled
                        />
                        <FormInput
                            label="Ngày sinh"
                            type="date"
                            value={userInfo.birthdate}
                            onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                        />
                    </div>
                    <Button type="submit" variant="primary">Lưu thông tin</Button>
                </form>
            </div>

            <div className="profile-section">
                <h4>Đổi mật khẩu</h4>
                <form onSubmit={handleChangePassword}>
                    <div className="form-row">
                        <FormInput
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <FormInput
                            label="Mật khẩu mới"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                            minLength="6"
                        />
                        <FormInput
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                            minLength="6"
                        />
                    </div>
                    <Button type="submit" variant="primary">Cập nhật mật khẩu</Button>
                </form>
            </div>
        </Card>
    );
};

export default AccountProfile;
