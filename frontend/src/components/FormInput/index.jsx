import React, { forwardRef } from 'react';
import './FormInput.css';

const FormInput = forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`form-input-kfc ${className}`}
            {...props}
        />
    );
});

export default FormInput;
