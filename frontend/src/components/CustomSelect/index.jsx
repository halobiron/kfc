import React, { useState, useRef, useEffect, useMemo } from 'react';
import './CustomSelect.css';

const CustomSelect = ({
  options = [], value, onChange, placeholder = 'Chọn',
  className = '', id, icon, label, error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => containerRef.current?.contains(e.target) || setIsOpen(false);
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = useMemo(() =>
    options.flatMap(o => o.options || [o]).find(o => o.value === value)
    , [options, value]);

  const handleSelect = (val) => {
    onChange?.(val);
    setIsOpen(false);
  };

  const renderOption = (opt, key) => (
    <li key={key}>
      <button
        type="button"
        className={`select-item ${value === opt.value ? 'active' : ''}`}
        onClick={() => handleSelect(opt.value)}
      >
        {opt.icon && <i className={`${opt.icon} me-2`} />}
        {opt.label}
      </button>
    </li>
  );

  return (
    <div className={`custom-select-wrapper ${className}`} ref={containerRef} id={id}>
      {label && <label className="select-label">{label}</label>}
      <button
        type="button"
        className={`select-trigger text-start ${isOpen ? 'is-open' : ''} ${error ? 'is-invalid' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="d-flex align-items-center text-truncate">
          {(selected?.icon || icon) && <i className={`${selected?.icon || icon} me-2`} />}
          <span className="text-truncate">{selected?.label || value || placeholder}</span>
        </span>
      </button>

      {isOpen && (
        <ul className="select-dropdown">
          {options.map((opt, i) => opt.options ? (
            <React.Fragment key={i}>
              <li className="select-header">{opt.label}</li>
              {opt.options.map((sub, si) => renderOption(sub, `${i}-${si}`))}
            </React.Fragment>
          ) : renderOption(opt, i))}
        </ul>
      )}
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
};

export default CustomSelect;
