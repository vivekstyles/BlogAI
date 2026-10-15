import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { searchService } from '../services/searchService';

export function useSearch({
  initialBlogs = [],
  initialQuery = '',
  initialCategory = '',
  initialTag = '',
  initialSort = 'title-asc',
} = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [sortBy, setSortBy] = useState(initialSort);

  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => {
    return searchService.search({
      query: debouncedQuery,
      category,
      tag,
      sortBy,
      blogs: initialBlogs,
    });
  }, [debouncedQuery, category, tag, sortBy, initialBlogs]);

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setTag('');
    setSortBy('title-asc');
  };

  const hasActiveFilters = Boolean(query || category || tag || sortBy !== 'title-asc');

  return {
    query,
    setQuery,
    category,
    setCategory,
    tag,
    setTag,
    sortBy,
    setSortBy,
    results,
    totalCount: results.length,
    clearFilters,
    hasActiveFilters,
  };
}

export default useSearch;
