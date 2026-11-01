import React, { useEffect } from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, formatPageTitle, INDEXABLE_ROBOTS, DEFAULT_OG_IMAGE } from '../../utils/seo';

const DEFAULT_DESC =
  'Discover, search, and subscribe to quality blogs on AI, programming, engineering, math, physics, science, automotive tech, nutrition, and personal finance.';

export function SEOHead({
  title,
  description = DEFAULT_DESC,
  canonicalPath = '',
  type = 'website',
  robots = INDEXABLE_ROBOTS,
  jsonLd = null,
  canonicalUrl: canonicalUrlOverride = '',
  image = '',
  article = null,
}) {
  const fullTitle = formatPageTitle(title);
  const canonicalUrl =
    canonicalUrlOverride ||
    `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const resolvedImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_OG_IMAGE;
  const articleKey = article ? JSON.stringify(article) : '';

  useEffect(() => {
    // Only runs in browser environment
    if (typeof document === 'undefined') return;

    document.title = fullTitle;

    const setMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('robots', robots);

    // OpenGraph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    const removeMeta = (selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    };

    // Social image
    if (resolvedImage) {
      setMeta('og:image', resolvedImage, true);
      setMeta('twitter:image', resolvedImage);
    } else {
      removeMeta('meta[property="og:image"], meta[name="twitter:image"]');
    }

    // Article metadata (removed again when navigating to non-article pages)
    removeMeta('meta[property^="article:"]');
    if (article) {
      const addProperty = (name, content) => {
        if (!content) return;
        const el = document.createElement('meta');
        el.setAttribute('property', name);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      };
      addProperty('article:published_time', article.publishedTime);
      addProperty('article:modified_time', article.modifiedTime);
      addProperty('article:author', article.author);
      addProperty('article:section', article.section);
      (article.tags || []).forEach((t) => addProperty('article:tag', t));
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [fullTitle, description, canonicalUrl, type, robots, resolvedImage, articleKey]);

  if (!jsonLd) return null;
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return schemas.map((schema, i) => <JsonLd key={i} schema={schema} />);
}

export default SEOHead;
