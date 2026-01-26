import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './register.css'
import signinImg from '../../assets/img/signin.jpg'

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { handleSubmit, handleChange, handleBlur, values, touched, errors, isValid, dirty } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().max(50, 'Tối đa 50 ký tự').required('Vui lòng nhập tên'),
            lastName: Yup.string().max(50, 'Tối đa 50 ký tự').required('Vui lòng nhập họ'),
            phone: Yup.string()
                .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số')
                .required('Vui lòng nhập số điện thoại'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu')
        }),
        onSubmit: (values) => {
            if (!agreedToTerms) {
                alert('Vui lòng đồng ý với Chính Sách Hoạt Động và Chính Sách Bảo Mật');
                return;
            }
            console.log('Form submitted:', values)
            alert('Đăng ký thành công!')
        }
    })

    return (
        <Layout>
            <div className='register-wrapper'>
                <div className="register-container">
                    {/* Left promotional banner */}
                    <div className="register-banner">
                        <img src={signinImg} alt="KFC Promotion" className="banner-image" />
                    </div>

                    {/* Right register form */}
                    <div className="register-form-section">
                        <h2 className="register-title">TẠO TÀI KHOẢN</h2>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="lastName">Họ của bạn *</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={values.lastName}
                                    onBlur={handleBlur}
                                    name="lastName"
                                    className="form-input"
                                    id="lastName"
                                />
                                <p className='error'>{touched.lastName && errors.lastName ? errors.lastName : ''}</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="firstName">Tên của bạn *</label>
                                <input
                                    type="text"
                                    onChange={handleChange}
                                    value={values.firstName}
                                    onBlur={handleBlur}
                                    name="firstName"
                                    className="form-input"
                                    id="firstName"
                                />
                                <p className='error'>{touched.firstName && errors.firstName ? errors.firstName : ''}</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    onChange={handleChange}
                                    value={values.phone}
                                    onBlur={handleBlur}
                                    name="phone"
                                    className="form-input"
                                    id="phone"
                                    placeholder="0123456789"
                                />
                                <p className='error'>{touched.phone && errors.phone ? errors.phone : ''}</p>
                            </div>

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

                            <div className="terms-group">
                                <label className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="terms-text">
                                        Tôi đồng ý với <Link to="/terms-of-use" target="_blank">Chính Sách Hoạt Động</Link> và <Link to="/privacy-policy" target="_blank">Chính Sách Bảo Mật</Link>
                                    </span>
                                </label>
                            </div>

                            <button type="submit" className="btn-register" disabled={!isValid || !dirty || !agreedToTerms}>
                                Tạo tài khoản
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
                                Đăng ký bằng Google
                            </button>
                        </div>

                        <div className="login-link">
                            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Register