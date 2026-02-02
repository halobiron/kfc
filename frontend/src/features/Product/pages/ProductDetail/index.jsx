import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './product-detail.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../Cart/cartSlice';
import { getProductById } from '../../productSlice';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { currentProduct: product, loading } = useSelector((state) => state.products);

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
    }, [dispatch, id]);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({ ...product, quantity }));
        toast.success(`Đã thêm ${quantity} ${product.title} vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-5">Không tìm thấy sản phẩm</div>;
    }

    const price = product.price || 0;

    return (
        <div className='product-detail-wrapper'>
            <div className="container py-5">
                <div className="product-breadcrumb mb-4">
                    <span>Trang chủ</span> <span className="separator">/</span> <span>Thực đơn</span> <span className="separator">/</span> <span>{product.category}</span> <span className="separator">/</span> <span className="current">{product.title}</span>
                </div>

                <div className="row g-4 justify-content-center">
                    <div className="col-lg-7 col-md-6">
                        <div className="product-image-container">
                            <img src={product.productImage} alt={product.title} className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-6">
                        <div className="product-info-card">
                            <div className="product-category-badge">{product.category}</div>
                            <h1 className="product-title">{product.title}</h1>
                            <p className="product-description">{product.description}</p>

                            <div className="product-price-section">
                                <span className="product-price">{price.toLocaleString('vi-VN')}₫</span>
                            </div>

                            <div className="quantity-section">
                                <span className="section-label">Số lượng</span>
                                <div className="quantity-selector">
                                    <button className="quantity-btn" onClick={handleDecrease}>-</button>
                                    <input
                                        type="text"
                                        className="quantity-input"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button className="quantity-btn" onClick={handleIncrease}>+</button>
                                </div>
                            </div>

                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                Thêm vào giỏ hàng
                            </button>

                            <div className="product-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Giao hàng nhanh</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Đảm bảo chất lượng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
