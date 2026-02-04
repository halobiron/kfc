import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EmptyState.css';

const EmptyState = ({
    title,
    description,
    actionText,
    actionPath,
    onAction,
    image,
    className = ''
}) => {
    const navigate = useNavigate();
    const style = image ? { backgroundImage: `url(${image})` } : {};

    const handleAction = () => {
        if (onAction) {
            onAction();
        } else if (actionPath) {
            navigate(actionPath);
        }
    };

    return (
        <div className={`empty-state ${className}`} style={style}>
            <div className="empty-state-content">
                {title && <h2 className="empty-state-title">{title}</h2>}
                {description && <p className="empty-state-message">{description}</p>}

                {actionText && (
                    <button
                        className="btn-kfc"
                        onClick={handleAction}
                        style={{ maxWidth: '300px' }}
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
};

EmptyState.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    actionText: PropTypes.string,
    actionPath: PropTypes.string,
    onAction: PropTypes.func,
    image: PropTypes.string,
    className: PropTypes.string,
};

export default EmptyState;
