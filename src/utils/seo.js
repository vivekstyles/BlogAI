/**
 * Shared SEO rules. Imported by the React pages (SEOHead) and by the build scripts
 * (scripts/prerender.js, scripts/build_articles.js) so the static HTML crawlers see
 * first and the client-rendered page always carry the same metadata.
 */
export const SITE_URL = 'https://blogai.space';
export const SITE_NAME = 'BlogAI';

// Indexable pages opt in to large image previews (Google Discover and image-rich snippets)
export const INDEXABLE_ROBOTS = 'index, follow, max-image-preview:large';
export const NOINDEX_ROBOTS = 'noindex, follow';

export const SITE_DESCRIPTION =
  'Original articles and a community-curated directory of high-quality blogs in AI, programming, engineering, mathematics, physics, science, automotive technology, and nutrition.';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
// Square raster logo: Google needs at least 112x112 in a Google Images format (not SVG)
export const LOGO_URL = `${SITE_URL}/icon-512.png`;

/** Publisher node for article markup, pointing at the home page Organization. */
export function buildPublisherSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
  };
}

/**
 * Home page JSON-LD: WebSite (site name in search results) and Organization (logo).
 * Google reads both from the home page only.
 */
export function buildHomeSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ['BlogAI Directory', 'blogai.space'],
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': ORGANIZATION_ID },
    },
    { '@context': 'https://schema.org', ...buildPublisherSchema(), description: SITE_DESCRIPTION },
  ];
}

const TITLE_SUFFIX = ` | ${SITE_NAME}`;
// Search results usually truncate titles beyond roughly 60 characters
export const TITLE_MAX_LENGTH = 60;

/**
 * Appends the site name unless that would push the title past TITLE_MAX_LENGTH,
 * so long article titles keep their own words visible in search results.
 */
export function formatPageTitle(title) {
  if (!title) return `${SITE_NAME} - Technical Articles & Curated Blog Directory`;
  const withSuffix = `${title}${TITLE_SUFFIX}`;
  return withSuffix.length <= TITLE_MAX_LENGTH ? withSuffix : title;
}

/**
 * BreadcrumbList JSON-LD built from the same items the Breadcrumbs component renders.
 * Home is prepended and the last item points at currentPath. Google requires `item` on
 * every ListItem except the last, so intermediate items without a path are left out.
 * @param {Array<{ label: string, path?: string }>} items
 * @param {string} currentPath
 */
export function buildBreadcrumbSchema(items, currentPath) {
  const trail = [
    { label: 'Home', path: '/' },
    ...items.slice(0, -1).filter((item) => item.path),
    { label: items[items.length - 1].label, path: currentPath },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// Tag pages listing fewer items than this are thin near-duplicates of the listing
// they point to: they stay crawlable (follow) but are noindexed and left out of the sitemap.
export const TAG_INDEX_MIN_ITEMS = 2;

export function isTagIndexable(itemCount) {
  return itemCount >= TAG_INDEX_MIN_ITEMS;
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

/**
 * Title, description and robots directive for a tag page.
 * @param {{ name: string }} tag
 * @param {number} articleCount
 * @param {number} blogCount
 */
export function buildTagMeta(tag, articleCount, blogCount) {
  const parts = [];
  if (articleCount) parts.push(plural(articleCount, 'article'));
  if (blogCount) parts.push(plural(blogCount, 'curated blog'));
  const summary = `Explore ${parts.join(' and ') || 'content'} tagged #${tag.name} on BlogAI.`;
  const kind = articleCount && blogCount ? 'Articles & Blogs' : articleCount ? 'Articles' : 'Blogs';
  return {
    title: `#${tag.name} ${kind}`,
    summary,
    description: articleCount
      ? `${summary} Original articles and independent blogs, organized by topic.`
      : `${summary} Every listing links to the original independent website.`,
    robots: isTagIndexable(articleCount + blogCount) ? INDEXABLE_ROBOTS : NOINDEX_ROBOTS,
  };
}

/**
 * JSON-LD author node. Editorial teams are Organizations, not People.
 * Google asks for an author url, and for an Organization that is its home page.
 * Person authors get no url until they have their own profile pages.
 */
export function buildAuthorSchema(name, type = 'Person') {
  if (type === 'Organization') return { '@type': 'Organization', name, url: `${SITE_URL}/` };
  return { '@type': 'Person', name };
}

export function buildCategoryTitle(category, articleCount) {
  return articleCount > 0 ? `${category.name} Articles & Blogs` : `${category.name} Blogs - Curated Directory`;
}

// Sections of the sitemap index, one sitemap-<section>.xml each
export const SITEMAP_SECTIONS = ['pages', 'articles', 'categories', 'tags', 'blogs'];

// A directory listing without a real description is a generated stub, not worth indexing
export function isBlogIndexable(blog) {
  return Boolean(blog.description && blog.description.trim());
}

export function buildBlogMeta(blog) {
  return {
    robots: isBlogIndexable(blog) ? INDEXABLE_ROBOTS : NOINDEX_ROBOTS,
    title: `${blog.title} - ${blog.category} Blog`,
    description:
      blog.description ||
      `Explore ${blog.title}, a curated independent blog in ${blog.category} covering ${(blog.tags || []).join(', ')}.`,
  };
}
