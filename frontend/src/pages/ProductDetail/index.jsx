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
                        <span>Trang chủ</span> / <span>Thực đơn</span> / <span>{product.category}</span> / <span className="fw-bold" style={{ color: '#000' }}>{product.name}</span>
                    </div>

                    <div className="p-detail-inner card border-0 shadow-sm p-4">
                        <div className="row">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <div className="product-image-container text-center">
                                    <img src={product.image} alt={product.name} className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="product-info-container">
                                    <h1 className="product-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>{product.name}</h1>
                                    <p className="product-description text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{product.description}</p>

                                    <div className="product-price-section mb-4 py-3 border-top border-bottom">
                                        <span className="product-price" style={{ fontSize: '2rem', fontWeight: '700', color: '#e4002b' }}>{product.price.toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    <div className="d-flex align-items-center mb-4">
                                        <div className="quantity-selector d-flex align-items-center bg-light rounded overflow-hidden shadow-sm" style={{ border: '1px solid #dee2e6' }}>
                                            <button className="btn btn-light border-0 px-3 py-2 fw-bold" style={{ fontSize: '1.2rem' }} onClick={handleDecrease}>-</button>
                                            <input
                                                type="text"
                                                className="form-control bg-white border-0 text-center fw-bold"
                                                style={{ width: '60px', pointerEvents: 'none' }}
                                                value={quantity}
                                                readOnly
                                            />
                                            <button className="btn btn-light border-0 px-3 py-2 fw-bold" style={{ fontSize: '1.2rem' }} onClick={handleIncrease}>+</button>
                                        </div>
                                    </div>

                                    <button className="btn btn-danger btn-lg w-100 py-3 fw-bold text-uppercase shadow-sm" style={{ backgroundColor: '#e4002b', border: 'none' }} onClick={handleAddToCart}>
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetail