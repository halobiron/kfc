
import React from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

const Loading = ({
    size = 'md',
    center = false,
    fullScreen = false,
    text = 'Đang tải...',
    className = ''
}) => {
    // Determine size class
    const sizeClass = size === 'lg' ? 'spinner-lg' :
        size === 'sm' ? 'spinner-sm' : '';

    // Determine container class based on props
    let containerClass = 'loading-inline';
    if (fullScreen) {
        containerClass = 'loading-fullscreen';
    } else if (center) {
        containerClass = 'loading-center';
    }

    return (
        <div className={`${containerClass} ${className}`}>
            <div className={`spinner ${sizeClass}`}></div>
            {text && <span className={(fullScreen || center) ? "mt-2 text-muted" : "text-muted"}>{text}</span>}
        </div>
    );
};

Loading.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    center: PropTypes.bool,
    fullScreen: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string
};

export default Loading;
