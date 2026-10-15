import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value over a given delay in milliseconds.
 * @param {any} value
 * @param {number} delay
 * @returns {any}
 */
export function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
