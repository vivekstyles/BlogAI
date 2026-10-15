import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';
import { useSearch } from '../hooks/useSearch';

describe('Hook: usePagination', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  it('paginates items according to pageSize', () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 10 }));

    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);

    // Go to next page
    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.hasPrevPage).toBe(true);

    // Go to page 3
    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.paginatedItems).toHaveLength(5);
    expect(result.current.hasNextPage).toBe(false);
  });
});

describe('Hook: useSearch', () => {
  const sampleData = [
    { id: '1', title: 'React Insights', category: 'Engineering', categorySlug: 'engineering', tags: ['frontend'] },
    { id: '2', title: 'Calculus Deep Dive', category: 'Mathematics', categorySlug: 'mathematics', tags: ['calculus'] },
  ];

  it('filters results dynamically and provides reset capability', () => {
    const { result } = renderHook(() => useSearch({ initialBlogs: sampleData }));

    expect(result.current.totalCount).toBe(2);

    act(() => {
      result.current.setCategory('Engineering');
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.totalCount).toBe(2);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
