import blogsData from '../data/blogs';
import categoriesData from '../data/categories';
import tagsData from '../data/tags';
import { slugify } from '../utils/slugify';
import { validateBlogSubmission } from '../utils/validation';

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

  submitCommunityBlog(formData) {
    const validation = validateBlogSubmission(formData, blogsData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const submissionRecord = {
      id: `pending-${Date.now()}`,
      title: formData.title.trim(),
      slug: slugify(formData.title.trim()),
      address: formData.address.trim(),
      feed: formData.feed ? formData.feed.trim() : '',
      category: formData.category,
      categorySlug: slugify(formData.category),
      tags: formData.tags.split(/[;,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean),
      description: formData.description ? formData.description.trim() : '',
      author: formData.author ? formData.author.trim() : '',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    // Store in localStorage for demonstration/testing workflow without exposing backend fake claims
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const queue = JSON.parse(window.localStorage.getItem('blogai_moderation_queue') || '[]');
        queue.push(submissionRecord);
        window.localStorage.setItem('blogai_moderation_queue', JSON.stringify(queue));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    return {
      success: true,
      submission: submissionRecord,
      message: 'Your blog submission has been received and queued for editorial moderation.',
    };
  },
};

export default blogService;
