import React from 'react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { changePassword } from '../../redux/slices/authSlice';

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
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="page-header mb-3">
                <h1 className="page-title mb-0">Đổi mật khẩu</h1>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="currentPassword"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        {...formik.getFieldProps('currentPassword')}
                                    />
                                    {formik.touched.currentPassword && formik.errors.currentPassword ? (
                                        <div className="text-danger small mt-1">{formik.errors.currentPassword}</div>
                                    ) : null}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        placeholder="Nhập mật khẩu mới"
                                        {...formik.getFieldProps('newPassword')}
                                    />
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <div className="text-danger small mt-1">{formik.errors.newPassword}</div>
                                    ) : null}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        placeholder="Nhập lại mật khẩu mới"
                                        {...formik.getFieldProps('confirmPassword')}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="text-danger small mt-1">{formik.errors.confirmPassword}</div>
                                    ) : null}
                                </div>

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
        </main>
    );
};

export default ChangePassword;
