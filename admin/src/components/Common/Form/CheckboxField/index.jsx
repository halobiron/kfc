import React from 'react';

const CheckboxField = ({
    id,
    name,
    label,
    checked,
    onChange,
    disabled,
    className = '',
    containerClassName = 'form-check',
    hint,
}) => {
    return (
        <div className={containerClassName}>
            <input
                id={id || name}
                name={name}
                className={`form-check-input${className ? ` ${className}` : ''}`}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            {label ? (
                <label className="form-check-label" htmlFor={id || name}>
                    {label}
                </label>
            ) : null}
            {hint ? <div className="form-text small text-muted">{hint}</div> : null}
        </div>
    );
};

export default CheckboxField;
