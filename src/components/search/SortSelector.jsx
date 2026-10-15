import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import './SortSelector.css';

export function SortSelector({
  value = 'title-asc',
  onChange,
  id = 'sort-by-select',
}) {
  return (
    <div className="sort-selector-wrapper">
      <label htmlFor={id} className="sort-label">
        <ArrowUpDown size={15} className="sort-icon" aria-hidden="true" />
        <span>Sort:</span>
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="sort-select"
        aria-label="Sort blogs by"
      >
        <option value="title-asc">Title (A &rarr; Z)</option>
        <option value="title-desc">Title (Z &rarr; A)</option>
        <option value="category">Category</option>
      </select>
    </div>
  );
}

export default SortSelector;
