import React from 'react';
import FieldWrapper from './FieldWrapper';

const SelectField = ({
    label,
    required,
    id,
    name,
    value,
    onChange,
    onBlur,
    disabled,
    options = [],
    getOptionValue = (option) => option.value,
    getOptionLabel = (option) => option.label,
    error,
    touched,
    hint,
    containerClassName,
    className = '',
    children,
    ...rest
}) => {
    const showError = Boolean(error) && (touched === undefined || touched);
    const controlClass = `form-select${showError ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`;

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
            <select
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                className={controlClass}
                {...rest}
            >
                {children ||
                    options.map((option) => (
                        <option key={getOptionValue(option)} value={getOptionValue(option)}>
                            {getOptionLabel(option)}
                        </option>
                    ))}
            </select>
        </FieldWrapper>
    );
};

export default SelectField;
