import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  parseFrontmatter,
  renderMarkdown,
  compileArticle,
  buildArticles,
} from '../../scripts/build_articles.js';
import { articleService } from '../services/articleService';
import categories from '../data/categories.json';
import blogs from '../data/blogs.json';
import publishedArticles from '../data/articles.json';

const validFrontmatter = (overrides = '') => `---
title: Test Article
description: A test article description.
author: Test Author
publishedAt: 2026-01-10
status: published
categories:
  - Engineering
tags:
  - Scalability
  - systems
${overrides}---

Intro paragraph.

## First Section

Body text.
`;

describe('Article build: frontmatter and markdown', () => {
  it('parses YAML frontmatter and body', () => {
    const { data, body } = parseFrontmatter(validFrontmatter());
    expect(data.title).toBe('Test Article');
    expect(data.categories).toEqual(['Engineering']);
    expect(body).toContain('## First Section');
  });

  it('rejects files without frontmatter', () => {
    expect(() => parseFrontmatter('# No frontmatter')).toThrow(/frontmatter/);
  });

  it('adds unique heading ids, builds the table of contents, and demotes h1', () => {
    const { html, headings } = renderMarkdown('# Top\n\n## Setup\n\n### Setup\n\n## Setup');
    expect(html).toContain('<h2 id="top">Top</h2>');
    expect(html).toContain('<h3 id="setup-1">Setup</h3>');
    expect(headings.map((h) => h.id)).toEqual(['top', 'setup', 'setup-1', 'setup-2']);
  });

  it('opens external links in a new tab and keeps internal links local', () => {
    const { html } = renderMarkdown('[ext](https://example.com) and [int](/directory)');
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">ext</a>');
    expect(html).toContain('<a href="/directory">int</a>');
  });

  it('lazy-loads images and wraps tables for horizontal scrolling', () => {
    const { html } = renderMarkdown('![Alt text](/img.png)\n\n| a | b |\n| - | - |\n| 1 | 2 |');
    expect(html).toContain('alt="Alt text"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('<div class="article-table-wrap" tabindex="0"><table>');
  });
});

describe('Article build: math and table of contents depth', () => {
  it('renders inline and display math with KaTeX, including MathML', () => {
    const { html } = renderMarkdown('Area is $\\pi r^2$.\n\n$$\n\\frac{a}{b}\n$$\n');
    expect(html).toContain('class="katex"');
    expect(html).toContain('class="katex-display"');
    expect(html).toContain('<math');
    expect(html).toContain('<annotation encoding="application/x-tex">\\pi r^2</annotation>');
  });

  it('keeps escaped and currency dollar signs as text', () => {
    const { html } = renderMarkdown('It costs \\$5, or between $5 and $10.');
    expect(html).not.toContain('katex');
    expect(html).toContain('It costs $5, or between $5 and $10.');
  });

  it('does not treat underscores inside math as emphasis', () => {
    const { html } = renderMarkdown('Sum $a_1 + a_2$ and *real emphasis*.');
    expect(html).toContain('<em>real emphasis</em>');
    expect(html).toContain('<annotation encoding="application/x-tex">a_1 + a_2</annotation>');
  });

  it('renders math inside collapsible solution blocks', () => {
    const { html } = renderMarkdown(
      '<details>\n<summary>Show solution</summary>\n\nAnswer: $x = 3$.\n\n</details>\n'
    );
    expect(html).toMatch(/<details>[\s\S]*class="katex"[\s\S]*<\/details>/);
  });

  it('fails the build on invalid LaTeX', () => {
    const { article, errors } = compileArticle({
      fileName: 'bad-math.md',
      source: validFrontmatter().replace('Body text.', 'Broken $\\frac{1}{$ math.'),
      categories,
    });
    expect(article).toBeNull();
    expect(errors[0]).toMatch(/^bad-math\.md: could not render content: KaTeX parse error/);
  });

  it('limits the table of contents with tocDepth and validates it', () => {
    const body = '\n\n### 1. Item\n\n## Second\n\n### 2. Item\n';
    const { article } = compileArticle({
      fileName: 'toc.md',
      source: validFrontmatter('tocDepth: 2\n') + body,
      categories,
    });
    expect(article.toc.map((h) => h.text)).toEqual(['First Section', 'Second']);
    expect(article.html).toContain('<h3 id="1-item">1. Item</h3>');

    const { errors } = compileArticle({
      fileName: 'toc.md',
      source: validFrontmatter('tocDepth: 5\n'),
      categories,
    });
    expect(errors.join('\n')).toMatch(/tocDepth must be 2 or 3/);
  });

  it('keeps spaces around math in table-of-contents text and excludes LaTeX from word counts', () => {
    const { headings } = renderMarkdown('## Area of $\\pi r^2$ circles');
    expect(headings[0].text).toBe('Area of \\pi r^2 circles');

    const withMath = compileArticle({
      fileName: 'wc.md',
      source: validFrontmatter().replace('Body text.', 'Body text. $\\sum_{i=1}^{n} x_i y_i z_i w_i$'),
      categories,
    }).article;
    const without = compileArticle({ fileName: 'wc.md', source: validFrontmatter(), categories }).article;
    expect(withMath.wordCount).toBe(without.wordCount);
  });
});

describe('Article build: validation', () => {
  it('compiles a valid article with normalized metadata', () => {
    const { article, errors } = compileArticle({
      fileName: 'test-article.md',
      source: validFrontmatter(),
      categories,
    });
    expect(errors).toEqual([]);
    expect(article.slug).toBe('test-article');
    expect(article.updatedAt).toBe('2026-01-10');
    expect(article.categories).toEqual([{ name: 'Engineering', slug: 'engineering' }]);
    expect(article.tags.map((t) => t.slug)).toEqual(['scalability', 'systems']);
    expect(article.canonicalUrl).toBe('https://blogai.space/articles/test-article');
    expect(article.isCanonicalLocal).toBe(true);
    expect(article.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it('reports missing required fields', () => {
    const { article, errors } = compileArticle({
      fileName: 'bad.md',
      source: '---\nstatus: published\n---\n\nBody',
      categories,
    });
    expect(article).toBeNull();
    const joined = errors.join('\n');
    expect(joined).toMatch(/title is required/);
    expect(joined).toMatch(/description is required/);
    expect(joined).toMatch(/author is required/);
    expect(joined).toMatch(/publishedAt is required/);
    expect(joined).toMatch(/at least one category/);
  });

  it('rejects unknown categories, images without alt text, and invalid statuses', () => {
    const { errors } = compileArticle({
      fileName: 'bad.md',
      source: validFrontmatter('image: /x.png\n')
        .replace('  - Engineering', '  - Cooking')
        .replace('status: published', 'status: live'),
      categories,
    });
    const joined = errors.join('\n');
    expect(joined).toMatch(/unknown category "Cooking"/);
    expect(joined).toMatch(/imageAlt is required/);
    expect(joined).toMatch(/status must be one of/);
  });
});

describe('Article build: drafts and related content', () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blogai-articles-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('excludes drafts and template files from the published output', () => {
    fs.writeFileSync(path.join(dir, 'published-one.md'), validFrontmatter());
    fs.writeFileSync(
      path.join(dir, 'secret-draft.md'),
      validFrontmatter().replace('status: published', 'status: draft')
    );
    fs.writeFileSync(path.join(dir, '_template.md'), 'not even valid');

    const { published, drafts, errors } = buildArticles({ articlesDir: dir, categories, blogs });

    expect(errors).toEqual([]);
    expect(published.map((a) => a.slug)).toEqual(['published-one']);
    expect(drafts).toEqual(['secret-draft']);
  });

  it('flags duplicate slugs', () => {
    fs.writeFileSync(path.join(dir, 'a.md'), validFrontmatter('slug: same\n'));
    fs.writeFileSync(path.join(dir, 'b.md'), validFrontmatter('slug: same\n'));
    const { errors } = buildArticles({ articlesDir: dir, categories, blogs });
    expect(errors.join('\n')).toMatch(/duplicate slug "same"/);
  });

  it('links related articles and related directory blogs by shared category and tags', () => {
    fs.writeFileSync(path.join(dir, 'one.md'), validFrontmatter());
    fs.writeFileSync(path.join(dir, 'two.md'), validFrontmatter().replace('2026-01-10', '2026-02-01'));
    const { published } = buildArticles({ articlesDir: dir, categories, blogs });
    const one = published.find((a) => a.slug === 'one');
    expect(one.relatedArticles).toEqual(['two']);
    expect(one.relatedBlogs.length).toBeGreaterThan(0);
    const firstBlog = blogs.find((b) => b.slug === one.relatedBlogs[0]);
    const sharesTag = firstBlog.tags.some((t) => ['scalability', 'systems'].includes(t.toLowerCase()));
    expect(sharesTag).toBe(true);
  });
});

describe('Service: articleService', () => {
  it('only exposes published articles, newest first', () => {
    const all = articleService.getAllArticles();
    expect(all.length).toBe(publishedArticles.length);
    expect(all.every((a) => a.status === 'published')).toBe(true);
    expect(articleService.getArticleBySlug('mathematics-reading-list')).toBeNull();
    const dates = all.map((a) => a.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it('keeps articles separate from directory blog records', () => {
    const articleSlugs = new Set(articleService.getAllArticles().map((a) => a.slug));
    expect(blogs.some((b) => articleSlugs.has(b.slug))).toBe(false);
    expect(blogs.some((b) => 'html' in b)).toBe(false);
  });

  it('filters articles by category, tag, and search query', () => {
    expect(articleService.getArticlesByCategory('engineering').length).toBeGreaterThan(0);
    expect(articleService.getArticlesByTag('rss').map((a) => a.slug)).toContain(
      'follow-technical-blogs-with-rss'
    );
    expect(articleService.searchArticles({ query: 'opml' }).map((a) => a.slug)).toContain(
      'follow-technical-blogs-with-rss'
    );
    expect(articleService.searchArticles({ query: 'zzz-no-match' })).toEqual([]);
  });
});
