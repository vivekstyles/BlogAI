import React, { useState } from 'react';
import { Rss, Check, Copy } from 'lucide-react';
import './FeedLink.css';

/**
 * FeedLink component for subscribing to or copying RSS/Atom feed URLs.
 */
export function FeedLink({ feedUrl, title = '', size = 'normal' }) {
  const [copied, setCopied] = useState(false);

  if (!feedUrl) return null;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className={`feed-link-wrapper ${size}`}>
      <a
        href={feedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="feed-direct-link"
        aria-label={`Open RSS feed for ${title || 'blog'}`}
        title={`RSS Feed: ${feedUrl}`}
      >
        <Rss size={14} className="feed-icon" />
        <span>RSS</span>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="feed-copy-btn"
        aria-label={`Copy RSS feed URL for ${title || 'blog'}`}
        title="Copy feed URL to clipboard"
      >
        {copied ? <Check size={13} className="copy-check" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export default FeedLink;
