import React from 'react';
import './Input.scss';

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  min,
  max,
  step,
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-group__label">
          {label} {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`input-group__input ${error ? 'input-group__input--error' : ''}`}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
};
