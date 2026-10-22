import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Globe,
  Rss,
  User,
  Languages,
  CheckCircle2,
  Share2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { blogService } from '../services/blogService';
import { extractDomain } from '../utils/normalizeText';
import SEOHead from '../components/seo/SEOHead';
import { SITE_URL, buildBlogMeta, buildBreadcrumbSchema } from '../utils/seo';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import TagChip from '../components/tags/TagChip';
import FeedLink from '../components/blogs/FeedLink';
import BlogCard from '../components/blogs/BlogCard';
import './BlogDetails.css';

export function BlogDetails() {
  const { blogSlug } = useParams();

  const blog = useMemo(
    () => blogService.getBlogBySlug(blogSlug),
    [blogSlug]
  );

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return blogService
      .getBlogsByCategory(blog.categorySlug)
      .filter((b) => b.slug !== blog.slug)
      .slice(0, 3);
  }, [blog]);

  if (!blog) {
    return (
      <div className="container blog-not-found">
        <SEOHead
          title="Blog Not Found"
          description="The requested publication does not exist in the BlogAI Directory."
          robots="noindex, follow"
        />
        <div className="empty-blog-card">
          <AlertCircle size={40} className="not-found-icon" />
          <h2>Publication Not Found</h2>
          <p>We could not find a blog matching &ldquo;{blogSlug}&rdquo;.</p>
          <Link to="/" className="btn btn-primary">
            Back to Directory Home
          </Link>
        </div>
      </div>
    );
  }

  const domain = extractDomain(blog.address);

  // Schema.org Blog / WebSite representation
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blog.title,
    url: blog.address,
    description: blog.description || `Curated ${blog.category} blog.`,
    inLanguage: blog.language || 'en',
    author: blog.author
      ? {
          '@type': 'Person',
          name: blog.author,
        }
      : undefined,
    isPartOf: {
      '@type': 'CollectionPage',
      name: `${blog.category} Blogs`,
      url: `${SITE_URL}/category/${blog.categorySlug}`,
    },
  };

  const breadcrumbs = [
    { label: blog.category, path: `/category/${blog.categorySlug}` },
    { label: blog.title },
  ];

  return (
    <div className="blog-details-page">
      <SEOHead
        title={buildBlogMeta(blog).title}
        description={buildBlogMeta(blog).description}
        robots={buildBlogMeta(blog).robots}
        canonicalPath={`/blog/${blog.slug}`}
        jsonLd={[blogSchema, buildBreadcrumbSchema(breadcrumbs, `/blog/${blog.slug}`)]}
      />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <article className="blog-details-main">
          {/* Header Row */}
          <div className="blog-details-header">
            <div className="blog-category-badge-wrap">
              <Link
                to={`/category/${blog.categorySlug}`}
                className="badge badge-brand"
              >
                {blog.category}
              </Link>
              {blog.status === 'active' && (
                <span className="badge badge-success">
                  <CheckCircle2 size={12} />
                  <span>Verified Feed</span>
                </span>
              )}
            </div>

            <h1 className="blog-details-title">{blog.title}</h1>

            <div className="blog-details-meta-grid">
              <div className="meta-block">
                <span className="meta-label">Website Domain:</span>
                <span className="meta-val font-mono">{domain}</span>
              </div>

              {blog.author && (
                <div className="meta-block">
                  <span className="meta-label">Author / Organization:</span>
                  <span className="meta-val">{blog.author}</span>
                </div>
              )}

              <div className="meta-block">
                <span className="meta-label">Language:</span>
                <span className="meta-val">
                  {blog.language ? blog.language.toUpperCase() : 'EN'}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="blog-details-body">
            <h2 className="body-heading">About Publication</h2>
            {blog.description ? (
              <p className="body-text">{blog.description}</p>
            ) : (
              <p className="body-text placeholder">
                This publication is an active member of our curated {blog.category} directory.
                Visit the official website below to explore their latest articles and archives.
              </p>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-details-tags">
                <h3 className="tags-heading">Topics &amp; Tags:</h3>
                <div className="tags-flex">
                  {blog.tags.map((t) => (
                    <TagChip key={t} tag={t} asLink />
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="blog-details-actions">
              <a
                href={blog.address}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                aria-label={`Visit ${blog.title} official website (opens in a new tab)`}
              >
                <Globe size={18} />
                <span>Visit Official Website</span>
                <ExternalLink size={15} />
              </a>

              {blog.feed && (
                <FeedLink feedUrl={blog.feed} title={blog.title} size="large" />
              )}
            </div>
          </div>
        </article>

        {/* Related Publications */}
        {relatedBlogs.length > 0 && (
          <section className="related-blogs-section" aria-labelledby="related-heading">
            <h2 id="related-heading" className="related-heading">
              More {blog.category} Publications
            </h2>
            <div className="related-grid">
              {relatedBlogs.map((rb) => (
                <BlogCard key={rb.id} blog={rb} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
