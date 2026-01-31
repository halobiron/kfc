import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getProductById, updateProduct } from '../../redux/slices/productSlice';
import { getAllIngredients } from '../../redux/slices/ingredientSlice';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiX, FiImage, FiBox, FiPlus, FiTrash2, FiActivity } from 'react-icons/fi';
import './productDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct } = useSelector(state => state.products);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState([]);
    const { ingredients: allIngredients } = useSelector(state => state.ingredients);
    const [selectedIngredientId, setSelectedIngredientId] = useState('');
    const [ingredientQty, setIngredientQty] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getAllIngredients());
            await dispatch(getProductById(id));
            setLoading(false);
        };
        fetchData();
    }, [id, dispatch]);

    const { handleChange, handleSubmit, handleBlur, values, touched, errors, setFieldValue, setValues } = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            productImage: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Tên món ăn là bắt buộc'),
            description: Yup.string().required('Mô tả là bắt buộc'),
            price: Yup.number().required('Giá bán là bắt buộc').min(0, 'Giá phải lớn hơn 0'),
            stock: Yup.number().required('Số lượng tồn kho là bắt buộc').min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
            category: Yup.string().required('Danh mục là bắt buộc'),
        }),
        onSubmit: async (values) => {
            const productData = {
                ...values,
                recipe
            };
            await dispatch(updateProduct({ id, data: productData }));
            toast.success('Cập nhật sản phẩm thành công!');
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
                productImage: currentProduct.productImage || currentProduct.image || ''
            });
            setPreview(currentProduct.productImage || currentProduct.image || '');
            setRecipe(currentProduct.recipe || []);
        }
    }, [currentProduct, setValues]);

    const addIngredientToRecipe = () => {
        if (!selectedIngredientId || !ingredientQty) return;

        const ingredient = allIngredients.find(i => i._id === selectedIngredientId);
        if (ingredient) {
            const exists = recipe.find(r => r.ingredientId === selectedIngredientId);
            if (exists) {
                toast.warning('Nguyên liệu này đã có trong công thức!');
                return;
            }

            setRecipe([...recipe, {
                ingredientId: ingredient._id,
                name: ingredient.name,
                quantity: parseFloat(ingredientQty),
                unit: ingredient.unit
            }]);
            setSelectedIngredientId('');
            setIngredientQty('');
        }
    };

    const removeIngredientFromRecipe = (id) => {
        setRecipe(recipe.filter(r => r.ingredientId !== id));
    };

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

            {/* Form & Recipe Layout */}
            <div className="row g-4">
                <div className="col-lg-8">
                    {/* Info Card */}
                    <div className="card mb-4">
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
                                            name="productImage"
                                            onChange={(event) => {
                                                if (event.target.files && event.target.files[0]) {
                                                    let reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setFieldValue('productImage', reader.result);
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

                    {/* Recipe Card */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header py-3">
                            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FiActivity className="text-primary" /> Công thức chế biến (Định mức)
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Add Ingredient Row - Enhanced Aesthetics */}
                            <div className="row g-2 mb-4 align-items-end p-3 rounded recipe-add-row">
                                <div className="col-md-6">
                                    <label className="form-label">Chọn nguyên liệu từ kho</label>
                                    <select
                                        className="form-select"
                                        value={selectedIngredientId}
                                        onChange={(e) => setSelectedIngredientId(e.target.value)}
                                    >
                                        <option value="">-- Chọn nguyên liệu --</option>
                                        {allIngredients?.map(ing => (
                                            <option key={ing._id} value={ing._id}>
                                                {ing.name} ({ing.unit})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Số lượng tiêu hao</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Ví dụ: 0.5"
                                        value={ingredientQty}
                                        onChange={(e) => setIngredientQty(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={addIngredientToRecipe}
                                    >
                                        <FiPlus size={20} className="me-1" /> Thêm
                                    </button>
                                </div>
                            </div>

                            {/* Ingredients Table - Enhanced Styling */}
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 table-recipe">
                                    <thead>
                                        <tr>
                                            <th>Tên nguyên liệu</th>
                                            <th className="text-center">Số lượng</th>
                                            <th className="text-center">Đơn vị</th>
                                            <th className="text-end pe-3">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recipe.length > 0 ? recipe.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-medium">{item.name}</td>
                                                <td className="text-center fw-bold text-danger">{item.quantity}</td>
                                                <td className="text-center text-muted small">{item.unit}</td>
                                                <td className="text-end pe-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeIngredientFromRecipe(item.ingredientId)}
                                                        style={{ borderRadius: '4px', padding: '4px 8px' }}
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    Chưa có nguyên liệu nào trong công thức.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview (Stays at the top right) */}
                <div className="col-lg-4">
                    <div className="card sticky-top" style={{ top: '80px', zIndex: 10 }}>
                        <div className="card-header">Xem trước món ăn</div>
                        <div className="card-body">
                            {preview ? (
                                <img src={preview} alt="Preview" className="img-fluid rounded mb-3 shadow-sm" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div className="text-center p-4 bg-light rounded mb-3 border">
                                    <FiImage size={48} className="text-muted mb-2" />
                                    <p className="text-muted small mb-0">Chưa có hình ảnh</p>
                                </div>
                            )}
                            <h5 className="fw-bold mb-2 Oswald-font text-uppercase">{values.title || 'Tên món ăn'}</h5>
                            <p className="text-muted small mb-3">{values.description || 'Mô tả món ăn'}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge badge-primary">{values.category || 'Danh mục'}</span>
                                <span className="fw-bold text-danger fs-5">
                                    {values.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(values.price) : '0 đ'}
                                </span>
                            </div>
                            <div className="preview-stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Tồn kho</span>
                                    <div className={`stat-value ${values.stock > 10 ? 'text-success' : 'text-danger'}`}>
                                        <FiBox size={14} /> {values.stock || 0}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Nguyên liệu</span>
                                    <div className="stat-value text-dark">
                                        <FiActivity size={14} className="text-primary" /> {recipe.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
