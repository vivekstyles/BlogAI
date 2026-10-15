import React from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import './TagChip.css';

/**
 * Generic TagChip component.
 * Supports both navigable router Link (when `to` or `asLink` is provided)
 * and accessible in-page interactive button (when `onClick` is provided).
 */
export function TagChip({
  tag,
  count,
  isActive = false,
  onClick,
  asLink = false,
  className = '',
}) {
  if (!tag) return null;
  const tagSlug = slugify(tag);

  if (asLink) {
    return (
      <Link
        to={`/tag/${tagSlug}`}
        className={`tag-chip ${isActive ? 'active' : ''} ${className}`}
        aria-label={`View blogs tagged with ${tag}`}
      >
        <span className="tag-hash">#</span>
        <span className="tag-label">{tag}</span>
        {count !== undefined && <span className="tag-count">{count}</span>}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`tag-chip ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onClick && onClick(tag)}
      aria-pressed={isActive}
      aria-label={`Filter by tag: ${tag}`}
    >
      <span className="tag-hash">#</span>
      <span className="tag-label">{tag}</span>
      {count !== undefined && <span className="tag-count">{count}</span>}
    </button>
  );
}

export default TagChip;
