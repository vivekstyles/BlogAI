import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, User, Languages, CheckCircle2 } from 'lucide-react';
import { extractDomain } from '../../utils/normalizeText';
import './BlogMetadata.css';

export function BlogMetadata({
  category,
  categorySlug,
  address,
  author,
  language,
  status,
  showCategory = true,
}) {
  const domain = extractDomain(address);

  return (
    <div className="blog-metadata-row">
      {showCategory && category && (
        <Link
          to={`/category/${categorySlug}`}
          className="meta-category-badge"
          aria-label={`Category: ${category}`}
        >
          {category}
        </Link>
      )}

      {domain && (
        <span className="meta-item meta-domain" title={address}>
          <Globe size={13} aria-hidden="true" />
          <span>{domain}</span>
        </span>
      )}

      {author && (
        <span className="meta-item meta-author">
          <User size={13} aria-hidden="true" />
          <span>{author}</span>
        </span>
      )}

      {language && language !== 'en' && (
        <span className="meta-item meta-lang" title={`Language: ${language}`}>
          <Languages size={13} aria-hidden="true" />
          <span>{language.toUpperCase()}</span>
        </span>
      )}

      {status === 'active' && (
        <span className="meta-item meta-status" title="Active & Verified feed">
          <CheckCircle2 size={13} className="status-icon" aria-hidden="true" />
          <span>Active</span>
        </span>
      )}
    </div>
  );
}

export default BlogMetadata;
