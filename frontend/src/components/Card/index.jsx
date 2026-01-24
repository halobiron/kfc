import React from 'react';
import './card.css';
import product1 from '../../assets/img/product1.png'
const Card = () => {
    return (
        <div className='card-wrapper'>
            <div className="card">
                <img src={product1} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Gà rán giòn KFC</h5>
                    <p className="card-text">Gà rán giòn bên ngoài, mềm bên trong với gia vị bí mật đặc biệt của KFC. Hoàn hảo cho bất kỳ bữa ăn nào.</p>
                    <div className="btn-wrapper d-flex">
                        <button type="button" className="btn btn-outline-danger btn-wrapper">₫520,000</button>
                        <button type="button" className="btn btn-danger  btn-wrapper">Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card