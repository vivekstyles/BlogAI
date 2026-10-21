import { describe, it, expect, beforeEach, vi } from 'vitest';
import { blogService, SUBMISSION_ENDPOINT } from '../services/blogService';
import { searchService } from '../services/searchService';

describe('Service: blogService', () => {
  it('loads all categories and blogs from data layer', () => {
    const blogs = blogService.getAllBlogs();
    const categories = blogService.getCategories();
    expect(blogs.length).toBeGreaterThan(0);
    // One category per folder in Categories/, and every category has blogs
    const blogCategories = new Set(blogs.map((b) => b.category));
    expect(categories.map((c) => c.name).sort()).toEqual([...blogCategories].sort());
    expect(categories.some((c) => c.name === 'Programming and Technology')).toBe(true);
  });

  it('retrieves blog by slug accurately', () => {
    const blog = blogService.getBlogBySlug('martin-fowler');
    expect(blog).not.toBeNull();
    expect(blog.title).toBe('Martin Fowler');
    expect(blog.category).toBe('Engineering');
  });

  it('retrieves category by slug accurately', () => {
    const cat = blogService.getCategoryBySlug('physics');
    expect(cat).not.toBeNull();
    expect(cat.name).toBe('Physics');
  });

  it('returns null for nonexistent slugs', () => {
    expect(blogService.getBlogBySlug('nonexistent-slug-xyz')).toBeNull();
    expect(blogService.getCategoryBySlug('nonexistent-cat-xyz')).toBeNull();
  });

  it('filters blogs by category', () => {
    const mathBlogs = blogService.getBlogsByCategory('mathematics');
    expect(mathBlogs.length).toBeGreaterThan(0);
    mathBlogs.forEach((b) => {
      expect(b.categorySlug).toBe('mathematics');
    });
  });

  it('filters blogs by tag', () => {
    const reactBlogs = blogService.getBlogsByTag('react');
    expect(reactBlogs.length).toBeGreaterThan(0);
    expect(reactBlogs.some((b) => b.slug === 'dan-abramov-overreacted')).toBe(true);
  });
});

describe('Service: blogService.submitCommunityBlog', () => {
  const validForm = {
    title: 'Example Systems Notes',
    address: 'https://systems-notes.example.com',
    feed: 'https://systems-notes.example.com/feed.xml',
    category: 'Engineering',
    tags: 'Distributed Systems; linux',
    description: 'Notes on systems.',
    author: 'Jane Doe',
    email: 'jane@example.com',
  };

  it('POSTs the submission as a CORS-simple request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ type: 'opaque' });
    vi.stubGlobal('fetch', fetchMock);

    const result = await blogService.submitCommunityBlog(validForm);

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(SUBMISSION_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(options.mode).toBe('no-cors');
    expect(options.headers['Content-Type']).toMatch(/^text\/plain/);

    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      title: 'Example Systems Notes',
      category: 'Engineering',
      categorySlug: 'engineering',
      tags: ['distributed systems', 'linux'],
      email: 'jane@example.com',
      status: 'pending_review',
      source: 'blogai-web',
    });
  });

  it('does not send invalid submissions', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await blogService.submitCommunityBlog({ ...validForm, title: '', address: 'nope' });

    expect(result.success).toBe(false);
    expect(result.errors.title).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a general error when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const result = await blogService.submitCommunityBlog(validForm);

    expect(result.success).toBe(false);
    expect(result.errors._general).toMatch(/could not send/i);
  });
});

describe('Service: searchService', () => {
  const sampleBlogs = [
    {
      id: '1',
      title: 'Distributed Systems Journal',
      slug: 'distributed-systems-journal',
      address: 'https://dist-systems.example.com',
      category: 'Engineering',
      categorySlug: 'engineering',
      tags: ['cloud', 'consensus', 'microservices'],
      description: 'Deep dives on Raft Paxos and scalability.',
      author: 'Leslie'
    },
    {
      id: '2',
      title: 'Quantum Foundations',
      slug: 'quantum-foundations',
      address: 'https://quantum.example.org',
      category: 'Physics',
      categorySlug: 'physics',
      tags: ['quantum', 'entanglement', 'cosmology'],
      description: 'Explorations in quantum measurement problem.',
      author: 'Alice'
    },
    {
      id: '3',
      title: 'Category Theory in Practice',
      slug: 'category-theory-in-practice',
      address: 'https://ct.math.example.edu',
      category: 'Mathematics',
      categorySlug: 'mathematics',
      tags: ['functors', 'monads', 'pure mathematics'],
      description: 'Abstract algebraic structures explained visually.',
      author: 'Saunders'
    }
  ];

  beforeEach(() => {
    searchService.init(sampleBlogs);
  });

  it('searches across titles, descriptions, and domains', () => {
    const res1 = searchService.search({ query: 'quantum', blogs: sampleBlogs });
    expect(res1).toHaveLength(1);
    expect(res1[0].slug).toBe('quantum-foundations');

    const res2 = searchService.search({ query: 'paxos', blogs: sampleBlogs });
    expect(res2).toHaveLength(1);
    expect(res2[0].slug).toBe('distributed-systems-journal');

    const res3 = searchService.search({ query: 'example.org', blogs: sampleBlogs });
    expect(res3).toHaveLength(1);
  });

  it('combines text query, category, and tag with AND logic', () => {
    const res = searchService.search({
      query: 'systems',
      category: 'Engineering',
      tag: 'cloud',
      blogs: sampleBlogs
    });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('1');

    // Mismatched category should return empty
    const noMatch = searchService.search({
      query: 'systems',
      category: 'Physics',
      blogs: sampleBlogs
    });
    expect(noMatch).toHaveLength(0);
  });

  it('sorts results deterministically', () => {
    const descSorted = searchService.search({ sortBy: 'title-desc', blogs: sampleBlogs });
    expect(descSorted[0].title).toBe('Quantum Foundations');
    expect(descSorted[2].title).toBe('Category Theory in Practice');
  });
});
