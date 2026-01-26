import React from 'react'
import Layout from '../../components/Layout'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {


    const { handleSubmit, handleChange, handleBlur, values, touched, errors, isValid, dirty } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            address: '',
            city: '',
            state: '',
            zip: ''
        },
        validationSchema: Yup.object({
            firstName: Yup.string().max(15, 'Tối đa 15 ký tự').required('Vui lòng nhập tên'),
            lastName: Yup.string().max(15, 'Tối đa 15 ký tự').required('Vui lòng nhập họ'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
            address: Yup.string().required('Vui lòng nhập địa chỉ'),
            city: Yup.string().required('Vui lòng nhập thành phố'),
            state: Yup.string().required('Vui lòng chọn tỉnh/thành phố'),
            zip: Yup.string().required('Vui lòng nhập mã bưu chính')
        }),
        onSubmit: (values) => {
            console.log('Form submitted:', values)
            alert('Đăng ký thành công!')
        }
    })
    return (
        <Layout>
            <div className='register-wrapper py-5'>
                <div className="container">
                    <div className="lead-text mt-0">
                        <h3>KHÁCH HÀNG MỚI</h3>
                    </div>
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                    <hr />
                    <button className='btn btn-danger d-block w-100 mb-2'>Đăng nhập bằng Google</button>
                    <button className='btn btn-primary d-block w-100'>Đăng nhập bằng Facebook</button>
                    <hr />
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label">Tên</label>
                            <input type="text" onChange={handleChange} value={values.firstName} onBlur={handleBlur} name="firstName" className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`} id="firstName" />
                            <p className='error'>{touched.firstName && errors.firstName ? errors.firstName : null}</p>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label">Họ</label>
                            <input type="text" onChange={handleChange} value={values.lastName} onBlur={handleBlur} name='lastName' className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`} id="lastName" />
                            <p className='error'>{touched.lastName && errors.lastName ? errors.lastName : null}</p>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" onChange={handleChange} value={values.email} onBlur={handleBlur} name="email" className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} id="email" />
                            <p className='error'>{touched.email && errors.email ? errors.email : null}</p>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input type="password" onChange={handleChange} value={values.password} onBlur={handleBlur} name='password' className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`} id="password" />
                            <p className='error'>{touched.password && errors.password ? errors.password : null}</p>
                        </div>
                        <div className="col-12">
                            <label htmlFor="address" className="form-label">Địa chỉ</label>
                            <input type="text" name='address' onChange={handleChange} value={values.address} onBlur={handleBlur} className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`} id="address" placeholder="Ví dụ: 123 Đường Lê Lợi" />
                            <p className='error'>{touched.address && errors.address ? errors.address : null}</p>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="city" className="form-label">Thành phố</label>
                            <input type="text" onChange={handleChange} value={values.city} onBlur={handleBlur} name='city' className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''}`} id="city" />
                            <p className='error'>{touched.city && errors.city ? errors.city : null}</p>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="state" className="form-label">Tỉnh/Thành phố</label>
                            <select id="state" onChange={handleChange} value={values.state} onBlur={handleBlur} name="state" className={`form-select ${touched.state && errors.state ? 'is-invalid' : ''}`}>
                                <option>Chọn...</option>
                                <option>Hà Nội</option>
                                <option>Thành phố Hồ Chí Minh</option>
                                <option>Đà Nẵng</option>
                                <option>Hải Phòng</option>
                                <option>Cần Thơ</option>
                            </select>
                            <p className='error'>{touched.state && errors.state ? errors.state : null}</p>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="zip" className="form-label">Mã bưu chính</label>
                            <input type="text" onChange={handleChange} value={values.zip} onBlur={handleBlur} name='zip' className={`form-control ${touched.zip && errors.zip ? 'is-invalid' : ''}`} id="zip" />
                            <p className='error'>{touched.zip && errors.zip ? errors.zip : null}</p>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary" disabled={!isValid || !dirty}>Đăng ký</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Register