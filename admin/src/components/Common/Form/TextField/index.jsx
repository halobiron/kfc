import React from 'react';
import FieldWrapper from '../FieldWrapper';

const TextField = ({
    label,
    required,
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    type = 'text',
    as = 'input',
    rows,
    disabled,
    error,
    touched,
    hint,
    containerClassName,
    className = '',
    ...rest
}) => {
    const showError = Boolean(error) && (touched === undefined || touched);
    const controlClass = `form-control${showError ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`;

    return (
        <FieldWrapper
            label={label}
            required={required}
            htmlFor={id || name}
            error={error}
            touched={touched}
            hint={hint}
            containerClassName={containerClassName}
        >
            {as === 'textarea' ? (
                <textarea
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    required={required}
                    className={controlClass}
                    {...rest}
                />
            ) : (
                <input
                    id={id || name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={controlClass}
                    {...rest}
                />
            )}
        </FieldWrapper>
    );
};

export default TextField;
