import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Compass, Rss, PlusCircle } from 'lucide-react';
import { blogService } from '../services/blogService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import { SITE_URL } from '../utils/seo';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import SearchFilters from '../components/search/SearchFilters';
import CategoryNav from '../components/categories/CategoryNav';
import TagChip from '../components/tags/TagChip';
import BlogList from '../components/blogs/BlogList';
import './Home.css';
import './Directory.css';


export function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();

  const allBlogs = useMemo(() => blogService.getAllBlogs(), []);
  const categories = useMemo(() => blogService.getCategories(), []);
  const popularTags = useMemo(() => blogService.getPopularTags(10), []);

  const {
    query,
    setQuery,
    category,
    setCategory,
    tag,
    setTag,
    sortBy,
    setSortBy,
    results,
    totalCount,
    clearFilters,
    hasActiveFilters,
  } = useSearch({
    initialBlogs: allBlogs,
    initialQuery: searchParams.get('q') || '',
    initialCategory: searchParams.get('category') || '',
    initialTag: searchParams.get('tag') || '',
    initialSort: searchParams.get('sort') || 'title-asc',
  });

  // Keep URL search params synchronized when filters change
  const updateParams = (newQuery, newCategory, newTag, newSort) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCategory) params.set('category', newCategory);
    if (newTag) params.set('tag', newTag);
    if (newSort && newSort !== 'title-asc') params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    updateParams(q, category, tag, sortBy);
  };

  const handleCategoryChange = (c) => {
    setCategory(c);
    updateParams(query, c, tag, sortBy);
  };

  const handleTagChange = (t) => {
    const nextTag = tag === t ? '' : t;
    setTag(nextTag);
    updateParams(query, category, nextTag, sortBy);
  };

  const handleSortChange = (s) => {
    setSortBy(s);
    updateParams(query, category, tag, s);
  };

  const handleClearAll = () => {
    clearFilters();
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Community Blog Directory',
    description:
      'Community-curated directory of independent blogs in AI, engineering, mathematics, physics, science, automotive technology, and nutrition.',
    url: `${SITE_URL}/directory`,
    numberOfItems: allBlogs.length,
    isPartOf: { '@type': 'WebSite', name: 'BlogAI', url: SITE_URL },
  };

  return (
    <div className="directory-page">
      <SEOHead
        title="Community Blog Directory"
        description={`Search and filter ${allBlogs.length} community-curated independent blogs across AI, engineering, mathematics, physics, science, automotive technology, and nutrition.`}
        canonicalPath="/directory"
        jsonLd={directorySchema}
      />

      <div className="container">
        <Breadcrumbs items={[{ label: 'Blog Directory' }]} />

        <header className="directory-header">
          <div className="directory-header-badge">
            <Compass size={15} aria-hidden="true" />
            <span>External blogs</span>
          </div>
          <h1 className="directory-title">Community Blog Directory</h1>
          <p className="directory-desc">
            Independent blogs curated by the community. Every listing links to the original
            website. For writing published here, see our <Link to="/articles">articles</Link>.
          </p>
          <div className="directory-actions">
            <a href="/feed.opml" download="blogai-feeds.opml" className="btn btn-secondary btn-sm">
              <Rss size={16} aria-hidden="true" />
              <span>Download OPML</span>
            </a>
            <Link to="/submit" className="btn btn-secondary btn-sm">
              <PlusCircle size={16} aria-hidden="true" />
              <span>Submit a Blog</span>
            </Link>
          </div>
        </header>

        <section id="directory" aria-labelledby="directory-heading">
          <h2 id="directory-heading" className="sr-only">
            All publications
          </h2>

          <CategoryNav
            categories={categories}
            activeCategorySlug={
              category
                ? categories.find((c) => c.name.toLowerCase() === category.toLowerCase())?.slug
                : ''
            }
            totalCount={allBlogs.length}
            onSelectCategory={(catSlug) => {
              const matched = categories.find((c) => c.slug === catSlug);
              handleCategoryChange(matched ? matched.name : '');
            }}
          />

          <div className="popular-tags-bar" aria-label="Popular tag filters">
            <span className="tags-bar-label">Popular Topics:</span>
            <div className="tags-bar-list">
              {popularTags.map((pt) => (
                <TagChip
                  key={pt.slug}
                  tag={pt.name}
                  count={pt.count}
                  isActive={tag.toLowerCase() === pt.name.toLowerCase()}
                  onClick={handleTagChange}
                />
              ))}
            </div>
          </div>

          <SearchFilters
            query={query}
            onQueryChange={handleQueryChange}
            category={category}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            tag={tag}
            onTagChange={handleTagChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalResults={totalCount}
            totalBlogs={allBlogs.length}
            onClearAll={handleClearAll}
            hasActiveFilters={hasActiveFilters}
          />

          <BlogList
            blogs={results}
            onTagClick={handleTagChange}
            onResetFilters={handleClearAll}
            resetDeps={[query, category, tag, sortBy]}
          />
        </section>
      </div>
    </div>
  );
}

export default Directory;
