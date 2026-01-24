import React from 'react';
import './card.css';
import product1 from '../../assets/img/product1.png'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';

const Card = () => {
    const dispatch = useDispatch();
    
    const product = {
        id: 1,
        name: 'Gà rán giòn KFC',
        price: 520000,
        image: product1,
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className='card-wrapper'>
            <div className="card">
                <img src={product1} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Gà rán giòn bên ngoài, mềm bên trong với gia vị bí mật đặc biệt của KFC. Hoàn hảo cho bất kỳ bữa ăn nào.</p>
                    <div className="btn-wrapper d-flex">
                        <button type="button" className="btn btn-outline-danger btn-wrapper">₫{product.price.toLocaleString('vi-VN')}</button>
                        <button type="button" className="btn btn-danger btn-wrapper" onClick={handleAddToCart}>Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card