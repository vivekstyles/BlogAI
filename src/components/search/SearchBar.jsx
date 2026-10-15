import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * Reusable, accessible SearchBar controlled component.
 */
export function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by title, domain, author, or keywords...',
  id = 'blog-search-input',
  'aria-label': ariaLabel = 'Search blogs directory',
  autoFocus = false,
  className = '',
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Keyboard shortcut: pressing '/' focuses the search bar if not typing in an input
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  return (
    <div className={`search-bar-wrapper ${className}`}>
      <div className="search-bar-inner">
        <label htmlFor={id} className="sr-only">
          {ariaLabel}
        </label>
        <Search size={19} className="search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck="false"
          className="search-input"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="Clear search query"
            title="Clear search"
          >
            <X size={16} />
          </button>
        ) : (
          <span className="search-shortcut-badge desktop-only" title="Press / to search">
            /
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
