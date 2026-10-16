import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag as TagIcon, AlertCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { articleService } from '../services/articleService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import { SITE_URL, buildTagMeta } from '../utils/seo';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchFilters from '../components/search/SearchFilters';
import BlogList from '../components/blogs/BlogList';
import ArticleCard from '../components/articles/ArticleCard';
import './TagPage.css';

export function TagPage() {
  const { tagSlug } = useParams();

  const directoryTag = useMemo(() => blogService.getTagBySlug(tagSlug), [tagSlug]);
  const matchingArticles = useMemo(() => articleService.getArticlesByTag(tagSlug || ''), [tagSlug]);

  // A tag page exists when either directory blogs or articles use the tag
  const tagObj =
    directoryTag ||
    matchingArticles[0]?.tags.find((t) => t.slug === (tagSlug || '').toLowerCase()) ||
    null;

  const matchingBlogs = useMemo(
    () => (directoryTag ? blogService.getBlogsByTag(tagSlug) : []),
    [directoryTag, tagSlug]
  );

  const {
    query,
    setQuery,
    sortBy,
    setSortBy,
    results,
    totalCount,
    clearFilters,
    hasActiveFilters,
  } = useSearch({
    initialBlogs: matchingBlogs,
    initialSort: 'title-asc',
  });

  if (!tagObj) {
    return (
      <div className="container tag-not-found">
        <SEOHead
          title="Tag Not Found"
          description="The requested tag does not exist in the BlogAI Directory."
          robots="noindex, follow"
        />
        <div className="empty-tag-card">
          <AlertCircle size={40} className="not-found-icon" />
          <h2>Tag Not Found</h2>
          <p>We could not find any articles or blogs associated with &ldquo;#{tagSlug}&rdquo;.</p>
          <Link to="/" className="btn btn-primary">
            Back to Directory Home
          </Link>
        </div>
      </div>
    );
  }

  const tagSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Articles and Blogs Tagged with #${tagObj.name}`,
    description: `Articles and curated technical and scientific blogs tagged with #${tagObj.name}.`,
    url: `${SITE_URL}/tag/${tagObj.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BlogAI Directory',
      url: SITE_URL,
    },
    numberOfItems: matchingBlogs.length + matchingArticles.length,
  };

  const tagMeta = buildTagMeta(tagObj, matchingArticles.length, matchingBlogs.length);
  const tagSummary = tagMeta.summary;

  const breadcrumbs = [
    { label: 'Tags' },
    { label: `#${tagObj.name}` },
  ];

  return (
    <div className="tag-page">
      <SEOHead
        title={tagMeta.title}
        description={tagMeta.description}
        canonicalPath={`/tag/${tagObj.slug}`}
        robots={tagMeta.robots}
        jsonLd={tagSchema}
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <header className="tag-header">
          <div className="tag-header-badge">
            <TagIcon size={16} />
            <span>Topic Tag</span>
          </div>

          <h1 className="tag-title">#{tagObj.name}</h1>
          <p className="tag-desc">{tagSummary}</p>
        </header>

        {matchingArticles.length > 0 && (
          <section className="tag-articles" aria-labelledby="tag-articles-heading">
            <h2 id="tag-articles-heading" className="tag-section-title">
              Articles
            </h2>
            <div className="article-grid">
              {matchingArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {matchingBlogs.length > 0 && (
          <>
            <h2 className="tag-section-title">Blogs in the directory</h2>

            <SearchFilters
              query={query}
              onQueryChange={setQuery}
              category=""
              onCategoryChange={() => {}}
              tag=""
              onTagChange={() => {}}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResults={totalCount}
              totalBlogs={matchingBlogs.length}
              onClearAll={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <BlogList
              blogs={results}
              onResetFilters={clearFilters}
              resetDeps={[query, sortBy, tagSlug]}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TagPage;
