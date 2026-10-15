/**
 * Normalizes text for search and comparison:
 * - Trims leading/trailing whitespace
 * - Collapses consecutive spaces
 * - Lowercases for case-insensitive matching
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Extracts a readable domain hostname from any URL string.
 * @param {string} urlStr
 * @returns {string}
 */
export function extractDomain(urlStr) {
  if (!urlStr) return '';
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./i, '');
  } catch {
    return urlStr.replace(/^https?:\/\/(www\.)?/i, '').split('/')[0];
  }
}

export default normalizeText;
