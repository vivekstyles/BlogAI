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
  buildBreadcrumbSchema,
  buildHomeSchema,
  INDEXABLE_ROBOTS,
  LOGO_URL,
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
    expect(meta.robots).toBe(INDEXABLE_ROBOTS);
    expect(meta.title).toBe('#mathematics Articles & Blogs');
    expect(meta.summary).toBe('Explore 5 articles and 2 curated blogs tagged #mathematics on BlogAI.');
  });

  it('noindexes directory listings without a real description', () => {
    const base = { title: 'Example', category: 'Automobile', tags: ['cars'] };
    expect(buildBlogMeta({ ...base, description: '' }).robots).toBe('noindex, follow');
    expect(buildBlogMeta({ ...base, description: 'Long-form road tests.' }).robots).toBe(INDEXABLE_ROBOTS);
  });

  it('names categories with articles as articles and blogs', () => {
    expect(buildCategoryTitle({ name: 'Physics' }, 0)).toBe('Physics Blogs - Curated Directory');
    expect(buildCategoryTitle({ name: 'Mathematics' }, 3)).toBe('Mathematics Articles & Blogs');
  });

  it('marks editorial teams as Organization authors in structured data', () => {
    expect(buildAuthorSchema('BlogAI Editors', 'Organization')).toEqual({
      '@type': 'Organization',
      name: 'BlogAI Editors',
      url: 'https://blogai.space/',
    });
    expect(buildAuthorSchema('Ada Lovelace')).toEqual({ '@type': 'Person', name: 'Ada Lovelace' });
    const schema = buildArticleSchema(articles[0]);
    expect(schema.author['@type']).toBe(articles[0].authorType);
    expect(schema.publisher.logo.url).toBe(LOGO_URL);
  });

  it('lets indexable pages show large image previews', () => {
    expect(INDEXABLE_ROBOTS).toBe('index, follow, max-image-preview:large');
  });

  it('describes the site name and logo on the home page', () => {
    const [website, organization] = buildHomeSchema();
    expect(website['@type']).toBe('WebSite');
    expect(website.name).toBe('BlogAI');
    expect(website.alternateName).toContain('blogai.space');
    expect(website).not.toHaveProperty('potentialAction');
    expect(organization['@type']).toBe('Organization');
    expect(organization.logo.url).toMatch(/\.png$/);
  });

  it('builds breadcrumb trails with an absolute URL on every item', () => {
    const trail = buildBreadcrumbSchema([{ label: 'Tags' }, { label: '#python' }], '/tag/python');
    expect(trail.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogai.space/' },
      { '@type': 'ListItem', position: 2, name: '#python', item: 'https://blogai.space/tag/python' },
    ]);
  });

  it('lists the figures shown in an article as its structured data images', () => {
    const withFigures = articles.find((a) => a.contentImages.length > 0);
    const schema = buildArticleSchema(withFigures);
    expect(schema.image[0]).toBe(`https://blogai.space${withFigures.contentImages[0]}`);
    const withoutFigures = articles.find((a) => !a.image && a.contentImages.length === 0);
    if (withoutFigures) expect(buildArticleSchema(withoutFigures).image).toBeUndefined();
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
