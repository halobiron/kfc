import React from 'react';
import './card.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Card = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fallback if no product is provided
    if (!product) return null;


    return (
        <div className='card-wrapper'>
            <div className="kfc-product-card" onClick={() => navigate(`/product-detail/${product.id}`)} style={{ cursor: 'pointer' }}>
                <img src={product.image} className="product-image" alt={product.name} />
                <div className="card-body">
                    {/* Title and Price on same row */}
                    <div className="title-price-row">
                        <h5 className="product-title">{product.name}</h5>
                        <span className="product-price">{product.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <p className="product-description">{product.description}</p>
                    {/* Single Add button */}
                    <button
                        type="button"
                        className="btn-add"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addToCart(product));
                        }}
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card