import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
}) {
  if (totalPages <= 1) return null;

  // Build page numbers window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-nav" aria-label="Directory pagination">
      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="pagination-btn pagination-prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
        </li>

        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <li key={p}>
              <button
                type="button"
                className={`pagination-number-btn ${isCurrent ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className="pagination-btn pagination-next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Go to next page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
