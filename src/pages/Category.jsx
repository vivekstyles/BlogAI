import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, BookOpen, AlertCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { articleService } from '../services/articleService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import { SITE_URL, buildCategoryTitle, buildBreadcrumbSchema } from '../utils/seo';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchFilters from '../components/search/SearchFilters';
import TagChip from '../components/tags/TagChip';
import BlogList from '../components/blogs/BlogList';
import ArticleCard from '../components/articles/ArticleCard';
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

  const categoryArticles = useMemo(
    () => (category ? articleService.getArticlesByCategory(categorySlug) : []),
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
    url: `${SITE_URL}/category/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BlogAI',
      url: `${SITE_URL}/`,
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
        title={buildCategoryTitle(category, categoryArticles.length)}
        description={category.description}
        canonicalPath={`/category/${category.slug}`}
        jsonLd={[categorySchema, buildBreadcrumbSchema(breadcrumbItems, `/category/${category.slug}`)]}
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
            {categoryArticles.length > 0 && (
              <span>
                <strong>{categoryArticles.length}</strong>{' '}
                {categoryArticles.length === 1 ? 'original article' : 'original articles'}
              </span>
            )}
            <span>
              <strong>{category.count}</strong> curated {category.count === 1 ? 'blog' : 'blogs'}
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

        {categoryArticles.length > 0 && (
          <section className="category-articles" aria-labelledby="category-articles-heading">
            <h2 id="category-articles-heading" className="category-section-title">
              Articles in {category.name}
            </h2>
            <div className="article-grid">
              {categoryArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        <h2 className="category-section-title">{category.name} blogs in the directory</h2>

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
