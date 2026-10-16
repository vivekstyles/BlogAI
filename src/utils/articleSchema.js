/**
 * Structured data for first-party articles. Shared by the ArticleDetails page
 * and scripts/prerender.js so the client and the static HTML emit identical JSON-LD.
 */
export const SITE_URL = 'https://blogai.directory';

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  return pathOrUrl.startsWith('http') ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
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
    author: { '@type': 'Person', name: article.author },
    publisher: { '@type': 'Organization', name: 'BlogAI', url: SITE_URL },
    image: absoluteUrl(article.image),
    articleSection: article.categories.map((c) => c.name),
    keywords: article.tags.map((t) => t.name).join(', '),
    wordCount: article.wordCount,
    inLanguage: 'en',
  };
}

export function buildArticleBreadcrumbSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/articles/${article.slug}` },
    ],
  };
}
