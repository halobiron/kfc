import React, { forwardRef, useId } from 'react';
import './FormInput.css';

const FormInput = forwardRef(({ label, containerClass = '', className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    if (label) {
        return (
            <div className={`form-group ${containerClass}`}>
                <label htmlFor={inputId} className="form-label">{label}</label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`form-input-kfc ${className}`}
                    {...props}
                />
            </div>
        );
    }

    return (
        <input
            ref={ref}
            id={inputId}
            className={`form-input-kfc ${className}`}
            {...props}
        />
    );
});

export default FormInput;
