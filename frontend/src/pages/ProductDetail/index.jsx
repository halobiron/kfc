import React, { useState } from 'react';
import Layout from '../../components/Layout';
import product1 from '../../assets/img/product1.png';
import './product-detail.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    // Mock product data - in a real app, you would fetch this by id
    const product = {
        id: id || 'ga-lac-bbq',
        name: '1 Gà Lắc BBQ',
        description: 'Gà rán giòn rụm kết hợp cùng hương vị BBQ đậm đà, thơm ngon, ai cũng muốn xin miếng!',
        price: 39000,
        image: product1,
        category: 'Món Mới'
    };

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    };

    return (
        <Layout>
            <div className='product-detail-wrapper'>
                <div className="container py-5">
                    <div className="product-breadcrumb mb-4">
                        <span>Trang chủ</span> <span className="separator">/</span> <span>Thực đơn</span> <span className="separator">/</span> <span>{product.category}</span> <span className="separator">/</span> <span className="current">{product.name}</span>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-7 col-md-6">
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div className="product-info-card">
                                <h1 className="product-title">{product.name}</h1>
                                <p className="product-description">{product.description}</p>

                                <div className="product-price-section">
                                    <span className="product-price">{product.price.toLocaleString('vi-VN')}₫</span>
                                </div>

                                <div className="quantity-section">
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
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetail