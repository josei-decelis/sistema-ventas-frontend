import React, { useState, useRef, useEffect } from 'react';
import './Autocomplete.scss';

interface AutocompleteOption {
  value: number;
  label: string;
  secondary?: string;
}

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  placeholder = 'Buscar...',
  options,
  value,
  onChange,
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else if (value === 0) {
      setSearchTerm('');
    }
  }, [selectedOption, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        } else {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.secondary && option.secondary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    onChange(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        }
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="autocomplete" ref={wrapperRef}>
      {label && (
        <label className="autocomplete__label">
          {label} {required && <span className="autocomplete__required">*</span>}
        </label>
      )}
      <input
        type="text"
        className="autocomplete__input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        required={required}
        autoComplete="off"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="autocomplete__dropdown">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`autocomplete__option ${
                index === highlightedIndex ? 'autocomplete__option--highlighted' : ''
              } ${option.value === value ? 'autocomplete__option--selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span className="autocomplete__option-label">{option.label}</span>
              {option.secondary && (
                <span className="autocomplete__option-secondary">{option.secondary}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {isOpen && filteredOptions.length === 0 && searchTerm && (
        <div className="autocomplete__no-results">No se encontraron resultados</div>
      )}
    </div>
  );
};
