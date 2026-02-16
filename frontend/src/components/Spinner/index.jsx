import React from 'react';
import PropTypes from 'prop-types';
import './Spinner.css';

const Spinner = ({ variant = 'danger', size = 'md', className = '', center = false }) => {
    const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
    const variantClass = variant ? `text-${variant}` : '';

    const spinner = (
        <div 
            className={`spinner-border ${variantClass} ${sizeClass} ${className}`} 
            role="status"
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    if (center) {
        return <div className="spinner-centered">{spinner}</div>;
    }

    return spinner;
};

Spinner.propTypes = {
    variant: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md']),
    className: PropTypes.string,
    center: PropTypes.bool
};

export default Spinner;
