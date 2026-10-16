/**
 * Shared SEO rules. Imported by the React pages (SEOHead) and by the build scripts
 * (scripts/prerender.js, scripts/build_articles.js) so the static HTML crawlers see
 * first and the client-rendered page always carry the same metadata.
 */
export const SITE_URL = 'https://blogai.directory';
export const SITE_NAME = 'BlogAI';

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
    robots: isTagIndexable(articleCount + blogCount) ? 'index, follow' : 'noindex, follow',
  };
}

/**
 * JSON-LD author node. Editorial teams are Organizations, not People.
 */
export function buildAuthorSchema(name, type = 'Person') {
  return { '@type': type === 'Organization' ? 'Organization' : 'Person', name };
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
    robots: isBlogIndexable(blog) ? 'index, follow' : 'noindex, follow',
    title: `${blog.title} - ${blog.category} Blog`,
    description:
      blog.description ||
      `Explore ${blog.title}, a curated independent blog in ${blog.category} covering ${(blog.tags || []).join(', ')}.`,
  };
}
