import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticleContent.css';

/**
 * Renders the article body HTML compiled at build time by scripts/build_articles.js.
 * The HTML comes only from the owner's Markdown files in content/articles/ (trusted
 * content), never from user input. Internal links are routed client-side.
 */
export function ArticleContent({ html, className = '' }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const anchor = e.target.closest('a');
    if (!anchor || anchor.target === '_blank') return;
    const href = anchor.getAttribute('href') || '';
    // Hash links scroll natively; files such as /feed.opml must load normally
    if (!href.startsWith('/') || href.startsWith('//') || /\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0])) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <div
      className={`article-content ${className}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default ArticleContent;
