import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import BlogMetadata from './BlogMetadata';
import FeedLink from './FeedLink';
import TagChip from '../tags/TagChip';
import './BlogCard.css';

/**
 * Card for an external blog in the community directory. The title opens the
 * original website; "Details" opens the blog's directory page. Visually distinct
 * from first-party ArticleCards (neutral frame, "External blog" label).
 */
export function BlogCard({
  blog,
  onTagClick = null,
  showCategory = true,
  className = '',
}) {
  if (!blog) return null;

  return (
    <article className={`blog-card ${className}`}>
      <span className="blog-kind-label">
        <ExternalLink size={12} aria-hidden="true" />
        <span>External blog</span>
      </span>
      <div className="blog-card-top">
        <BlogMetadata
          category={blog.category}
          categorySlug={blog.categorySlug}
          address={blog.address}
          author={blog.author}
          language={blog.language}
          status={blog.status}
          showCategory={showCategory}
        />
        {blog.feed && <FeedLink feedUrl={blog.feed} title={blog.title} />}
      </div>

      <div className="blog-card-main">
        <h3 className="blog-card-title">
          <a
            href={blog.address}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-internal-link blog-external-title"
          >
            <span>{blog.title}</span>
            <span className="sr-only"> (external website, opens in a new tab)</span>
          </a>
        </h3>

        {blog.description ? (
          <p className="blog-card-description">{blog.description}</p>
        ) : (
          <p className="blog-card-description placeholder">
            Curated independent blog featured in the {blog.category} directory.
          </p>
        )}
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <div className="blog-card-tags" aria-label={`Tags for ${blog.title}`}>
          {blog.tags.slice(0, 5).map((t) => (
            <TagChip
              key={t}
              tag={t}
              onClick={onTagClick}
              asLink={!onTagClick}
            />
          ))}
        </div>
      )}

      <div className="blog-card-footer">
        <Link
          to={`/blog/${blog.slug}`}
          className="card-details-link"
          aria-label={`Directory details for ${blog.title}`}
        >
          <span>Details</span>
          <ArrowRight size={14} />
        </Link>

        <a
          href={blog.address}
          target="_blank"
          rel="noopener noreferrer"
          className="card-visit-link"
          aria-label={`Visit ${blog.title} external website (opens in a new tab)`}
        >
          <span>Visit Website</span>
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default BlogCard;
