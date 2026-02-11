import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = React.forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    startIcon,
    className = '',
    component,
    to,
    href,
    type = 'button',
    ...props
}, ref) => {
    let Component = component || 'button';
    if (to) Component = Link;
    else if (href) Component = 'a';

    const isLink = to || href || Component === 'a' || Component === Link;

    const buttonClass = [
        'kfc-btn',
        `kfc-btn--${variant}`,
        `kfc-btn--${size}`,
        fullWidth && 'kfc-btn--full',
        (disabled || loading) && 'disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <Component
            ref={ref}
            className={buttonClass}
            disabled={!isLink ? (disabled || loading) : undefined}
            type={!isLink ? type : undefined}
            to={to}
            href={href}
            {...props}
        >
            {loading ? (
                <span className="kfc-btn-spinner" />
            ) : (
                <>
                    {startIcon && <span className="kfc-btn-start-icon">{startIcon}</span>}
                    {children}
                </>
            )}
        </Component>
    );
});

Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
    size: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    startIcon: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.elementType,
    to: PropTypes.string,
    href: PropTypes.string,
    type: PropTypes.string
};

export default Button;
