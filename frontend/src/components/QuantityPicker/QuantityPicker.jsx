import React from 'react';
import './QuantityPicker.css';

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
                <i className="bi bi-dash"></i>
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
                <i className="bi bi-plus"></i>
            </button>
        </div>
    );
};

export default QuantityPicker;
