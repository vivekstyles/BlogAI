import { normalizeText } from './normalizeText';
import { slugify } from './slugify';

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

export function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Validates a blog submission object against required rules and existing records.
 * @param {Object} submission
 * @param {Array} existingBlogs
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateBlogSubmission(submission, existingBlogs = []) {
  const errors = {};

  const title = (submission.title || '').trim();
  const address = (submission.address || '').trim();
  const feed = (submission.feed || '').trim();
  const category = (submission.category || '').trim();
  const tags = (submission.tags || '').trim();
  const email = (submission.email || '').trim();

  if (!title) {
    errors.title = 'Blog title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 100) {
    errors.title = 'Title must not exceed 100 characters.';
  }

  if (!address) {
    errors.address = 'Website URL is required.';
  } else if (!isValidUrl(address)) {
    errors.address = 'Please enter a valid website URL starting with https:// or http://';
  } else {
    // Check duplicates against existing dataset
    const norm = normalizeText(address).replace(/\/+$/, '');
    const isDuplicate = existingBlogs.some(
      (b) => normalizeText(b.address).replace(/\/+$/, '') === norm
    );
    if (isDuplicate) {
      errors.address = 'A blog with this website address is already listed in the directory.';
    }
  }

  if (feed && !isValidUrl(feed)) {
    errors.feed = 'Please enter a valid RSS/Atom feed URL or leave blank.';
  }

  if (!category) {
    errors.category = 'Please select a primary category.';
  }

  if (!tags) {
    errors.tags = 'Please enter at least one tag.';
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address or leave blank.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
