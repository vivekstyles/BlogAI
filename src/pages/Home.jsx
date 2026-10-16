import React, { useMemo } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Compass, Sparkles, PlusCircle, FileText, ArrowRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import { articleService } from '../services/articleService';
import SEOHead from '../components/seo/SEOHead';
import CategoryCard from '../components/categories/CategoryCard';
import BlogCard from '../components/blogs/BlogCard';
import ArticleCard from '../components/articles/ArticleCard';
import './Home.css';

const DIRECTORY_PARAMS = ['q', 'category', 'tag', 'sort'];

export function Home() {
  const [searchParams] = useSearchParams();

  const categories = useMemo(() => blogService.getCategories(), []);
  const featuredBlogs = useMemo(() => blogService.getFeaturedBlogs(3), []);
  const latestArticles = useMemo(() => articleService.getLatestArticles(3), []);
  const totalBlogs = blogService.getAllBlogs().length;

  // The searchable directory moved to /directory; keep old /?q=... links working
  if (DIRECTORY_PARAMS.some((p) => searchParams.has(p))) {
    return <Navigate to={`/directory?${searchParams.toString()}`} replace />;
  }

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlogAI',
    url: 'https://blogai.directory',
    description:
      'Original articles and a community-curated directory of high-quality blogs in engineering, mathematics, physics, science, and automotive technology.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://blogai.directory/directory?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="home-page">
      <SEOHead
        title="Technical Articles & Curated Blog Directory"
        description={`Read original articles and discover ${totalBlogs}+ community-curated independent blogs across software engineering, mathematics, physics, science, and automotive technology.`}
        canonicalPath="/"
        jsonLd={homeSchema}
      />

      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-sparkle" />
            <span>Original Writing &amp; Community-Curated Blogs</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Discover Great Technical &amp; Scientific Blogs
          </h1>

          <p className="hero-subtitle">
            Read original articles published here, and explore a community-curated directory of
            independent blogs across software engineering, mathematics, physics, science, and
            automotive technology.
          </p>

          <div className="hero-actions">
            <Link to="/articles" className="btn btn-primary">
              <FileText size={18} aria-hidden="true" />
              <span>Read Articles</span>
            </Link>
            <Link to="/directory" className="btn btn-secondary">
              <Compass size={18} aria-hidden="true" />
              <span>Browse Blog Directory</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest first-party articles */}
      {latestArticles.length > 0 && (
        <section className="home-articles-section" aria-labelledby="latest-articles-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 id="latest-articles-heading" className="section-title">
                  Latest Articles
                </h2>
                <p className="section-subtitle">Original writing, published on BlogAI.</p>
              </div>
              <Link to="/articles" className="section-more-link">
                <span>All articles</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="article-grid three-up">
              {latestArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Showcase */}
      <section className="categories-section" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 id="categories-heading" className="section-title">
                Browse by Category
              </h2>
              <p className="section-subtitle">
                Articles and hand-curated blogs grouped by scientific and technical domain.
              </p>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                category={cat}
                articleCount={articleService.getArticlesByCategory(cat.slug).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured directory blogs */}
      {featuredBlogs.length > 0 && (
        <section className="featured-section" aria-labelledby="featured-heading">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 id="featured-heading" className="section-title">
                  From the Blog Directory
                </h2>
                <p className="section-subtitle">
                  External blogs from high-signal writers and engineering teams.
                </p>
              </div>
              <Link to="/directory" className="section-more-link">
                <span>Full directory</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="featured-grid">
              {featuredBlogs.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}

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
                scientific publications for review and inclusion in the directory.
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
