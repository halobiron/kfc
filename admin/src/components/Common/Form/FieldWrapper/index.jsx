import React from 'react';

const FieldWrapper = ({
    label,
    required = false,
    htmlFor,
    error,
    touched,
    hint,
    containerClassName = 'mb-3',
    children,
}) => {
    const showError = Boolean(error) && (touched === undefined || touched);

    return (
        <div className={containerClassName}>
            {label ? (
                <label htmlFor={htmlFor} className="form-label">
                    {label} {required ? <span className="text-danger">*</span> : null}
                </label>
            ) : null}

            {children}

            {showError ? <div className="invalid-feedback d-block">{error}</div> : null}
            {!showError && hint ? <small className="text-muted d-block mt-1">{hint}</small> : null}
        </div>
    );
};

export default FieldWrapper;
