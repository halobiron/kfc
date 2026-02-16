import React from 'react';
import PropTypes from 'prop-types';
import './Badge.css';

const Badge = ({ variant = 'light', children, className = '', ...props }) => {
    const badgeClass = `badge badge-${variant}`;

    return (
        <span
            className={`${badgeClass}${className ? ` ${className}` : ''}`}
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
