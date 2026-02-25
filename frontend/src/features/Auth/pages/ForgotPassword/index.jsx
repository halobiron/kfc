import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authApi from '../../../../api/authApi';
import '../../auth.css';
import './ForgotPassword.css';
import authBg from '../../../../assets/images/common/auth-bg.jpg';
import Button from '../../../../components/Button';
import FormInput from '../../../../components/FormInput';

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const { handleBlur, handleSubmit, handleChange, touched, errors, values } = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Vui lòng nhập email hợp lệ').required('Email là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await authApi.forgotPassword(values);

                if (response.status) {
                    setEmailSent(true);
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                const message = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="auth-container">
            {/* Left promotional banner */}
            <div className="auth-banner">
                <img src={authBg} alt="KFC Promotion" className="auth-banner-image" />
            </div>

            {/* Right form section */}
            <div className="auth-form-section">
                {!emailSent ? (
                    <>
                        <h2 className="auth-title">QUÊN MẬT KHẨU</h2>
                        <p className="auth-description">
                            Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <FormInput
                                id="email"
                                name="email"
                                type="email"
                                label="Địa chỉ email của bạn *"
                                placeholder="example@email.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                                variant="underlined"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                fullWidth
                            >
                                Gửi email
                            </Button>
                        </form>

                        <div className="auth-footer-link">
                            <Link to="/login" className="auth-link">← Quay lại đăng nhập</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="auth-title">KIỂM TRA EMAIL CỦA BẠN</h2>
                        <div className="auth-success-container">
                            <div className="auth-success-icon">📧</div>
                            <p className="auth-success-text">
                                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{values.email}</strong>
                            </p>
                            <p className="auth-success-subtext">
                                Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn trong email.
                                Link sẽ hết hạn sau 10 phút.
                            </p>
                            <Button
                                component={Link}
                                to="/login"
                                variant="primary"
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
