import blogsData from '../data/blogs.json';
import categoriesData from '../data/categories';
import tagsData from '../data/tags.json';
import { slugify } from '../utils/slugify';
import { validateBlogSubmission } from '../utils/validation';
import { collectSubmitterContext } from '../utils/submitterContext';

export const SUBMISSION_ENDPOINT =
  import.meta.env.VITE_SUBMISSION_ENDPOINT || 'https://logs.promptnote.app/subscription';
const SUBMISSION_TIMEOUT_MS = 15000;

export const blogService = {
  getAllBlogs() {
    return blogsData;
  },

  getBlogBySlug(slug) {
    if (!slug) return null;
    const targetSlug = slug.toLowerCase();
    return blogsData.find((b) => b.slug === targetSlug) || null;
  },

  getCategories() {
    return categoriesData;
  },

  getCategoryBySlug(slug) {
    if (!slug) return null;
    const targetSlug = slug.toLowerCase();
    return categoriesData.find((c) => c.slug === targetSlug) || null;
  },

  getBlogsByCategory(categorySlug) {
    if (!categorySlug) return [];
    const targetSlug = categorySlug.toLowerCase();
    return blogsData.filter((b) => b.categorySlug === targetSlug);
  },

  getAllTags() {
    return tagsData;
  },

  getTagBySlug(tagSlug) {
    if (!tagSlug) return null;
    const targetSlug = tagSlug.toLowerCase();
    return tagsData.find((t) => t.slug === targetSlug) || null;
  },

  getBlogsByTag(tagSlug) {
    if (!tagSlug) return [];
    const targetSlug = tagSlug.toLowerCase();
    return blogsData.filter((b) =>
      b.tags.some((t) => slugify(t) === targetSlug)
    );
  },

  getPopularTags(limit = 12) {
    return tagsData.slice(0, limit);
  },

  getFeaturedBlogs(limit = 6) {
    // Deterministic selection of highlighted blogs across distinct categories
    const featured = [];
    const seenCategories = new Set();
    for (const b of blogsData) {
      if (!seenCategories.has(b.category) && b.description) {
        featured.push(b);
        seenCategories.add(b.category);
      }
      if (featured.length >= limit) break;
    }
    return featured;
  },

  async submitCommunityBlog(formData, { formStartedAt } = {}) {
    const validation = validateBlogSubmission(formData, blogsData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const submissionRecord = {
      title: formData.title.trim(),
      slug: slugify(formData.title.trim()),
      address: formData.address.trim(),
      feed: formData.feed ? formData.feed.trim() : '',
      category: formData.category,
      categorySlug: slugify(formData.category),
      tags: formData.tags.split(/[;,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean),
      description: formData.description ? formData.description.trim() : '',
      author: formData.author ? formData.author.trim() : '',
      email: formData.email ? formData.email.trim() : '',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      source: 'blogai-web',
    };

    const payload = {
      ...submissionRecord,
      submitter: collectSubmitterContext({ formStartedAt }),
    };

    // The endpoint sends no CORS headers, so this must stay a "simple" request:
    // a text/plain JSON body with mode 'no-cors'. The response is opaque, so a
    // resolved fetch means the request was delivered; only network failures are detectable.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT_MS);
    try {
      await fetch(SUBMISSION_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch {
      return {
        success: false,
        errors: {
          _general:
            'We could not send your submission. Check your connection and try again.',
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }

    return {
      success: true,
      submission: submissionRecord,
      message: 'Your blog submission has been received and queued for editorial moderation.',
    };
  },
};

export default blogService;
