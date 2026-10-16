/**
 * scripts/build_articles.js - First-party article compiler
 *
 * Reads Markdown articles with YAML frontmatter from content/articles/,
 * validates their metadata, renders the body to HTML (heading anchors,
 * table of contents, safe external links, lazy images, scrollable tables),
 * links each article to related articles and related directory blogs, and
 * writes src/data/articles.json.
 *
 * Drafts are validated but never written to the output, so they cannot
 * reach the client bundle, prerendered pages, or the sitemap.
 *
 * Files whose name starts with "_" (e.g. _template.md) are ignored.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { slugify } from '../src/utils/slugify.js';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'content', 'articles');
const OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'data', 'articles.json');
const CATEGORIES_PATH = path.join(ROOT_DIR, 'src', 'data', 'categories.json');
const BLOGS_PATH = path.join(ROOT_DIR, 'src', 'data', 'blogs.json');

export const SITE_URL = 'https://blogai.directory';
const STATUSES = ['draft', 'published'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 220;
const RELATED_LIMIT = 3;

/**
 * Splits a Markdown file into its YAML frontmatter and body.
 * @param {string} source
 * @returns {{ data: Object, body: string }}
 */
export function parseFrontmatter(source) {
  const match = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) {
    throw new Error('missing YAML frontmatter block (--- ... ---) at the top of the file');
  }
  const data = parseYaml(match[1]) || {};
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('frontmatter must be a YAML mapping');
  }
  return { data, body: match[2] };
}

function toDateString(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value == null ? '' : String(value).trim();
}

function toList(value) {
  if (value == null || value === '') return [];
  return (Array.isArray(value) ? value : [value]).map((v) => String(v).trim()).filter(Boolean);
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Renders article Markdown to HTML and collects its headings.
 * @param {string} markdown
 * @returns {{ html: string, headings: Array<{ id: string, text: string, level: number }> }}
 */
export function renderMarkdown(markdown) {
  const headings = [];
  const usedIds = new Map();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const text = stripTags(inner);
        const base = slugify(text) || 'section';
        const seen = usedIds.get(base) || 0;
        usedIds.set(base, seen + 1);
        const id = seen === 0 ? base : `${base}-${seen}`;
        // The page title is the only h1; shift body headings down one level if authors use "#"
        const level = Math.min(Math.max(depth, 2), 6);
        if (level <= 3) headings.push({ id, text, level });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
        const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
        const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(href)}"${titleAttr}${externalAttrs}>${inner}</a>`;
      },
      image({ href, title, text }) {
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
        return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}"${titleAttr} loading="lazy" decoding="async" />`;
      },
    },
  });

  let html = marked.parse(markdown);
  // Wide tables scroll inside their own container instead of overflowing the page
  html = html
    .replace(/<table>/g, '<div class="article-table-wrap" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>');

  return { html, headings };
}

function countWords(markdown) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Validates frontmatter and compiles one article.
 * @returns {{ article: Object|null, errors: string[] }}
 */
