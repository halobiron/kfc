import React, { useEffect } from 'react'
import './Login.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField } from '../../../../components/Common/Form';
import Button from '../../../../components/Common/Button';
import '../../../../components/Common/Form/Form.css';

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

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Địa chỉ email không hợp lệ').required('Bắt buộc'),
            password: Yup.string().required('Bắt buộc')
        }),
        onSubmit: (formValues) => {
            dispatch(login(formValues));
        }
    })
    return (
        <div className="login-wrapper">
            <main className="form-signin">
                <form onSubmit={formik.handleSubmit}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png"
                        alt="KFC Logo"
                        className="login-logo"
                    />
                    <h1 className="h3 mb-3 fw-normal">Đăng nhập vào hệ thống</h1>
                    <TextField
                        type="email"
                        name="email"
                        label="Địa chỉ Email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.email}
                        touched={formik.touched.email}
                        containerClassName="mb-3"
                    />
                    <TextField
                        type="password"
                        name="password"
                        label="Mật khẩu"
                        placeholder="Nhập mật khẩu"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.password}
                        touched={formik.touched.password}
                        containerClassName="mb-3"
                    />

                    <div className="d-grid gap-2">
                        <Button size="lg" type="submit" loading={loading}>
                            Đăng nhập
                        </Button>
                    </div>
                    <p className="mt-5 mb-3 text-muted">&copy; 2026 - KFC Admin</p>
                </form>
            </main>
        </div>
    )
}

export default Login
