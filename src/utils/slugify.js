/**
 * Generates clean, lowercase, URL-safe slugs matching the Python backend implementation.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-')  // collapse whitespace and underscores to a single dash
    .replace(/^-+|-+$/g, '');  // trim leading/trailing dashes
}

export default slugify;
