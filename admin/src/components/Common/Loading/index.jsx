import React from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

const Loading = ({
    size = 'md',
    center = false,
    text = 'Đang tải...',
    className = ''
}) => {
    const sizeClass = size === 'sm' ? 'spinner-border-sm' :
        size === 'lg' ? 'spinner-lg' : '';

    const containerClass = center ? 'loading-center' : 'loading-inline';

    return (
        <div className={`${containerClass} ${className}`}>
            <div className={`spinner-border text-primary ${sizeClass}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {text && <div className={center ? "mt-2 text-muted fw-medium" : "text-muted small"}>{text}</div>}
        </div>
    );
};

Loading.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    center: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string
};

export default Loading;
