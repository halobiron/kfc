import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getProductById, updateProduct } from '../../redux/actions/productActions';
import { FiArrowLeft, FiSave, FiX, FiImage } from 'react-icons/fi';
import './productDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct } = useSelector(state => state.products);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            await dispatch(getProductById(id));
            setLoading(false);
        };
        fetchProduct();
    }, [id, dispatch]);

    const { handleChange, handleSubmit, handleBlur, values, touched, errors, setFieldValue, setValues } = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            image: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Tên món ăn là bắt buộc'),
            description: Yup.string().required('Mô tả là bắt buộc'),
            price: Yup.number().required('Giá bán là bắt buộc').min(0, 'Giá phải lớn hơn 0'),
            stock: Yup.number().required('Số lượng tồn kho là bắt buộc').min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
            category: Yup.string().required('Danh mục là bắt buộc'),
        }),
        onSubmit: async (values) => {
            await dispatch(updateProduct(id, values));
            alert('Cập nhật sản phẩm thành công!');
            navigate('/products');
        }
    });

    useEffect(() => {
        if (currentProduct) {
            setValues({
                title: currentProduct.title || '',
                description: currentProduct.description || '',
                price: currentProduct.price || '',
                stock: currentProduct.stock || '',
                category: currentProduct.category || '',
                image: currentProduct.image || ''
            });
            setPreview(currentProduct.image || '');
        }
    }, [currentProduct, setValues]);

    if (loading) {
        return (
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </main>
        );
    }

    if (!currentProduct) {
        return (
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div className="alert alert-danger mt-4">
                    Không tìm thấy sản phẩm!
                </div>
            </main>
        );
    }

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            {/* Header */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => navigate('/products')}
                        className="btn btn-link text-dark p-0 me-3"
                        title="Quay lại"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="h2 mb-0 font-weight-bold" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700 }}>
                            Chỉnh sửa món ăn
                        </h1>
                        <span className="text-muted small">ID: {id}</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">Thông tin món ăn</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="title" className="form-label">Tên món ăn <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                            className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                                            id="title"
                                        />
                                        {touched.title && errors.title && (
                                            <div className="invalid-feedback">{errors.title}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="category" className="form-label">Danh mục <span className="text-danger">*</span></label>
                                        <select
                                            name="category"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.category}
                                            className={`form-select ${touched.category && errors.category ? 'is-invalid' : ''}`}
                                            id="category"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            <option value="Gà Rán">Gà Rán</option>
                                            <option value="Burger">Burger</option>
                                            <option value="Cơm">Cơm</option>
                                            <option value="Món Phụ">Món Phụ</option>
                                            <option value="Đồ Uống">Đồ Uống</option>
                                            <option value="Combo">Combo</option>
                                        </select>
                                        {touched.category && errors.category && (
                                            <div className="invalid-feedback">{errors.category}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="description" className="form-label">Mô tả <span className="text-danger">*</span></label>
                                        <textarea
                                            name="description"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.description}
                                            className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                                            id="description"
                                            rows="3"
                                        />
                                        {touched.description && errors.description && (
                                            <div className="invalid-feedback">{errors.description}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label">Giá bán (VNĐ) <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            name="price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.price}
                                            className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`}
                                            id="price"
                                        />
                                        {touched.price && errors.price && (
                                            <div className="invalid-feedback">{errors.price}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="stock" className="form-label">Tồn kho <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            name="stock"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.stock}
                                            className={`form-control ${touched.stock && errors.stock ? 'is-invalid' : ''}`}
                                            id="stock"
                                        />
                                        {touched.stock && errors.stock && (
                                            <div className="invalid-feedback">{errors.stock}</div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="image" className="form-label">
                                            <FiImage className="me-2" />
                                            Hình ảnh món ăn
                                        </label>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={(event) => {
                                                if (event.target.files && event.target.files[0]) {
                                                    let reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setFieldValue('image', reader.result);
                                                            setPreview(reader.result);
                                                        }
                                                    }
                                                    reader.readAsDataURL(event.target.files[0]);
                                                }
                                            }}
                                            className="form-control"
                                            id="image"
                                            accept="image/*"
                                        />
                                        <small className="text-muted">Để trống nếu không muốn thay đổi hình ảnh</small>
                                    </div>

                                    <div className="col-12 d-flex gap-2">
                                        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                                            <FiSave size={18} /> Lưu thay đổi
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary d-flex align-items-center gap-2"
                                            onClick={() => navigate('/products')}
                                        >
                                            <FiX size={18} /> Hủy
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">Xem trước</div>
                        <div className="card-body">
                            {preview ? (
                                <img src={preview} alt="Preview" className="img-fluid rounded mb-3" />
                            ) : (
                                <div className="text-center p-4 bg-light rounded mb-3">
                                    <FiImage size={48} className="text-muted" />
                                    <p className="text-muted mt-2 mb-0">Chưa có hình ảnh</p>
                                </div>
                            )}
                            <h5 className="fw-bold">{values.title || 'Tên món ăn'}</h5>
                            <p className="text-muted small">{values.description || 'Mô tả món ăn'}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="badge badge-primary">{values.category || 'Danh mục'}</span>
                                <span className="fw-bold text-danger">
                                    {values.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(values.price) : '0 đ'}
                                </span>
                            </div>
                            <div className="mt-2">
                                <small className="text-muted">Tồn kho: </small>
                                <span className={`badge ${values.stock > 10 ? 'badge-success' : 'badge-warning'}`}>
                                    {values.stock > 0 ? 'Còn hàng' : 'Hết hàng'} ({values.stock || 0})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
