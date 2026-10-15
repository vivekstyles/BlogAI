import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag as TagIcon, AlertCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchFilters from '../components/search/SearchFilters';
import BlogList from '../components/blogs/BlogList';
import './TagPage.css';

export function TagPage() {
  const { tagSlug } = useParams();

  const tagObj = useMemo(
    () => blogService.getTagBySlug(tagSlug),
    [tagSlug]
  );

  const matchingBlogs = useMemo(
    () => (tagObj ? blogService.getBlogsByTag(tagSlug) : []),
    [tagObj, tagSlug]
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
          <p>We could not find any blogs associated with &ldquo;#{tagSlug}&rdquo;.</p>
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
    name: `Blogs Tagged with #${tagObj.name}`,
    description: `Curated collection of technical and scientific blogs tagged with #${tagObj.name}.`,
    url: `https://blogai.directory/tag/${tagObj.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BlogAI Directory',
      url: 'https://blogai.directory',
    },
    numberOfItems: matchingBlogs.length,
  };

  const breadcrumbs = [
    { label: 'Tags' },
    { label: `#${tagObj.name}` },
  ];

  return (
    <div className="tag-page">
      <SEOHead
        title={`#${tagObj.name} Blogs - Topic Directory`}
        description={`Explore ${matchingBlogs.length} curated independent blogs tagged with #${tagObj.name} in the BlogAI directory.`}
        canonicalPath={`/tag/${tagObj.slug}`}
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
          <p className="tag-desc">
            Explore {matchingBlogs.length} high-signal publication{matchingBlogs.length === 1 ? '' : 's'}{' '}
            discussing #{tagObj.name}.
          </p>
        </header>

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
      </div>
    </div>
  );
}

export default TagPage;
