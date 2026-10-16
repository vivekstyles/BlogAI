import articlesData from '../data/articles';
import blogsData from '../data/blogs';
import { slugify } from '../utils/slugify';
import { normalizeText } from '../utils/normalizeText';

export const articleService = {
  getAllArticles() {
    return articlesData;
  },

  getArticleBySlug(slug) {
    if (!slug) return null;
    const targetSlug = slug.toLowerCase();
    return articlesData.find((a) => a.slug === targetSlug) || null;
  },

  getLatestArticles(limit = 3) {
    return articlesData.slice(0, limit);
  },

  getArticlesByCategory(categorySlug) {
    if (!categorySlug) return [];
    const targetSlug = categorySlug.toLowerCase();
    return articlesData.filter((a) => a.categories.some((c) => c.slug === targetSlug));
  },

  getArticlesByTag(tagSlug) {
    if (!tagSlug) return [];
    const targetSlug = slugify(tagSlug);
    return articlesData.filter((a) => a.tags.some((t) => t.slug === targetSlug));
  },

  getArticleTags() {
    const bySlug = new Map();
    for (const article of articlesData) {
      for (const tag of article.tags) {
        const entry = bySlug.get(tag.slug) || { ...tag, count: 0 };
        entry.count += 1;
        bySlug.set(tag.slug, entry);
      }
    }
    return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },

  getRelatedArticles(article) {
    if (!article) return [];
    return article.relatedArticles.map((slug) => this.getArticleBySlug(slug)).filter(Boolean);
  },

  getRelatedBlogs(article) {
    if (!article) return [];
    return article.relatedBlogs
      .map((slug) => blogsData.find((b) => b.slug === slug))
      .filter(Boolean);
  },

  searchArticles({ query = '', categorySlug = '' } = {}) {
    const q = normalizeText(query);
    return articlesData.filter((a) => {
      if (categorySlug && !a.categories.some((c) => c.slug === categorySlug)) return false;
      if (!q) return true;
      const haystack = normalizeText(
        [a.title, a.description, a.author, ...a.tags.map((t) => t.name), ...a.categories.map((c) => c.name)].join(' ')
      );
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  },
};

export default articleService;
