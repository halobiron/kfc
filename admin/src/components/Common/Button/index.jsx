import PropTypes from 'prop-types';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Loading from '../Loading';
import './Button.css';

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
    let btnClasses = ['btn', 'common-btn'];

    if (variant) {
        btnClasses.push(`btn-${variant}`);
    }

    if (size && size !== 'default') {
        btnClasses.push(`btn-${size}`);
    }

    if (className) {
        btnClasses.push(className);
    }

    const combinedClassName = btnClasses.join(' ');
    return (
        <button
            type={type}
            className={combinedClassName}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                    <Loading size="sm" text="" />
                    <span className="ms-2">{children || 'Loading...'}</span>
                </div>
            ) : (
                <>
                    {icon && <span className="d-inline-flex">{icon}</span>}
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
        className="shadow-sm"
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
        variant="outline-dark"
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
