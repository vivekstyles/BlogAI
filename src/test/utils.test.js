import { describe, it, expect } from 'vitest';
import { slugify } from '../utils/slugify';
import { normalizeText, extractDomain } from '../utils/normalizeText';
import { isValidUrl, validateBlogSubmission, sanitizeInput } from '../utils/validation';

describe('Utility: slugify', () => {
  it('converts mixed case text with symbols into clean lowercase slugs', () => {
    expect(slugify('Martin Fowler')).toBe('martin-fowler');
    expect(slugify("Gödel's Lost Letter and P=NP")).toBe('godels-lost-letter-and-pnp');
    expect(slugify('Dan Abramov (Overreacted)')).toBe('dan-abramov-overreacted');
  });

  it('handles leading and trailing punctuation and empty inputs gracefully', () => {
    expect(slugify('---hello world---')).toBe('hello-world');
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
  });
});

describe('Utility: normalizeText & extractDomain', () => {
  it('normalizes whitespace and casing', () => {
    expect(normalizeText('  Deep   Learning  \n ')).toBe('deep learning');
  });

  it('extracts clean hostnames without www prefix', () => {
    expect(extractDomain('https://www.martinfowler.com/articles')).toBe('martinfowler.com');
    expect(extractDomain('http://overreacted.io/')).toBe('overreacted.io');
    expect(extractDomain('https://sub.domain.org/path?query=1')).toBe('sub.domain.org');
  });
});

describe('Utility: validation', () => {
  it('validates URLs correctly', () => {
    expect(isValidUrl('https://martinfowler.com')).toBe(true);
    expect(isValidUrl('http://example.org/feed.xml')).toBe(true);
    expect(isValidUrl('ftp://invalid.com')).toBe(false);
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });

  it('sanitizes input against HTML injection', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('detects duplicate blogs using normalized URLs', () => {
    const existing = [
      { id: '1', title: 'Existing', address: 'https://martinfowler.com/' }
    ];

    const result = validateBlogSubmission({
      title: 'Duplicate Blog',
      address: 'https://martinfowler.com',
      category: 'Engineering',
      tags: 'tech',
    }, existing);

    expect(result.isValid).toBe(false);
    expect(result.errors.address).toMatch(/already listed/i);
  });

  it('accepts valid new blog submissions', () => {
    const result = validateBlogSubmission({
      title: 'New Architecture Blog',
      address: 'https://newarch.io/',
      feed: 'https://newarch.io/feed.xml',
      category: 'Engineering',
      tags: 'architecture; distributed systems',
      email: 'editor@newarch.io'
    }, []);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
