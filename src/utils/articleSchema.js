/**
 * Structured data for first-party articles. Shared by the ArticleDetails page
 * and scripts/prerender.js so the client and the static HTML emit identical JSON-LD.
 */
import { SITE_URL, buildAuthorSchema, buildBreadcrumbSchema, buildPublisherSchema } from './seo.js';

export { SITE_URL };

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

// The featured image first, then the figures shown in the article body
function articleImages(article) {
  const urls = [...new Set([article.image, ...(article.contentImages || [])].filter(Boolean).map(absoluteUrl))];
  return urls.length > 0 ? urls : undefined;
}

export function buildArticleSchema(article) {
  const url = `${SITE_URL}/articles/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.canonicalUrl || url },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: buildAuthorSchema(article.author, article.authorType),
    publisher: buildPublisherSchema(),
    image: articleImages(article),
    articleSection: article.categories.map((c) => c.name),
    keywords: article.tags.map((t) => t.name).join(', '),
    wordCount: article.wordCount,
    inLanguage: 'en',
  };
}

export function buildArticleBreadcrumbSchema(article) {
  return buildBreadcrumbSchema(
    [{ label: 'Articles', path: '/articles' }, { label: article.title }],
    `/articles/${article.slug}`
  );
}
