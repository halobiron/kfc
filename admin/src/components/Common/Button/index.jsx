import React from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

/**
 * Reusable Button Component for Admin Panel
 * Standardizes button styles and behaviors across the application.
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
 *            'outline-primary' | 'outline-secondary' | etc.
 * - size: 'sm' | 'lg' | 'default'
 * - type: 'button' | 'submit' | 'reset'
 * - loading: boolean (shows spinner, disables button)
 * - disabled: boolean
 * - className: string (additional classes)
 * - icon: ReactNode (icon to display before text)
 * - children: ReactNode (button content)
 * - onClick: function
 */
const Button = ({ 
    children, 
    variant = 'primary', 
    size, 
    type = 'button', 
    className = '', 
    loading = false, 
    disabled = false, 
    icon,
    onClick,
    ...props 
}) => {
    // Base bootstrap class
    let btnClasses = ['btn'];
    
    // Add variant class
    if (variant) {
        btnClasses.push(`btn-${variant}`);
    }
    
    // Add size class
    if (size && size !== 'default') {
        btnClasses.push(`btn-${size}`);
    }
    
    // Add custom classes
    if (className) {
        btnClasses.push(className);
    }
    
    // Join all classes
    const combinedClassName = btnClasses.join(' ');
    const hasText = children !== undefined && children !== null && children !== '';

    return (
        <button 
            type={type} 
            className={combinedClassName}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <>
                    <span 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status" 
                        aria-hidden="true"
                    ></span>
                    {children || 'Loading...'}
                </>
            ) : (
                <>
                    {icon && <span className={hasText ? 'me-2 d-inline-flex' : 'd-inline-flex'}>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg', 'default']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    onClick: PropTypes.func
};

export const AddButton = ({ onClick, ...props }) => (
    <Button 
        variant="primary" 
        className="d-flex align-items-center gap-2 shadow-sm"
        icon={<FiPlus size={20} />}
        onClick={onClick}
        title={props.title || 'Thêm mới'}
        aria-label={props['aria-label'] || 'Thêm mới'}
        {...props}
    />
);

export const EditButton = ({ onClick, children, ...props }) => (
    <Button 
        size="sm" 
        variant="outline-primary" 
        icon={<FiEdit2 />}
        onClick={onClick}
        title={props.title || 'Sửa'}
        aria-label={props['aria-label'] || 'Sửa'}
        {...props} 
    >
        {children}
    </Button>
);

export const DeleteButton = ({ onClick, children, ...props }) => (
    <Button 
        size="sm" 
        variant="outline-danger" 
        icon={<FiTrash2 />}
        onClick={onClick}
        title={props.title || 'Xóa'}
        aria-label={props['aria-label'] || 'Xóa'}
        {...props}
    >
        {children}
    </Button>
);

export default Button;
