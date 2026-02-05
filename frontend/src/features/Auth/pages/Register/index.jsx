import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../authSlice';
import authApi from '../../../../api/authApi';
import '../../auth.css'
import './register.css'
import signinImg from '../../../../assets/images/common/auth-bg.jpg'
import { FcGoogle } from 'react-icons/fc';
import Button from '../../../../components/Button';
import FormInput from '../../../../components/FormInput';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const { handleSubmit, handleChange, handleBlur, values, touched, errors, isValid, dirty } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().max(50, 'Tối đa 50 ký tự').required('Vui lòng nhập tên'),
            lastName: Yup.string().max(50, 'Tối đa 50 ký tự').required('Vui lòng nhập họ'),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
                .required('Vui lòng nhập số điện thoại'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
                .required('Vui lòng xác nhận mật khẩu')
        }),
        onSubmit: async (values) => {
            try {
                dispatch(loginStart());
                const registerData = {
                    name: `${values.lastName} ${values.firstName}`,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                };
                const response = await authApi.register(registerData);
                if (response.data.status) {
                    const userData = {
                        ...response.data.user,
                        token: response.data.token
                    };
                    dispatch(loginSuccess(userData));
                    toast.success('Đăng ký thành công!');
                    navigate('/');
                } else {
                    dispatch(loginFailure(response.data.message));
                    toast.error(response.data.message);
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Đăng ký thất bại';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        }
    })

    return (
        <div className="auth-container">
            <div className="auth-banner">
                <img src={signinImg} alt="KFC Promotion" className="auth-banner-image" />
            </div>

            <div className="auth-form-section">
                <h2 className="auth-title">TẠO TÀI KHOẢN</h2>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Họ của bạn *"
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.lastName && errors.lastName}
                        variant="underlined"
                    />

                    <FormInput
                        label="Tên của bạn *"
                        id="firstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && errors.firstName}
                        variant="underlined"
                    />

                    <FormInput
                        label="Số điện thoại *"
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && errors.phone}
                        variant="underlined"
                        placeholder="0123456789"
                    />

                    <FormInput
                        label="Địa chỉ email của bạn *"
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && errors.email}
                        variant="underlined"
                        placeholder="example@email.com"
                    />

                    <FormInput
                        label="Mật khẩu *"
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

                    <div className="terms-group">
                        <label className="terms-checkbox">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            <span className="terms-text">
                                Tôi đồng ý với <Link to="/terms-of-use" target="_blank" className="auth-link">Chính Sách Hoạt Động</Link> và <Link to="/privacy-policy" target="_blank" className="auth-link">Chính Sách Bảo Mật</Link>
                            </span>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isValid || !dirty || !agreedToTerms || loading}
                        loading={loading}
                        fullWidth
                    >
                        Tạo tài khoản
                    </Button>
                </form>

                <div className="social-divider">Hoặc tiếp tục với</div>

                <div className="social-login">
                    <button className="btn-social">
                        <FcGoogle />
                        Đăng ký bằng Google
                    </button>
                </div>

                <div className="auth-footer-link">
                    Bạn đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
                </div>
            </div>
        </div>
    )
}

export default Register