import React, { useEffect } from 'react';
import JsonLd from './JsonLd';
import { SITE_URL, formatPageTitle } from '../../utils/seo';

const DEFAULT_DESC =
  'Discover, search, filter, and subscribe to high-quality blogs across engineering, math, physics, science, and automotive technology.';

export function SEOHead({
  title,
  description = DEFAULT_DESC,
  canonicalPath = '',
  type = 'website',
  robots = 'index, follow',
  jsonLd = null,
  canonicalUrl: canonicalUrlOverride = '',
  image = '',
  article = null,
}) {
  const fullTitle = formatPageTitle(title);
  const canonicalUrl =
    canonicalUrlOverride ||
    `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const imageUrl = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : '';
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

    // Twitter: the large card needs an image to show anything useful
    setMeta('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    const removeMeta = (selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    };

    // Featured image
    if (imageUrl) {
      setMeta('og:image', imageUrl, true);
      setMeta('twitter:image', imageUrl);
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
  }, [fullTitle, description, canonicalUrl, type, robots, imageUrl, articleKey]);

  if (!jsonLd) return null;
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return schemas.map((schema, i) => <JsonLd key={i} schema={schema} />);
}

export default SEOHead;
