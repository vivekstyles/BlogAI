import React from 'react';
import { ListTree } from 'lucide-react';
import './TableOfContents.css';

/**
 * In-page navigation built from the article's ## and ### headings.
 */
export function TableOfContents({ items = [], idPrefix = 'toc', className = '' }) {
  if (!items.length) return null;
  const titleId = `${idPrefix}-title`;

  return (
    <nav className={`article-toc ${className}`} aria-labelledby={titleId}>
      <p id={titleId} className="article-toc-title">
        <ListTree size={15} aria-hidden="true" />
        <span>On this page</span>
      </p>
      <ol className="article-toc-list">
        {items.map((item) => (
          <li key={item.id} className={`article-toc-item level-${item.level}`}>
            <a href={`#${item.id}`} className="article-toc-link">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;
