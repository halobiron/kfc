import React from 'react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { changePassword } from '../../authSlice';
import { TextField } from '../../../../components/Common/Form';
import './ChangePassword.css';

const ChangePassword = () => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required('Bắt buộc'),
            newPassword: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Bắt buộc'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
                .required('Bắt buộc'),
        }),
        onSubmit: (values, { setSubmitting, resetForm }) => {
            dispatch(changePassword(values))
                .unwrap()
                .then(() => {
                    toast.success('Đổi mật khẩu thành công!');
                    resetForm();
                })
                .catch((error) => {
                    toast.error(error || 'Đổi mật khẩu thất bại');
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Đổi mật khẩu</h1>
            </div>

            <div className="change-password-wrapper">
                <main className="change-password-form">
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            type="password"
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={formik.values.currentPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.currentPassword}
                            touched={formik.touched.currentPassword}
                            containerClassName="mb-3"
                        />

                        <TextField
                            type="password"
                            name="newPassword"
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.newPassword}
                            touched={formik.touched.newPassword}
                            containerClassName="mb-3"
                        />

                        <TextField
                            type="password"
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            placeholder="Nhập lại mật khẩu mới"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.confirmPassword}
                            touched={formik.touched.confirmPassword}
                            containerClassName="mb-4"
                        />

                        <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                        </button>
                    </form>

                    <p className="change-password-note">&copy; 2026 - KFC Admin</p>
                </main>
            </div>
        </>
    );
};

export default ChangePassword;
