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
    };

    return (
        <div className='card-wrapper'>
            <div className="card" onClick={() => navigate(`/product-detail/${product.id}`)} style={{ cursor: 'pointer' }}>
                <img src={product1} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Gà rán giòn bên ngoài, mềm bên trong với gia vị bí mật đặc biệt của KFC. Hoàn hảo cho bất kỳ bữa ăn nào.</p>
                    <div className="btn-wrapper d-flex" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn btn-outline-danger btn-wrapper">₫{product.price.toLocaleString('vi-VN')}</button>
                        <button type="button" className="btn btn-danger btn-wrapper" onClick={() => dispatch(addToCart(product))}>Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card