import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../authSlice';
import authApi from '../../../../api/authApi';
import './login.css'
import signinImg from '../../../../assets/images/common/auth-bg.jpg'
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleLoginResponse = (response) => {
        if (response.data.status) {
            const userData = {
                ...response.data.user,
                token: response.data.token
            };
            dispatch(loginSuccess(userData));
            toast.success('Đăng nhập thành công!');
        } else {
            dispatch(loginFailure(response.data.message));
            toast.error(response.data.message);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                dispatch(loginStart());
                const response = await authApi.googleLogin({
                    token: tokenResponse.access_token
                });
                handleLoginResponse(response);
            } catch (error) {
                const message = error.response?.data?.message || 'Đăng nhập Google thất bại';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        },
        onError: () => {
            dispatch(loginFailure('Đăng nhập Google thất bại'));
            toast.error('Đăng nhập Google thất bại');
        }
    });

    const { handleBlur, handleSubmit, handleChange, touched, errors, values } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Vui lòng nhập email hợp lệ').required('Email là bắt buộc'),
            password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(loginStart());
                const response = await authApi.login(values);
                handleLoginResponse(response);
            } catch (error) {
                const message = error.response?.data?.message || 'Đăng nhập thất bại';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        }
    })

    return (
        <div className="auth-container">
            {/* Left promotional banner */}
            <div className="auth-banner">
                <img src={signinImg} alt="KFC Promotion" className="auth-banner-image" />
            </div>

            {/* Right login form */}
            <div className="auth-form-section">
                <h2 className="auth-title">ĐĂNG NHẬP</h2>

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

                    <div className="auth-form-group">
                        <label htmlFor="password">Mật khẩu *</label>
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
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className='error'>{touched.password && errors.password ? errors.password : ''}</p>
                    </div>

                    <div className="auth-forgot-password">
                        <Link to="/forgot-password" className="auth-link">Bạn quên mật khẩu?</Link>
                    </div>

                    <button type="submit" className="btn-kfc" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="social-divider">Hoặc tiếp tục với</div>

                <div className="social-login">
                    <button className="btn-social btn-google" onClick={() => handleGoogleLogin()}>
                        <FcGoogle style={{ fontSize: '24px', marginRight: '8px' }} />
                        Đăng nhập bằng Google
                    </button>
                </div>

                <div className="auth-footer-link">
                    Bạn chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký</Link>
                </div>

                <div className="auth-policies">
                    Bằng cách đăng nhập, bạn đồng ý với <br />
                    <Link to="/terms-of-use" target="_blank" className="auth-link">Chính Sách Hoạt Động</Link> và <Link to="/privacy-policy" target="_blank" className="auth-link">Chính Sách Bảo Mật</Link> của KFC.
                </div>
            </div>
        </div>
    )
}

export default Login
