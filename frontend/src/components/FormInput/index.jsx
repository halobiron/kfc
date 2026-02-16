import React, { forwardRef, useId } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './FormInput.css';

const FormInput = forwardRef(({
    label,
    containerClass = '',
    className = '',
    id,
    type = 'text',
    error,
    variant = 'outlined', // 'outlined' | 'underlined'
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={`form-group ${containerClass}`}>
            {label && <label htmlFor={inputId} className="form-label">{label}</label>}

            <div className={isPassword ? "password-input-wrapper" : ""}>
                {type === 'textarea' ? (
                    <textarea
                        ref={ref}
                        id={inputId}
                        className={`form-input-kfc ${error ? 'is-invalid' : ''} ${className}`}
                        {...props}
                    />
                ) : (
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        className={`form-input-kfc ${variant} ${error ? 'is-invalid' : ''} ${className}`}
                        {...props}
                    />
                )}

                {isPassword && (
                    <button
                        type="button"
                        className="btn-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>

            {error && <span className="form-error-message">{error}</span>}
        </div>
    );
});

export default FormInput;