export function compileArticle({ fileName, source, categories }) {
  const errors = [];
  let parsed;
  try {
    parsed = parseFrontmatter(source);
  } catch (err) {
    return { article: null, errors: [`${fileName}: ${err.message}`] };
  }
  const { data, body } = parsed;
  const fail = (msg) => errors.push(`${fileName}: ${msg}`);

  const status = String(data.status || 'draft').trim().toLowerCase();
  if (!STATUSES.includes(status)) fail(`status must be one of ${STATUSES.join(', ')} (got "${data.status}")`);

  const title = String(data.title || '').trim();
  if (!title) fail('title is required');

  const slug = slugify(String(data.slug || path.basename(fileName, path.extname(fileName))));
  if (!slug) fail('could not derive a slug from the slug field or file name');

  const description = String(data.description || '').trim();
  if (!description) fail('description is required (used for the meta description)');

  const author = String(data.author || '').trim();
  if (!author) fail('author is required');

  const publishedAt = toDateString(data.publishedAt);
  if (!DATE_RE.test(publishedAt)) fail('publishedAt is required as YYYY-MM-DD');

  const updatedAt = toDateString(data.updatedAt) || publishedAt;
  if (data.updatedAt != null && !DATE_RE.test(updatedAt)) fail('updatedAt must be YYYY-MM-DD');
  if (DATE_RE.test(publishedAt) && DATE_RE.test(updatedAt) && updatedAt < publishedAt) {
    fail('updatedAt cannot be earlier than publishedAt');
  }

  const categoryNames = toList(data.categories ?? data.category);
  if (categoryNames.length === 0) fail('at least one category is required');
  const articleCategories = [];
  for (const name of categoryNames) {
    const match = categories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === slugify(name)
    );
    if (!match) {
      fail(`unknown category "${name}" (known: ${categories.map((c) => c.name).join(', ')})`);
    } else if (!articleCategories.some((c) => c.slug === match.slug)) {
      articleCategories.push({ name: match.name, slug: match.slug });
    }
  }

  const articleTags = [];
  for (const tagName of toList(data.tags)) {
    const tag = { name: tagName.toLowerCase(), slug: slugify(tagName) };
    if (tag.slug && !articleTags.some((t) => t.slug === tag.slug)) articleTags.push(tag);
  }

  const image = data.image ? String(data.image).trim() : '';
  const imageAlt = data.imageAlt ? String(data.imageAlt).trim() : '';
  if (image && !imageAlt) fail('imageAlt is required when image is set');

  const canonicalUrl = data.canonical
    ? String(data.canonical).trim()
    : `${SITE_URL}/articles/${slug}`;
  if (!/^https:\/\//.test(canonicalUrl)) fail('canonical must be an absolute https:// URL');

  if (!body.trim()) fail('article body is empty');

  if (errors.length > 0) return { article: null, errors };

  const { html, headings } = renderMarkdown(body);
  const wordCount = countWords(body);
  const showToc = typeof data.toc === 'boolean' ? data.toc : headings.length >= 3;

  return {
    errors,
    article: {
      slug,
      title,
      description,
      author,
      publishedAt,
      updatedAt,
      status,
      categories: articleCategories,
      tags: articleTags,
      image,
      imageAlt,
      canonicalUrl,
      isCanonicalLocal: canonicalUrl === `${SITE_URL}/articles/${slug}`,
      wordCount,
      readingTimeMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
      showToc,
      toc: headings,
      html,
    },
  };
}

function overlap(a, b) {
  const set = new Set(b);
  return a.filter((x) => set.has(x)).length;
}

/**
 * Adds related article slugs and related directory blog slugs to each article.
 */
export function linkRelated(articles, blogs) {
  return articles.map((article) => {
    const catSlugs = article.categories.map((c) => c.slug);
    const tagSlugs = article.tags.map((t) => t.slug);

    const relatedArticles = articles
      .filter((other) => other.slug !== article.slug)
      .map((other) => ({
        slug: other.slug,
        publishedAt: other.publishedAt,
        score:
          3 * overlap(catSlugs, other.categories.map((c) => c.slug)) +
          2 * overlap(tagSlugs, other.tags.map((t) => t.slug)),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug))
      .slice(0, RELATED_LIMIT)
      .map((r) => r.slug);

    const relatedBlogs = blogs
      .map((blog) => ({
        slug: blog.slug,
        score:
          2 * overlap(tagSlugs, (blog.tags || []).map((t) => slugify(t))) +
          (catSlugs.includes(blog.categorySlug) ? 1 : 0),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
      .slice(0, RELATED_LIMIT)
      .map((r) => r.slug);

    return { ...article, relatedArticles, relatedBlogs };
  });
}

/**
 * Compiles every article file in a directory.
 * @returns {{ published: Object[], drafts: string[], errors: string[] }}
 */
export function buildArticles({ articlesDir, categories, blogs }) {
  const errors = [];
  const compiled = [];
  const drafts = [];

  const files = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort()
    : [];

  for (const fileName of files) {
    const source = fs.readFileSync(path.join(articlesDir, fileName), 'utf-8');
    const result = compileArticle({ fileName, source, categories });
    errors.push(...result.errors);
    if (!result.article) continue;
    if (compiled.some((a) => a.slug === result.article.slug)) {
      errors.push(`${fileName}: duplicate slug "${result.article.slug}"`);
      continue;
    }
    compiled.push(result.article);
  }

  const published = [];
  for (const article of compiled) {
    if (article.status === 'published') published.push(article);
    else drafts.push(article.slug);
  }

  published.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));

  return { published: linkRelated(published, blogs), drafts, errors };
}

function main() {
  const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf-8'));
  const blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, 'utf-8'));
  const { published, drafts, errors } = buildArticles({ articlesDir: ARTICLES_DIR, categories, blogs });

  if (errors.length > 0) {
    console.error(`[ERROR] Article build failed with ${errors.length} issue(s):`);
    for (const err of errors) console.error(`  * ${err}`);
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(published, null, 2)}\n`, 'utf-8');
  console.log(
    `[Articles] Compiled ${published.length} published article(s) to src/data/articles.json` +
      (drafts.length ? `; skipped ${drafts.length} draft(s): ${drafts.join(', ')}` : '')
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
