import React from 'react';
import './Card.css';

const Card = ({ children, className = '', style = {}, interactive = false, ...props }) => {
    return (
        <div
            className={`card-kfc ${interactive ? 'interactive' : ''} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
