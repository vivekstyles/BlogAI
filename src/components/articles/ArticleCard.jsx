import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import ArticleMeta from './ArticleMeta';
import TagChip from '../tags/TagChip';
import './ArticleCard.css';

/**
 * Card for a first-party article. Visually distinct from directory BlogCards:
 * accent rail, "Original article" label, dates, and an internal "Read article" link.
 */
export function ArticleCard({ article, headingLevel = 3, showTags = true, className = '' }) {
  if (!article) return null;
  const Heading = `h${headingLevel}`;
  const primaryCategory = article.categories[0];

  return (
    <article className={`article-card ${className}`}>
      <div className="article-card-top">
        <span className="article-kind-label">
          <FileText size={13} aria-hidden="true" />
          <span>Original article</span>
        </span>
        {primaryCategory && (
          <Link to={`/category/${primaryCategory.slug}`} className="article-card-category">
            {primaryCategory.name}
          </Link>
        )}
      </div>

      <Heading className="article-card-title">
        <Link to={`/articles/${article.slug}`} className="article-card-link">
          {article.title}
        </Link>
      </Heading>

      <p className="article-card-description">{article.description}</p>

      {showTags && article.tags.length > 0 && (
        <div className="article-card-tags" aria-label={`Tags for ${article.title}`}>
          {article.tags.slice(0, 4).map((t) => (
            <TagChip key={t.slug} tag={t.name} asLink />
          ))}
        </div>
      )}

      <div className="article-card-footer">
        <ArticleMeta article={article} showAuthor={false} showUpdated={false} />
        <Link
          to={`/articles/${article.slug}`}
          className="article-card-read"
          aria-label={`Read article: ${article.title}`}
        >
          <span>Read article</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default ArticleCard;
