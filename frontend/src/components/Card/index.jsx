import React from 'react';
import './card.css';
import product1 from '../../assets/img/product1.png'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const Card = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = {
        id: 1,
        name: 'Gà rán giòn KFC',
        price: 520000,
        image: product1,
        description: 'Gà rán giòn bên ngoài, mềm bên trong với gia vị bí mật đặc biệt của KFC.'
    };

    return (
        <div className='card-wrapper'>
            <div className="kfc-product-card" onClick={() => navigate(`/product-detail/${product.id}`)} style={{ cursor: 'pointer' }}>
                <img src={product1} className="product-image" alt={product.name} />
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