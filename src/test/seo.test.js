import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import {
  formatPageTitle,
  buildTagMeta,
  buildAuthorSchema,
  buildCategoryTitle,
  buildBlogMeta,
  isTagIndexable,
  TITLE_MAX_LENGTH,
} from '../utils/seo';
import { buildArticleSchema } from '../utils/articleSchema';
import { compileArticle } from '../../scripts/build_articles.js';
import articles from '../data/articles.json';

describe('SEO rules shared by the client and prerendered HTML', () => {
  it('appends the site name only while the title stays within the length budget', () => {
    expect(formatPageTitle('Articles')).toBe('Articles | BlogAI');
    const long = 'A Very Long Article Title That Already Uses Most of the Space';
    expect(formatPageTitle(long)).toBe(long);
    expect(formatPageTitle('')).toMatch(/^BlogAI/);
  });

  it('noindexes single-item tag pages and keeps larger ones indexable', () => {
    expect(isTagIndexable(1)).toBe(false);
    expect(buildTagMeta({ name: 'rss' }, 1, 0).robots).toBe('noindex, follow');
    const meta = buildTagMeta({ name: 'mathematics' }, 5, 2);
    expect(meta.robots).toBe('index, follow');
    expect(meta.title).toBe('#mathematics Articles & Blogs');
    expect(meta.summary).toBe('Explore 5 articles and 2 curated blogs tagged #mathematics on BlogAI.');
  });

  it('noindexes directory listings without a real description', () => {
    const base = { title: 'Example', category: 'Automobile', tags: ['cars'] };
    expect(buildBlogMeta({ ...base, description: '' }).robots).toBe('noindex, follow');
    expect(buildBlogMeta({ ...base, description: 'Long-form road tests.' }).robots).toBe('index, follow');
  });

  it('names categories with articles as articles and blogs', () => {
    expect(buildCategoryTitle({ name: 'Physics' }, 0)).toBe('Physics Blogs - Curated Directory');
    expect(buildCategoryTitle({ name: 'Mathematics' }, 3)).toBe('Mathematics Articles & Blogs');
  });

  it('marks editorial teams as Organization authors in structured data', () => {
    expect(buildAuthorSchema('BlogAI Editors', 'Organization')).toEqual({
      '@type': 'Organization',
      name: 'BlogAI Editors',
    });
    expect(buildAuthorSchema('Ada Lovelace')).toEqual({ '@type': 'Person', name: 'Ada Lovelace' });
    const schema = buildArticleSchema(articles[0]);
    expect(schema.author['@type']).toBe(articles[0].authorType);
  });
});

describe('Compiled article output', () => {
  it('keeps article bodies out of the index and writes one body file per published article', () => {
    expect(articles.every((a) => !('html' in a))).toBe(true);
    const contentDir = path.resolve(__dirname, '../data/article-content');
    const files = fs.readdirSync(contentDir).sort();
    expect(files).toEqual(articles.map((a) => `${a.slug}.json`).sort());
  });

  it('rejects an seoTitle longer than the title budget', () => {
    const source = `---
title: Test Article
seoTitle: ${'x'.repeat(TITLE_MAX_LENGTH + 1)}
description: A test article description.
author: Test Author
publishedAt: 2026-01-01
status: published
categories: [Engineering]
---

Body text.
`;
    const { article, errors } = compileArticle({
      fileName: 'long.md',
      source,
      categories: [{ name: 'Engineering', slug: 'engineering' }],
    });
    expect(article).toBeNull();
    expect(errors.join('\n')).toMatch(/seoTitle must be 60 characters or fewer/);
  });
});
