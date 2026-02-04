import React from 'react';
import './Card.css';

const Card = ({ children, className = '', style = {}, ...props }) => {
    return (
        <div 
            className={`card-kfc ${className}`} 
            style={style} 
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
