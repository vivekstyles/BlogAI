import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Compass, Sparkles, PlusCircle, Rss, ArrowRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import { useSearch } from '../hooks/useSearch';
import SEOHead from '../components/seo/SEOHead';
import SearchFilters from '../components/search/SearchFilters';
import CategoryNav from '../components/categories/CategoryNav';
import CategoryCard from '../components/categories/CategoryCard';
import TagChip from '../components/tags/TagChip';
import BlogList from '../components/blogs/BlogList';
import BlogCard from '../components/blogs/BlogCard';
import './Home.css';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const allBlogs = useMemo(() => blogService.getAllBlogs(), []);
  const categories = useMemo(() => blogService.getCategories(), []);
  const popularTags = useMemo(() => blogService.getPopularTags(10), []);
  const featuredBlogs = useMemo(() => blogService.getFeaturedBlogs(3), []);

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const sortParam = searchParams.get('sort') || 'title-asc';

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
    initialQuery: queryParam,
    initialCategory: categoryParam,
    initialTag: tagParam,
    initialSort: sortParam,
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

  // Structured Data Schema for Home Page
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlogAI Directory',
    url: 'https://blogai.directory',
    description:
      'Curated community directory of high-quality blogs in engineering, mathematics, physics, science, and automotive technology.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://blogai.directory/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="home-page">
      <SEOHead
        title="Curated Community Blog Directory"
        description="Discover, search, filter, and subscribe to over 40+ high-quality independent blogs across software engineering, mathematics, physics, science, and automotive technology."
        canonicalPath="/"
        jsonLd={homeSchema}
      />

      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-sparkle" />
            <span>Community-Curated &amp; Open Knowledge</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Discover Great Technical &amp; Scientific Blogs
          </h1>

          <p className="hero-subtitle">
            An independent, high-signal directory of blogs across software engineering,
            pure mathematics, physics, science, and automotive technology.
          </p>

          <div className="hero-actions">
            <a href="#directory" className="btn btn-primary">
              <Compass size={18} />
              <span>Explore Directory</span>
            </a>
            <a href="/feed.opml" download="blogai-feeds.opml" className="btn btn-secondary">
              <Rss size={18} />
              <span>Download OPML</span>
            </a>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="categories-section" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 id="categories-heading" className="section-title">
                Browse by Category
              </h2>
              <p className="section-subtitle">
                Explore hand-curated blogs grouped by scientific and technical domain.
              </p>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlights (only shown when no active filters) */}
      {!hasActiveFilters && featuredBlogs.length > 0 && (
        <section className="featured-section" aria-labelledby="featured-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 id="featured-heading" className="section-title">
                  Featured Publications
                </h2>
                <p className="section-subtitle">
                  High-signal writers and seminal engineering publications.
                </p>
              </div>
            </div>

            <div className="featured-grid">
              {featuredBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} onTagClick={handleTagChange} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Directory Section */}
      <section id="directory" className="directory-section" aria-labelledby="directory-heading">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 id="directory-heading" className="section-title">
                All Publications
              </h2>
              <p className="section-subtitle">
                Search, filter by topic, or browse through the entire verified collection.
              </p>
            </div>
          </div>

          {/* Category Horizontal Navigation */}
          <CategoryNav
            categories={categories}
            activeCategorySlug={category ? categories.find((c) => c.name.toLowerCase() === category.toLowerCase())?.slug : ''}
            totalCount={allBlogs.length}
            onSelectCategory={(catSlug) => {
              const matched = categories.find((c) => c.slug === catSlug);
              handleCategoryChange(matched ? matched.name : '');
            }}
          />

          {/* Popular Tag Filters */}
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

          {/* Search, Sort, and Active Badges */}
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

          {/* Blog List with Pagination */}
          <BlogList
            blogs={results}
            onTagClick={handleTagChange}
            onResetFilters={handleClearAll}
            resetDeps={[query, category, tag, sortBy]}
          />
        </div>
      </section>

      {/* Community Contribution CTA */}
      <section className="submission-cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2 id="cta-heading" className="cta-title">
                Know a blog that belongs here?
              </h2>
              <p className="cta-desc">
                Help grow this community resource. Suggest your favorite independent technical or
                scientific publications for review and inclusion.
              </p>
            </div>
            <div className="cta-action">
              <Link to="/submit" className="btn btn-primary cta-btn">
                <PlusCircle size={18} />
                <span>Submit a Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
