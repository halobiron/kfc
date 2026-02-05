import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../../../../api/authApi';
import '../../auth.css';
import authBg from '../../../../assets/images/common/auth-bg.jpg';
import Button from '../../../../components/Button';
import FormInput from '../../../../components/FormInput';

const ResetPassword = () => {
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
                <p className="auth-description">
                    Nhập mật khẩu mới cho tài khoản của bạn.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <FormInput
                        label="Mật khẩu mới *"
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && errors.password}
                        variant="underlined"
                        placeholder="••••••••"
                    />

                    <FormInput
                        label="Xác nhận mật khẩu *"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && errors.confirmPassword}
                        variant="underlined"
                        placeholder="••••••••"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        fullWidth
                    >
                        Đặt lại mật khẩu
                    </Button>
                </form>

                <div className="auth-footer-link">
                    <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
