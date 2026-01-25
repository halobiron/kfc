import React from 'react'
import './login.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import kfcLogo from '@shared-assets/img/KFC-Logo.png';

const Login = () => {

    const { handleSubmit, handleChange, handleReset, handleBlur, values, touched, errors } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required')
        }),
        onSubmit: (values) => {
            console.log(values)
        }
    })
    return (
        <div className="login-wrapper">
            <main className="form-signin">
                <form onSubmit={handleSubmit}>
                    <img src={kfcLogo} alt="KFC Logo" style={{ width: '120px', margin: '0 auto 20px', display: 'block' }} />
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

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Đăng nhập</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2026 - KFC Admin</p>
                </form>
            </main>
        </div>
    )
}

export default Login