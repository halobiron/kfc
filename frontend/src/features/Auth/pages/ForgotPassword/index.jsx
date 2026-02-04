import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../../../../api/authApi';
import '../../auth.css';
import authBg from '../../../../assets/images/common/auth-bg.jpg';

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const { handleBlur, handleSubmit, handleChange, touched, errors, values } = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Vui lòng nhập email hợp lệ').required('Email là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await authApi.forgotPassword(values);

                if (response.data.status) {
                    setEmailSent(true);
                    toast.success(response.data.message);
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
                {!emailSent ? (
                    <>
                        <h2 className="auth-title">QUÊN MẬT KHẨU</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
                        </p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-form-group">
                                <label htmlFor="email">Địa chỉ email của bạn *</label>
                                <input
                                    type="email"
                                    onChange={handleChange}
                                    value={values.email}
                                    onBlur={handleBlur}
                                    name="email"
                                    className="auth-input"
                                    id="email"
                                    placeholder="example@email.com"
                                />
                                <p className='error'>{touched.email && errors.email ? errors.email : ''}</p>
                            </div>

                            <button type="submit" className="btn-kfc" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Gửi email'}
                            </button>
                        </form>

                        <div className="auth-footer-link" style={{ marginTop: '20px' }}>
                            <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="auth-title">KIỂM TRA EMAIL CỦA BẠN</h2>
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
                            <p style={{ color: '#666', marginBottom: '20px' }}>
                                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{values.email}</strong>
                            </p>
                            <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
                                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn trong email.
                                Link sẽ hết hạn sau 10 phút.
                            </p>
                            <Link to="/login" className="btn-kfc" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
