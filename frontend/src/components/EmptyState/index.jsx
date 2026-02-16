import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
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
    const buttonProps = onAction ? { onClick: onAction } : { to: actionPath };

    return (
        <div
            className={`empty-state ${className}`}
            style={image ? { backgroundImage: `url(${image})` } : undefined}
        >
            <div className="empty-state-content">
                {title && <h2 className="empty-state-title">{title}</h2>}
                {description && <p className="empty-state-message">{description}</p>}

                {actionText && (
                    <Button
                        variant="primary"
                        style={{ maxWidth: '300px' }}
                        {...buttonProps}
                    >
                        {actionText}
                    </Button>
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
