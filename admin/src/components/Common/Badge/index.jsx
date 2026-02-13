import React from 'react';
import PropTypes from 'prop-types';
import './badge.css';

const Badge = ({ variant = 'light', children, className = '', ...props }) => {
    let badgeClass = `badge badge-${variant}`;
    
    if (variant === 'light' || variant === 'warning') {
        if (!className.includes('text-')) {
            badgeClass += ' text-dark';
        }
    }

    return (
        <span 
            className={`${badgeClass} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

Badge.propTypes = {
    variant: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Badge;
