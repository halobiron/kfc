import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import authApi from '../../api/authApi';
import './login.css'
import signinImg from '../../assets/img/signin.jpg'

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
            } catch (error) {
                const message = error.response?.data?.message || 'Đăng nhập thất bại';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        }
    })

    return (
        <div className='login-wrapper'>
            <div className="login-container">
                {/* Left promotional banner */}
                <div className="login-banner">
                    <img src={signinImg} alt="KFC Promotion" className="banner-image" />
                </div>

                {/* Right login form */}
                <div className="login-form-section">
                    <h2 className="login-title">ĐĂNG NHẬP</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Địa chỉ email của bạn *</label>
                            <input
                                type="email"
                                onChange={handleChange}
                                value={values.email}
                                onBlur={handleBlur}
                                name="email"
                                className="form-input"
                                id="email"
                                placeholder="example@email.com"
                            />
                            <p className='error'>{touched.email && errors.email ? errors.email : ''}</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu *</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    onChange={handleChange}
                                    value={values.password}
                                    onBlur={handleBlur}
                                    name='password'
                                    className="form-input"
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

                        <div className="forgot-password">
                            <Link to="/forgot-password">Bạn quên mật khẩu?</Link>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="social-divider">Hoặc tiếp tục với</div>

                    <div className="social-login">
                        <button className="btn-social btn-google">
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
                                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
                                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                            </svg>
                            Đăng nhập bằng Google
                        </button>
                    </div>

                    <div className="register-link">
                        Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </div>

                    <div className="auth-footer-policies mt-3 text-center" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                        Bằng cách đăng nhập, bạn đồng ý với <br />
                        <Link to="/terms-of-use" target="_blank" style={{ color: '#6c757d', textDecoration: 'underline' }}>Chính Sách Hoạt Động</Link> và <Link to="/privacy-policy" target="_blank" style={{ color: '#6c757d', textDecoration: 'underline' }}>Chính Sách Bảo Mật</Link> của KFC.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
