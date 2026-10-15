import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, BookOpen, AlertCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchFilters from '../components/search/SearchFilters';
import TagChip from '../components/tags/TagChip';
import BlogList from '../components/blogs/BlogList';
import './Category.css';

export function Category() {
  const { categorySlug } = useParams();

  const category = useMemo(
    () => blogService.getCategoryBySlug(categorySlug),
    [categorySlug]
  );

  const categoryBlogs = useMemo(
    () => (category ? blogService.getBlogsByCategory(categorySlug) : []),
    [category, categorySlug]
  );

  const {
    query,
    setQuery,
    tag,
    setTag,
    sortBy,
    setSortBy,
    results,
    totalCount,
    clearFilters,
    hasActiveFilters,
  } = useSearch({
    initialBlogs: categoryBlogs,
    initialCategory: category?.name || '',
    initialSort: 'title-asc',
  });

  const handleTagToggle = (t) => {
    setTag(tag === t ? '' : t);
  };

  // Graceful 404/not-found handling
  if (!category) {
    return (
      <div className="container category-not-found">
        <SEOHead
          title="Category Not Found"
          description="The requested category could not be found in the BlogAI Directory."
          robots="noindex, follow"
        />
        <div className="empty-category-card">
          <AlertCircle size={40} className="not-found-icon" />
          <h2>Category Not Found</h2>
          <p>We could not find a category matching &ldquo;{categorySlug}&rdquo;.</p>
          <Link to="/" className="btn btn-primary">
            Back to Directory Home
          </Link>
        </div>
      </div>
    );
  }

  // Structured Data Schema for Category CollectionPage
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Blogs Directory`,
    description: category.description,
    url: `https://blogai.directory/category/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BlogAI Directory',
      url: 'https://blogai.directory',
    },
    about: {
      '@type': 'Thing',
      name: category.name,
    },
    numberOfItems: category.count,
  };

  const breadcrumbItems = [{ label: category.name }];

  return (
    <div className="category-page">
      <SEOHead
        title={`${category.name} Blogs - Curated Directory`}
        description={category.description}
        canonicalPath={`/category/${category.slug}`}
        jsonLd={categorySchema}
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Category Header Banner */}
        <header className="category-header">
          <div className="category-header-badge">
            <BookOpen size={16} />
            <span>Category Collection</span>
          </div>

          <h1 className="category-title">{category.name} Blogs</h1>
          <p className="category-desc">{category.description}</p>

          <div className="category-stats-bar">
            <span>
              <strong>{category.count}</strong> curated publications
            </span>
          </div>

          {/* Category-specific popular tags */}
          {category.popularTags && category.popularTags.length > 0 && (
            <div className="category-tags-row">
              <span className="cat-tags-label">Topics:</span>
              <div className="cat-tags-list">
                {category.popularTags.map((pt) => (
                  <TagChip
                    key={pt}
                    tag={pt}
                    isActive={tag.toLowerCase() === pt.toLowerCase()}
                    onClick={handleTagToggle}
                  />
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Filter Controls within Category */}
        <SearchFilters
          query={query}
          onQueryChange={setQuery}
          category=""
          onCategoryChange={() => {}}
          tag={tag}
          onTagChange={setTag}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={totalCount}
          totalBlogs={categoryBlogs.length}
          onClearAll={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Blog Listings */}
        <BlogList
          blogs={results}
          onTagClick={handleTagToggle}
          onResetFilters={clearFilters}
          showCategory={false}
          resetDeps={[query, tag, sortBy, categorySlug]}
        />
      </div>
    </div>
  );
}

export default Category;
