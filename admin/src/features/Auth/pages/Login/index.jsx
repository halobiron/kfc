import React, { useEffect } from 'react'
import './Login.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Địa chỉ email không hợp lệ').required('Bắt buộc'),
            password: Yup.string().required('Bắt buộc')
        }),
        onSubmit: (values) => {
            dispatch(login(values));
        }
    })
    return (
        <div className="login-wrapper">
            <main className="form-signin">
                <form onSubmit={handleSubmit}>
                    <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png" alt="KFC Logo" style={{ width: '120px', margin: '0 auto 20px', display: 'block' }} />
                    <h1 className="h3 mb-3 fw-normal">Đăng nhập vào hệ thống</h1>
                    <div className="form-floating">
                        <input type="email" onChange={handleChange} onBlur={handleBlur} value={values.email} name="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Địa chỉ Email</label>
                        <p style={{ color: 'red' }}>{touched.email && errors.email ? errors.email : null}</p>
                    </div>
                    <div className="form-floating">
                        <input type="password" onChange={handleChange} onBlur={handleBlur} value={values.password} name="password" className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Mật khẩu</label>
                        <p style={{ color: 'red' }}>{touched.password && errors.password ? errors.password : null}</p>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2026 - KFC Admin</p>
                </form>
            </main>
        </div>
    )
}

export default Login