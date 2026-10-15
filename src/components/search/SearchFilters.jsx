import React from 'react';
import SearchBar from './SearchBar';
import SortSelector from './SortSelector';
import TagChip from '../tags/TagChip';
import { Filter, X } from 'lucide-react';
import './SearchFilters.css';

export function SearchFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories = [],
  tag,
  onTagChange,
  sortBy,
  onSortChange,
  totalResults,
  totalBlogs,
  onClearAll,
  hasActiveFilters,
}) {
  return (
    <div className="search-filters-container">
      {/* Top Search Bar & Sort Row */}
      <div className="search-bar-row">
        <SearchBar
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onClear={() => onQueryChange('')}
        />
        <div className="sort-wrapper">
          <SortSelector value={sortBy} onChange={onSortChange} />
        </div>
      </div>

      {/* Active Filter Badges & Clear Row */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="active-filters-label">
            <Filter size={14} /> Active filters:
          </span>

          <div className="active-filter-chips">
            {query && (
              <span className="filter-chip">
                <span>Search: &ldquo;{query}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  aria-label="Remove search query filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {category && (
              <span className="filter-chip">
                <span>Category: {category}</span>
                <button
                  type="button"
                  onClick={() => onCategoryChange('')}
                  aria-label="Remove category filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {tag && (
              <span className="filter-chip">
                <span>Tag: #{tag}</span>
                <button
                  type="button"
                  onClick={() => onTagChange('')}
                  aria-label="Remove tag filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onClearAll}
              className="clear-all-filters-btn"
            >
              Reset all
            </button>
          </div>
        </div>
      )}

      {/* Results Count Summary */}
      <div className="results-summary-row" aria-live="polite">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> of {totalBlogs} blogs
        </span>
      </div>
    </div>
  );
}

export default SearchFilters;
