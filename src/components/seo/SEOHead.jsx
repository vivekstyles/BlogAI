import React, { useEffect } from 'react';
import JsonLd from './JsonLd';

const SITE_URL = 'https://blogai.directory';
const DEFAULT_TITLE = 'BlogAI - Curated Community Blog Directory';
const DEFAULT_DESC =
  'Discover, search, filter, and subscribe to high-quality blogs across engineering, math, physics, science, and automotive technology.';

export function SEOHead({
  title,
  description = DEFAULT_DESC,
  canonicalPath = '',
  type = 'website',
  robots = 'index, follow',
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | BlogAI Directory` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

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

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
  }, [fullTitle, description, canonicalUrl, type, robots]);

  return jsonLd ? <JsonLd schema={jsonLd} /> : null;
}

export default SEOHead;
