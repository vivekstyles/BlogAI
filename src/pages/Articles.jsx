import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Compass } from 'lucide-react';
import { articleService } from '../services/articleService';
import { blogService } from '../services/blogService';
import SEOHead from '../components/seo/SEOHead';
import { SITE_URL, buildAuthorSchema, buildBreadcrumbSchema } from '../utils/seo';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchBar from '../components/search/SearchBar';
import CategoryNav from '../components/categories/CategoryNav';
import ArticleCard from '../components/articles/ArticleCard';
import EmptyState from '../components/search/EmptyState';
import './Articles.css';


export function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';

  const allArticles = useMemo(() => articleService.getAllArticles(), []);

  // Only offer categories that actually have articles, with article counts
  const articleCategories = useMemo(
    () =>
      blogService
        .getCategories()
        .map((c) => ({ ...c, count: articleService.getArticlesByCategory(c.slug).length }))
        .filter((c) => c.count > 0),
    []
  );

  const results = useMemo(
    () => articleService.searchArticles({ query, categorySlug }),
    [query, categorySlug]
  );

  const updateParams = (nextQuery, nextCategory) => {
    const params = new URLSearchParams();
    if (nextQuery) params.set('q', nextQuery);
    if (nextCategory) params.set('category', nextCategory);
    setSearchParams(params, { replace: true });
  };

  const hasFilters = Boolean(query || categorySlug);

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BlogAI Articles',
    description: 'Original articles published by BlogAI.',
    url: `${SITE_URL}/articles`,
    blogPost: allArticles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${SITE_URL}/articles/${a.slug}`,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      author: buildAuthorSchema(a.author, a.authorType),
    })),
  };

  return (
    <div className="articles-page">
      <SEOHead
        title="Articles"
        description="Original articles from BlogAI on reading, following, and learning from technical and scientific writing."
        canonicalPath="/articles"
        jsonLd={[listSchema, buildBreadcrumbSchema([{ label: 'Articles' }], '/articles')]}
      />

      <div className="container">
        <Breadcrumbs items={[{ label: 'Articles' }]} />

        <header className="articles-header">
          <div className="articles-header-badge">
            <FileText size={15} aria-hidden="true" />
            <span>Published on BlogAI</span>
          </div>
          <h1 className="articles-title">Articles</h1>
          <p className="articles-desc">
            Original writing published here on BlogAI. Looking for external blogs instead? Browse
            the <Link to="/directory">community blog directory</Link>.
          </p>
        </header>

        {allArticles.length > 0 && (
          <div className="articles-controls">
            <SearchBar
              id="article-search-input"
              aria-label="Search articles"
              placeholder="Search articles by title, topic, or tag..."
              value={query}
              onChange={(e) => updateParams(e.target.value, categorySlug)}
              onClear={() => updateParams('', categorySlug)}
            />
            {articleCategories.length > 1 && (
              <CategoryNav
                categories={articleCategories}
                activeCategorySlug={categorySlug}
                totalCount={allArticles.length}
                onSelectCategory={(slug) => updateParams(query, slug)}
              />
            )}
            <p className="articles-count" role="status" aria-live="polite">
              Showing <strong>{results.length}</strong> of {allArticles.length}{' '}
              {allArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="article-grid">
            {results.map((a) => (
              <ArticleCard key={a.slug} article={a} headingLevel={2} />
            ))}
          </div>
        ) : hasFilters ? (
          <EmptyState
            title="No articles found"
            message="No articles match your search. Try different keywords or another category."
            onReset={() => updateParams('', '')}
            showSubmitCta={false}
          />
        ) : (
          <div className="articles-empty">
            <p>No articles have been published yet.</p>
            <Link to="/directory" className="btn btn-secondary">
              <Compass size={18} aria-hidden="true" />
              <span>Browse the blog directory</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Articles;
