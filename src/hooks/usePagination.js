import { useState, useMemo, useEffect } from 'react';

export function usePagination({ items = [], pageSize = 12, initialPage = 1, resetDeps = [] } = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Automatically reset to page 1 when filter dependencies change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page stays within valid boundaries
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (validPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, validPage, pageSize]);

  const goToPage = (pageNumber) => {
    const p = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(p);
  };

  const nextPage = () => {
    if (validPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (validPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage: validPage,
    totalPages,
    totalItems,
    pageSize,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

export default usePagination;
