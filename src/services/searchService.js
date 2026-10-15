import { normalizeText, extractDomain } from '../utils/normalizeText';
import { slugify } from '../utils/slugify';

class SearchService {
  constructor() {
    this.tokenIndex = new Map();
    this.blogs = [];
    this.initialized = false;
  }

  /**
   * Builds an inverted token index for lightning-fast sub-millisecond multi-field search.
   * @param {Array} blogs
   */
  init(blogs = []) {
    this.blogs = blogs;
    this.tokenIndex.clear();

    blogs.forEach((blog, index) => {
      const tokens = this.extractTokens(blog);
      tokens.forEach((token) => {
        if (!this.tokenIndex.has(token)) {
          this.tokenIndex.set(token, new Set());
        }
        this.tokenIndex.get(token).add(index);
      });
    });

    this.initialized = true;
  }

  extractTokens(blog) {
    const domain = extractDomain(blog.address);
    const rawParts = [
      blog.title,
      blog.address,
      domain,
      blog.description || '',
      blog.author || '',
      blog.category,
      ...(blog.tags || []),
    ];
    const fullText = normalizeText(rawParts.join(' '));
    const tokens = new Set();
    // Add raw domain
    if (domain) tokens.add(domain.toLowerCase());
    // Add individual word tokens
    fullText.split(/[^a-z0-9]+/i).forEach((tok) => {
      if (tok.length >= 2) tokens.add(tok);
    });
    return Array.from(tokens);
  }

  /**
   * Filters and sorts blogs matching criteria.
   * @param {Object} options
   * @returns {Array} Matching blog items
   */
  search({
    query = '',
    category = '',
    tag = '',
    sortBy = 'title-asc',
    blogs = null,
  } = {}) {
    const dataList = blogs || this.blogs;
    if (!this.initialized && dataList.length > 0) {
      this.init(dataList);
    }

    const normQuery = normalizeText(query);
    const searchTerms = normQuery
      .split(/[^a-z0-9]+/i)
      .filter((term) => term.length >= 2);

    const normCategorySlug = category ? slugify(category) : '';
    const normTagSlug = tag ? slugify(tag) : '';

    let candidateIndices = null;

    // Use inverted index if search query exists
    if (searchTerms.length > 0) {
      for (const term of searchTerms) {
        const matchingForTerm = new Set();
        // Match prefix or exact token
        for (const [token, indices] of this.tokenIndex.entries()) {
          if (token.includes(term)) {
            indices.forEach((idx) => matchingForTerm.add(idx));
          }
        }

        if (candidateIndices === null) {
          candidateIndices = matchingForTerm;
        } else {
          // Intersection (AND logic)
          const intersected = new Set();
          matchingForTerm.forEach((idx) => {
            if (candidateIndices.has(idx)) {
              intersected.add(idx);
            }
          });
          candidateIndices = intersected;
        }

        if (candidateIndices.size === 0) break;
      }
    }

    // Filter results
    let results = candidateIndices !== null
      ? Array.from(candidateIndices).map((idx) => this.blogs[idx]).filter(Boolean)
      : [...dataList];

    // Filter by Category
    if (normCategorySlug) {
      results = results.filter((b) => b.categorySlug === normCategorySlug);
    }

    // Filter by Tag
    if (normTagSlug) {
      results = results.filter((b) =>
        b.tags && b.tags.some((t) => slugify(t) === normTagSlug)
      );
    }

    // Sort results deterministically
    results.sort((a, b) => {
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'category') {
        const catCompare = a.category.localeCompare(b.category);
        return catCompare !== 0 ? catCompare : a.title.localeCompare(b.title);
      }
      return a.title.localeCompare(b.title);
    });

    return results;
  }
}

export const searchService = new SearchService();
export default searchService;
