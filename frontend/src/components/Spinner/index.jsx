import React from 'react';
import PropTypes from 'prop-types';

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
        return <div className="d-flex justify-content-center align-items-center w-100 py-3">{spinner}</div>;
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
