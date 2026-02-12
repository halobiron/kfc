import React from 'react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { changePassword } from '../../authSlice';
import { TextField } from '../../../../components/Common/Form';

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
            <div className="page-header mb-3">
                <h1 className="page-title mb-0">Đổi mật khẩu</h1>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
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

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
