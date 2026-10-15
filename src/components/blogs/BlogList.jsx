import React from 'react';
import BlogGrid from './BlogGrid';
import Pagination from './Pagination';
import EmptyState from '../search/EmptyState';
import { usePagination } from '../../hooks/usePagination';
import './BlogList.css';

/**
 * Reusable BlogList container component.
 */
export function BlogList({
  blogs = [],
  isLoading = false,
  error = null,
  emptyTitle = 'No blogs found',
  emptyMessage = 'No blogs match the current criteria.',
  onResetFilters = null,
  onTagClick = null,
  showCategory = true,
  pageSize = 12,
  resetDeps = [],
}) {
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination({
    items: blogs,
    pageSize,
    resetDeps: [blogs.length, ...resetDeps],
  });

  if (isLoading) {
    return (
      <div className="blog-list-loading" aria-label="Loading blogs">
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="blog-list-wrapper">
      <BlogGrid
        blogs={paginatedItems}
        onTagClick={onTagClick}
        showCategory={showCategory}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}

export default BlogList;
