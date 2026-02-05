import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../authSlice';
import authApi from '../../../../api/authApi';
import '../../auth.css'
import './login.css'
import signinImg from '../../../../assets/images/common/auth-bg.jpg'
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '../../../../components/Button';
import FormInput from '../../../../components/FormInput';

const Login = () => {
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
            <div className="auth-banner">
                <img src={signinImg} alt="KFC Promotion" className="auth-banner-image" />
            </div>

            <div className="auth-form-section">
                <h2 className="auth-title">ĐĂNG NHẬP</h2>

                <form onSubmit={handleSubmit}>
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

                    <div className="auth-forgot-password">
                        <Link to="/forgot-password" className="auth-link">Bạn quên mật khẩu?</Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </form>

                <div className="social-divider">Hoặc tiếp tục với</div>

                <div className="social-login">
                    <button className="btn-social" onClick={() => handleGoogleLogin()}>
                        <FcGoogle />
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
