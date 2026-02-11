import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Chọn',
  className = '',
  id,
  icon,
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Find selected item
  const getSelectedItem = () => {
    if (!value) return null;

    // Search in flat options
    let selected = options.find(opt => opt.value === value);
    if (selected) return selected;

    // Search in optgroups
    for (const opt of options) {
      if (opt.options) { // is Group
        selected = opt.options.find(subOpt => subOpt.value === value);
        if (selected) return selected;
      }
    }

    return null;
  };

  const selectedItem = getSelectedItem();
  const displayLabel = selectedItem ? selectedItem.label : (value || placeholder);
  const displayIcon = selectedItem?.icon || icon;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`custom-select-wrapper ${className}`} ref={wrapperRef} id={id}>
      {label && <label className="select-label">{label}</label>}
      <button
        type="button"
        className={`select-trigger text-start ${isOpen ? 'is-open' : ''} ${error ? 'is-invalid' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="d-flex align-items-center text-truncate">
          {displayIcon && <i className={`${displayIcon} me-2`}></i>}
          <span className="text-truncate">{displayLabel}</span>
        </span>
      </button>

      {isOpen && (
        <ul className="select-dropdown">
          {options.map((opt, idx) => {
            // Render Optgroup
            if (opt.options) {
              return (
                <React.Fragment key={idx}>
                  <li><h6 className="select-header">{opt.label}</h6></li>
                  {opt.options.map((subOpt, subIdx) => (
                    <li key={`${idx}-${subIdx}`}>
                      <button
                        className={`select-item ${value === subOpt.value ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleSelect(subOpt.value)}
                      >
                        {subOpt.icon && <i className={`${subOpt.icon} me-2`}></i>}
                        {subOpt.label}
                      </button>
                    </li>
                  ))}
                </React.Fragment>
              );
            }
            // Render Standard Option
            return (
              <li key={idx}>
                <button
                  className={`select-item ${value === opt.value ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.icon && <i className={`${opt.icon} me-2`}></i>}
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
};

export default CustomSelect;
