import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryNav.css';

/**
 * Reusable CategoryNav component.
 * Displays horizontal pill navigation for switching or browsing categories.
 */
export function CategoryNav({
  categories = [],
  activeCategorySlug = '',
  totalCount = null,
  onSelectCategory = null,
  asLinks = false,
}) {
  return (
    <nav className="category-nav" aria-label="Category filter navigation">
      <div className="category-nav-scroll">
        {/* All Categories Pill */}
        {asLinks ? (
          <Link
            to="/"
            className={`cat-pill ${!activeCategorySlug ? 'active' : ''}`}
            aria-current={!activeCategorySlug ? 'page' : undefined}
          >
            <span className="cat-pill-name">All Categories</span>
            {totalCount !== null && <span className="cat-pill-count">{totalCount}</span>}
          </Link>
        ) : (
          <button
            type="button"
            className={`cat-pill ${!activeCategorySlug ? 'active' : ''}`}
            onClick={() => onSelectCategory && onSelectCategory('')}
            aria-pressed={!activeCategorySlug}
          >
            <span className="cat-pill-name">All Categories</span>
            {totalCount !== null && <span className="cat-pill-count">{totalCount}</span>}
          </button>
        )}

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isActive = activeCategorySlug === cat.slug;

          if (asLinks) {
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`cat-pill ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="cat-pill-name">{cat.name}</span>
                {cat.count !== undefined && (
                  <span className="cat-pill-count">{cat.count}</span>
                )}
              </Link>
            );
          }

          return (
            <button
              key={cat.slug}
              type="button"
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
              aria-pressed={isActive}
            >
              <span className="cat-pill-name">{cat.name}</span>
              {cat.count !== undefined && (
                <span className="cat-pill-count">{cat.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default CategoryNav;
