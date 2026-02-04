import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../../../../api/authApi';
import '../../auth.css';
import authBg from '../../../../assets/images/common/auth-bg.jpg';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const { handleBlur, handleSubmit, handleChange, touched, errors, values } = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                .required('Mật khẩu là bắt buộc'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
                .required('Xác nhận mật khẩu là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await authApi.resetPassword(token, values);

                if (response.data.status) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="auth-container">
            {/* Left promotional banner */}
            <div className="auth-banner">
                <img src={authBg} alt="KFC Promotion" className="auth-banner-image" />
            </div>

            {/* Right form section */}
            <div className="auth-form-section">
                <h2 className="auth-title">ĐẶT LẠI MẬT KHẨU</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Nhập mật khẩu mới cho tài khoản của bạn.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label htmlFor="password">Mật khẩu mới *</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange}
                                value={values.password}
                                onBlur={handleBlur}
                                name='password'
                                className="auth-input"
                                id="password"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <p className='error'>{touched.password && errors.password ? errors.password : ''}</p>
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={handleChange}
                                value={values.confirmPassword}
                                onBlur={handleBlur}
                                name='confirmPassword'
                                className="auth-input"
                                id="confirmPassword"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <p className='error'>{touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}</p>
                    </div>

                    <button type="submit" className="btn-kfc" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>

                <div className="auth-footer-link" style={{ marginTop: '20px' }}>
                    <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
