/**
 * scripts/prerender.js - Static Site Generation & Prerendering for Vite + React
 * Injects route-specific SEO titles, meta descriptions, canonical URLs,
 * Open Graph, Twitter cards, JSON-LD structured data, and crawlable semantic HTML into dist/.
 * Also generates sitemap.xml.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildArticleSchema, buildArticleBreadcrumbSchema } from '../src/utils/articleSchema.js';
import { formatDate } from '../src/utils/formatDate.js';
import { slugify } from '../src/utils/slugify.js';
import {
  SITE_URL,
  formatPageTitle,
  buildTagMeta,
  buildCategoryTitle,
  buildBlogMeta,
  buildAuthorSchema,
} from '../src/utils/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsonLd(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function buildHtml({
  template,
  title,
  description,
  canonicalUrl,
  robots = 'index, follow',
  jsonLd = null,
  bodyContent = '',
  ogType = 'website',
  image = '',
  extraMeta = [],
}) {
  let html = template;
  title = formatPageTitle(title);

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Replace Description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Replace Canonical Link
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`
  );

  // Optional image and article metadata
  const headMeta = [...extraMeta];
  if (image) {
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    headMeta.push({ property: 'og:image', content: imageUrl }, { name: 'twitter:image', content: imageUrl });
  }
  const metaTags = headMeta
    .filter((m) => m.content)
    .map((m) =>
      m.property
        ? `  <meta property="${escapeHtml(m.property)}" content="${escapeHtml(m.content)}" />`
        : `  <meta name="${escapeHtml(m.name)}" content="${escapeHtml(m.content)}" />`
    );
  if (metaTags.length > 0) {
    html = html.replace('</head>', `${metaTags.join('\n')}\n</head>`);
  }

  // Replace Twitter tags; the large card needs an image to show anything useful
  html = html.replace(
    /<meta\s+name=["']twitter:card["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );

  // Inject or update Robots meta
  if (robots) {
    if (html.includes('<meta name="robots"')) {
      html = html.replace(
        /<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
        `<meta name="robots" content="${escapeHtml(robots)}" />`
      );
    } else {
      html = html.replace('</head>', `  <meta name="robots" content="${escapeHtml(robots)}" />\n</head>`);
    }
  }

  // Inject JSON-LD structured data
  if (jsonLd) {
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    const jsonLdScripts = schemas
      .map((schema) => `  <script type="application/ld+json">\n${escapeJsonLd(schema)}\n  </script>\n`)
      .join('');
    html = html.replace('</head>', `${jsonLdScripts}</head>`);
  }

  // Inject Pre-rendered semantic HTML body inside #root
  if (bodyContent) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);
  }

  return html;
}

async function runPrerender() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[ERROR] Template not found at ${TEMPLATE_PATH}. Run 'vite build' first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // Load data
  const blogs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'blogs.json'), 'utf-8'));
  const categories = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'categories.json'), 'utf-8'));
  const tags = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'tags.json'), 'utf-8'));
  // Published articles only: drafts are never written to articles.json
  const articlesPath = path.join(ROOT_DIR, 'src', 'data', 'articles.json');
  const articles = fs.existsSync(articlesPath) ? JSON.parse(fs.readFileSync(articlesPath, 'utf-8')) : [];
  const articleHtml = (slug) =>
    JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'article-content', `${slug}.json`), 'utf-8')).html;

  const articleCardHtml = (a) => `
              <article class="article-card">
                <span class="article-kind-label">Original article</span>
                <h3><a href="/articles/${a.slug}">${escapeHtml(a.title)}</a></h3>
                <p>${escapeHtml(a.description)}</p>
                <p><time datetime="${a.publishedAt}">${formatDate(a.publishedAt)}</time> · ${a.readingTimeMinutes} min read</p>
              </article>`;

  // lastmod is only emitted where a real content date exists; build dates would make it meaningless
  const sitemapUrls = [];
  const latestArticleDate = articles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), '');

  function writeRouteFile(routePath, htmlContent) {
    let targetDir;
    let targetFile;

    if (routePath === '/' || routePath === '') {
      targetDir = DIST_DIR;
      targetFile = path.join(DIST_DIR, 'index.html');
    } else if (routePath === '/404' || routePath === '404') {
      targetDir = DIST_DIR;
      targetFile = path.join(DIST_DIR, '404.html');
    } else {
      const cleanPath = routePath.replace(/^\/+|\/+$/g, '');
      targetDir = path.join(DIST_DIR, cleanPath);
      targetFile = path.join(targetDir, 'index.html');
    }

    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetFile, htmlContent, 'utf-8');
  }

  console.log('[Prerender] Starting static HTML generation for all routes...');

  // 1. Home Page (/)
  const homeBody = `
    <header class="site-header">
      <div class="container header-container">
        <a href="/" class="site-logo">
          <span class="logo-title">BlogAI</span>
          <span class="logo-tag">Directory</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/articles">Articles</a>
          <a href="/directory">Blog Directory</a>
          <a href="/submit">Submit a Blog</a>
        </nav>
      </div>
    </header>
    <main id="main-content">
      <section class="hero-section">
        <div class="container">
          <h1 class="hero-title">Discover Great Technical &amp; Scientific Blogs</h1>
          <p class="hero-subtitle">Read original articles published here, and explore a community-curated directory of ${blogs.length} independent blogs across engineering, mathematics, physics, science, and automotive technology.</p>
          <a href="/articles">Read Articles</a>
          <a href="/directory">Browse Blog Directory</a>
        </div>
      </section>
      ${articles.length > 0 ? `
      <section class="home-articles-section">
        <div class="container">
          <h2 class="section-title">Latest Articles</h2>
          <div class="article-grid">${articles.slice(0, 3).map(articleCardHtml).join('')}
          </div>
          <a href="/articles">All articles</a>
        </div>
      </section>` : ''}
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Browse by Category</h2>
          <div class="category-grid">
            ${categories.map(c => `
              <div class="category-card">
                <h3><a href="/category/${c.slug}">${escapeHtml(c.name)}</a></h3>
                <p>${escapeHtml(c.description)}</p>
                <span>${c.count} Blogs</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
  `;

  const homeHtml = buildHtml({
    template,
    title: 'Technical Articles & Curated Blog Directory',
    description: `Read original articles and discover ${blogs.length}+ community-curated independent blogs across engineering, mathematics, physics, science, and automotive technology.`,
    canonicalUrl: `${SITE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BlogAI',
      url: SITE_URL,
      description: 'Original articles and a community-curated directory of high-quality blogs in engineering, mathematics, physics, science, and automotive technology.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/directory?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    bodyContent: homeBody,
  });
  writeRouteFile('/', homeHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/`, lastmod: latestArticleDate });

  // 1b. Community blog directory (/directory)
  const directoryBody = `
    <main id="main-content">
      <div class="container">
        <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Blog Directory</li></ol></nav>
        <h1>Community Blog Directory</h1>
        <p>Independent blogs curated by the community. Every listing links to the original website. For writing published here, see our <a href="/articles">articles</a>.</p>
        <div class="blog-grid">
          ${blogs.map(b => `
            <article class="blog-card">
              <span class="blog-kind-label">External blog</span>
              <h3><a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.title)}</a></h3>
              <p>${escapeHtml(b.description || `Curated ${b.category} publication.`)}</p>
              <a href="/blog/${b.slug}">Details</a>
              <a href="/category/${b.categorySlug}">${escapeHtml(b.category)}</a>
            </article>
          `).join('')}
        </div>
      </div>
    </main>
  `;
  writeRouteFile('/directory', buildHtml({
    template,
    title: 'Community Blog Directory',
    description: `Search and filter ${blogs.length} community-curated independent blogs across engineering, mathematics, physics, science, and automotive technology.`,
    canonicalUrl: `${SITE_URL}/directory`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Community Blog Directory',
      url: `${SITE_URL}/directory`,
      numberOfItems: blogs.length,
    },
    bodyContent: directoryBody,
  }));
  sitemapUrls.push({ loc: `${SITE_URL}/directory` });

  // 1c. Articles listing (/articles)
  const articlesBody = `
    <main id="main-content">
      <div class="container">
        <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Articles</li></ol></nav>
        <h1>Articles</h1>
        <p>Original writing published here on BlogAI. Looking for external blogs instead? Browse the <a href="/directory">community blog directory</a>.</p>
        <div class="article-grid">${articles.map(articleCardHtml).join('')}
        </div>
      </div>
    </main>
  `;
  writeRouteFile('/articles', buildHtml({
    template,
    title: 'Articles',
    description: 'Original articles from BlogAI on reading, following, and learning from technical and scientific writing.',
    canonicalUrl: `${SITE_URL}/articles`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'BlogAI Articles',
      description: 'Original articles published by BlogAI.',
      url: `${SITE_URL}/articles`,
      blogPost: articles.map(a => ({
        '@type': 'BlogPosting',
        headline: a.title,
        url: `${SITE_URL}/articles/${a.slug}`,
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        author: buildAuthorSchema(a.author, a.authorType),
      })),
    },
    bodyContent: articlesBody,
  }));
  sitemapUrls.push({ loc: `${SITE_URL}/articles`, lastmod: latestArticleDate });

  // 1d. Individual articles (/articles/:articleSlug) with the full content in the HTML
  for (const a of articles) {
    const relatedArticles = a.relatedArticles.map(slug => articles.find(x => x.slug === slug)).filter(Boolean);
    const relatedBlogs = a.relatedBlogs.map(slug => blogs.find(b => b.slug === slug)).filter(Boolean);
    const tocHtml = a.showToc && a.toc.length > 0
      ? `<nav class="article-toc" aria-label="Table of contents"><p class="article-toc-title">On this page</p><ol class="article-toc-list">${a.toc.map(t => `<li class="article-toc-item level-${t.level}"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`).join('')}</ol></nav>`
      : '';
    const updatedHtml = a.updatedAt !== a.publishedAt
      ? ` · Updated <time datetime="${a.updatedAt}">${formatDate(a.updatedAt)}</time>`
      : '';
    const articleBody = `
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/articles">Articles</a></li><li>${escapeHtml(a.title)}</li></ol></nav>
        </div>
        <article class="container article-layout">
          <header class="article-header">
            <p>${a.categories.map(c => `<a href="/category/${c.slug}">${escapeHtml(c.name)}</a>`).join(' ')}</p>
            <h1 class="article-title">${escapeHtml(a.title)}</h1>
            <p class="article-lead">${escapeHtml(a.description)}</p>
            <p class="article-meta">By ${escapeHtml(a.author)} · <time datetime="${a.publishedAt}">${formatDate(a.publishedAt)}</time>${updatedHtml} · ${a.readingTimeMinutes} min read</p>
          </header>
          ${a.image ? `<figure class="article-featured-image"><img src="${escapeHtml(a.image)}" alt="${escapeHtml(a.imageAlt)}" /></figure>` : ''}
          ${tocHtml}
          <div class="article-content">${articleHtml(a.slug)}</div>
          ${a.tags.length ? `<footer class="article-footer"><h2>Tags</h2>${a.tags.map(t => `<a href="/tag/${t.slug}">#${escapeHtml(t.name)}</a>`).join(' ')}</footer>` : ''}
        </article>
        <div class="container">
          ${relatedArticles.length ? `<section><h2>Related articles</h2><ul>${relatedArticles.map(r => `<li><a href="/articles/${r.slug}">${escapeHtml(r.title)}</a></li>`).join('')}</ul></section>` : ''}
          ${relatedBlogs.length ? `<section><h2>From the blog directory</h2><ul>${relatedBlogs.map(b => `<li><a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.title)}</a> (<a href="/blog/${b.slug}">details</a>)</li>`).join('')}</ul></section>` : ''}
        </div>
      </main>
    `;

    writeRouteFile(`/articles/${a.slug}`, buildHtml({
      template,
      title: a.seoTitle || a.title,
      description: a.description,
      canonicalUrl: a.canonicalUrl,
      ogType: 'article',
      image: a.image,
      extraMeta: [
        { property: 'article:published_time', content: a.publishedAt },
        { property: 'article:modified_time', content: a.updatedAt },
        { property: 'article:author', content: a.author },
        { property: 'article:section', content: a.categories[0]?.name },
        ...a.tags.map(t => ({ property: 'article:tag', content: t.name })),
      ],
      jsonLd: [buildArticleSchema(a), buildArticleBreadcrumbSchema(a)],
      bodyContent: articleBody,
    }));
    // Articles first published elsewhere keep their external canonical and stay out of the sitemap
    if (a.isCanonicalLocal) {
      sitemapUrls.push({ loc: `${SITE_URL}/articles/${a.slug}`, lastmod: a.updatedAt });
    }
  }

  // 2. Categories (/category/:categorySlug)
  for (const cat of categories) {
    const catBlogs = blogs.filter(b => b.categorySlug === cat.slug);
    const catArticles = articles.filter(a => a.categories.some(c => c.slug === cat.slug));
    const catBody = `
      <header class="site-header">
        <div class="container"><a href="/" class="site-logo"><span class="logo-title">BlogAI</span></a></div>
      </header>
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>${escapeHtml(cat.name)}</li></ol></nav>
          <h1>${escapeHtml(cat.name)} Blogs</h1>
          <p>${escapeHtml(cat.description)}</p>
          ${catArticles.length ? `<section><h2>Articles in ${escapeHtml(cat.name)}</h2><div class="article-grid">${catArticles.map(articleCardHtml).join('')}</div></section>` : ''}
          <h2>${escapeHtml(cat.name)} blogs in the directory</h2>
          <div class="blog-grid">
            ${catBlogs.map(b => `
              <article class="blog-card">
                <h3><a href="/blog/${b.slug}">${escapeHtml(b.title)}</a></h3>
                <p>${escapeHtml(b.description || '')}</p>
                <a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">Visit Website</a>
              </article>
            `).join('')}
          </div>
        </div>
      </main>
    `;

    const catHtml = buildHtml({
      template,
      title: buildCategoryTitle(cat, catArticles.length),
      description: cat.description,
      canonicalUrl: `${SITE_URL}/category/${cat.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${cat.name} Blogs Directory`,
        description: cat.description,
        url: `${SITE_URL}/category/${cat.slug}`,
        numberOfItems: cat.count,
      },
      bodyContent: catBody,
    });
    writeRouteFile(`/category/${cat.slug}`, catHtml);
    const catLastmod = catArticles.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), '');
    sitemapUrls.push({ loc: `${SITE_URL}/category/${cat.slug}`, lastmod: catLastmod });
  }

  // 3. Tags (/tag/:tagSlug) - directory tags plus tags used only by articles
  const allTags = [...tags];
  for (const a of articles) {
    for (const t of a.tags) {
      if (!allTags.some(x => x.slug === t.slug)) allTags.push({ name: t.name, slug: t.slug });
    }
  }
  for (const t of allTags) {
    const tagBlogs = blogs.filter(b => b.tags.some(tagText => slugify(tagText) === t.slug));
    const tagArticles = articles.filter(a => a.tags.some(x => x.slug === t.slug));
    const tagMeta = buildTagMeta(t, tagArticles.length, tagBlogs.length);
    const tagBody = `
      <header class="site-header">
        <div class="container"><a href="/" class="site-logo"><span class="logo-title">BlogAI</span></a></div>
      </header>
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Tags</li><li>#${escapeHtml(t.name)}</li></ol></nav>
          <h1>#${escapeHtml(t.name)}</h1>
          <p>${escapeHtml(tagMeta.summary)}</p>
          ${tagArticles.length ? `<section><h2>Articles</h2><div class="article-grid">${tagArticles.map(articleCardHtml).join('')}</div></section>` : ''}
          <div class="blog-grid">
            ${tagBlogs.map(b => `
              <article class="blog-card">
                <h3><a href="/blog/${b.slug}">${escapeHtml(b.title)}</a></h3>
                <p>${escapeHtml(b.description || '')}</p>
                <a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">Visit Website</a>
              </article>
            `).join('')}
          </div>
        </div>
      </main>
    `;

    const tagHtml = buildHtml({
      template,
      title: tagMeta.title,
      description: tagMeta.description,
      canonicalUrl: `${SITE_URL}/tag/${t.slug}`,
      robots: tagMeta.robots,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Articles and Blogs Tagged with #${t.name}`,
        url: `${SITE_URL}/tag/${t.slug}`,
        numberOfItems: tagBlogs.length + tagArticles.length,
      },
      bodyContent: tagBody,
    });
    writeRouteFile(`/tag/${t.slug}`, tagHtml);
    // Single-item tag pages are noindexed, so they stay out of the sitemap
    if (tagMeta.robots.startsWith('index')) sitemapUrls.push({ loc: `${SITE_URL}/tag/${t.slug}` });
  }

  // 4. Individual Blog Details (/blog/:blogSlug)
  for (const b of blogs) {
    const blogBody = `
      <header class="site-header">
        <div class="container"><a href="/" class="site-logo"><span class="logo-title">BlogAI</span></a></div>
      </header>
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/category/${b.categorySlug}">${escapeHtml(b.category)}</a></li><li>${escapeHtml(b.title)}</li></ol></nav>
          <article>
            <h1>${escapeHtml(b.title)}</h1>
            <p>${escapeHtml(b.description || `Curated ${b.category} publication.`)}</p>
            <div>
              <strong>Official Website:</strong> <a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.address)}</a>
            </div>
            ${b.feed ? `<div><strong>RSS Feed:</strong> <a href="${escapeHtml(b.feed)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.feed)}</a></div>` : ''}
            <div>
              <strong>Category:</strong> <a href="/category/${b.categorySlug}">${escapeHtml(b.category)}</a>
            </div>
            <div>
              <strong>Tags:</strong>
              ${b.tags.map(tagText => `<a href="/tag/${tagText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}">#${escapeHtml(tagText)}</a>`).join(' ')}
            </div>
          </article>
        </div>
      </main>
    `;

    const blogHtml = buildHtml({
      template,
      title: buildBlogMeta(b).title,
      description: buildBlogMeta(b).description,
      canonicalUrl: `${SITE_URL}/blog/${b.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: b.title,
        url: b.address,
        description: b.description || `Curated ${b.category} blog.`,
        inLanguage: b.language || 'en',
        author: b.author ? { '@type': 'Person', name: b.author } : undefined,
      },
      bodyContent: blogBody,
    });
    writeRouteFile(`/blog/${b.slug}`, blogHtml);
    sitemapUrls.push({ loc: `${SITE_URL}/blog/${b.slug}` });
  }

  // 5. Submit (/submit)
  const submitHtml = buildHtml({
    template,
    title: 'Submit a Publication',
    description: 'Recommend a high-quality independent blog in engineering, mathematics, physics, science, or automotive tech for inclusion in BlogAI Directory.',
    canonicalUrl: `${SITE_URL}/submit`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Submit a Blog for Review</h1><p>Suggest high-signal publications for inclusion in the directory.</p></div></main>`,
  });
  writeRouteFile('/submit', submitHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/submit` });

  // 6. About (/about)
  const aboutHtml = buildHtml({
    template,
    title: 'About the Directory',
    description: 'Learn about the mission, open architecture, and curation standards behind the BlogAI community blog directory.',
    canonicalUrl: `${SITE_URL}/about`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About BlogAI Directory',
      url: `${SITE_URL}/about`,
    },
    bodyContent: `<main id="main-content"><div class="container"><h1>About BlogAI Directory</h1><p>An open directory connecting curious minds with independent technical blogs.</p></div></main>`,
  });
  writeRouteFile('/about', aboutHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/about` });

  // 7. Guidelines (/guidelines)
  const guidelinesHtml = buildHtml({
    template,
    title: 'Submission Guidelines',
    description: 'Review the editorial and technical quality guidelines for listing blogs in the BlogAI directory.',
    canonicalUrl: `${SITE_URL}/guidelines`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Submission &amp; Quality Guidelines</h1></div></main>`,
  });
  writeRouteFile('/guidelines', guidelinesHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/guidelines` });

  // 8. Privacy (/privacy)
  const privacyHtml = buildHtml({
    template,
    title: 'Privacy Policy',
    description: 'Privacy policy for BlogAI Directory: zero tracking, no cookies, and no personal data collection.',
    canonicalUrl: `${SITE_URL}/privacy`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Privacy Policy</h1><p>Zero tracking, no analytics cookies, no personal data resale.</p></div></main>`,
  });
  writeRouteFile('/privacy', privacyHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/privacy` });

  // 9. 404 (404.html)
  const notFoundHtml = buildHtml({
    template,
    title: '404 - Page Not Found',
    description: 'The requested page could not be found.',
    canonicalUrl: `${SITE_URL}/404`,
    robots: 'noindex, nofollow',
    bodyContent: `<main id="main-content"><div class="container"><h1>404 - Page Not Found</h1><p>The page you requested does not exist.</p><a href="/">Return Home</a></div></main>`,
  });
  writeRouteFile('/404', notFoundHtml);

  // 10. Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  // Copy feed.opml to dist/
  const rootOpml = path.join(ROOT_DIR, 'feed.opml');
  if (fs.existsSync(rootOpml)) {
    fs.copyFileSync(rootOpml, path.join(DIST_DIR, 'feed.opml'));
  }

  const pageCount = 8 + articles.length + categories.length + allTags.length + blogs.length;
  console.log(`[SUCCESS] Pre-rendered ${pageCount} static pages and generated sitemap.xml with ${sitemapUrls.length} canonical URLs.`);
}

runPrerender().catch(err => {
  console.error('[ERROR] Prerender failed:', err);
  process.exit(1);
});
