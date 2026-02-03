import React from 'react';
import './QuantityPicker.css';
import { BsDash, BsPlus } from 'react-icons/bs';

const QuantityPicker = ({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max = 99,
    size = 'medium' // 'small', 'medium', 'large'
}) => {
    return (
        <div className={`quantity-picker-container ${size}`}>
            <button
                className="quantity-picker-btn decrease"
                onClick={onDecrease}
                disabled={quantity <= min}
                aria-label="Decrease quantity"
            >
                <BsDash />
            </button>
            <div className="quantity-picker-display">
                <span>{quantity}</span>
            </div>
            <button
                className="quantity-picker-btn increase"
                onClick={onIncrease}
                disabled={quantity >= max}
                aria-label="Increase quantity"
            >
                <BsPlus />
            </button>
        </div>
    );
};

export default QuantityPicker;
