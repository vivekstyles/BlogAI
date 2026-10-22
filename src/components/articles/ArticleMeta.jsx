import React from 'react';
import { User, CalendarDays, Clock, RefreshCw } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import './ArticleMeta.css';

/**
 * Author, publication/update dates, and reading time for a first-party article.
 * labelDates shows the "Published" label (article pages); cards keep it for screen readers only.
 */
export function ArticleMeta({ article, showAuthor = true, showUpdated = true, labelDates = false, className = '' }) {
  if (!article) return null;
  const wasUpdated = showUpdated && article.updatedAt && article.updatedAt !== article.publishedAt;

  return (
    <div className={`article-meta ${className}`}>
      {showAuthor && article.author && (
        <span className="article-meta-item">
          <User size={14} aria-hidden="true" />
          <span>{article.author}</span>
        </span>
      )}
      <span className="article-meta-item">
        <CalendarDays size={14} aria-hidden="true" />
        <span className={labelDates ? undefined : 'sr-only'}>Published </span>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </span>
      {wasUpdated && (
        <span className="article-meta-item">
          <RefreshCw size={14} aria-hidden="true" />
          <span>
            Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
          </span>
        </span>
      )}
      <span className="article-meta-item">
        <Clock size={14} aria-hidden="true" />
        <span>{article.readingTimeMinutes} min read</span>
      </span>
    </div>
  );
}

export default ArticleMeta;
