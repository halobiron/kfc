import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = React.forwardRef(({
    children,
    variant = 'primary', // primary, secondary
    size = 'md',         // sm, md, lg
    loading = false,
    disabled = false,
    fullWidth = false,
    startIcon = null,
    className = '',
    component = 'button', // can be 'button', 'a', Link, or motion.button
    to,
    href,
    type = 'button',
    ...props
}, ref) => {

    const Component = component;

    // Logic to determine if we should use Link or a native anchor
    const isLink = component === Link || (typeof component === 'string' && component.toLowerCase() === 'a') || to || href;
    const FinalComponent = to ? Link : (href ? 'a' : Component);

    const baseClass = 'kfc-btn';
    const classes = [
        baseClass,
        `${baseClass}--${variant}`,
        `${baseClass}--${size}`,
        fullWidth ? `${baseClass}--full` : '',
        disabled || loading ? 'disabled' : '',
        className
    ].filter(Boolean).join(' ');

    const otherProps = {
        ref,
        className: classes,
        disabled: disabled || loading,
        ...props
    };

    if (to) otherProps.to = to;
    if (href) otherProps.href = href;
    if (!isLink) otherProps.type = type;

    return (
        <React.Fragment>
            {/* @ts-ignore */}
            <FinalComponent {...otherProps}>
                {loading && (
                    <span className="kfc-btn-spinner"></span>
                )}

                {!loading && (
                    <>
                        {startIcon && <span className="kfc-btn-start-icon">{startIcon}</span>}
                        {children}
                    </>
                )}
            </FinalComponent>
        </React.Fragment>
    );
});

Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
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
