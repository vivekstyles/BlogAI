/**
 * scripts/prerender.js - Static Site Generation & Prerendering for Vite + React
 * Injects route-specific SEO titles, meta descriptions, canonical URLs,
 * Open Graph, Twitter cards, JSON-LD structured data, and crawlable semantic HTML into dist/.
 * Also generates sitemap.xml.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

const SITE_URL = 'https://blogai.directory';

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

function buildHtml({ template, title, description, canonicalUrl, robots = 'index, follow', jsonLd = null, bodyContent = '' }) {
  let html = template;

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

  // Replace Twitter tags
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
    const jsonLdScript = `  <script type="application/ld+json">\n${escapeJsonLd(jsonLd)}\n  </script>\n`;
    html = html.replace('</head>', `${jsonLdScript}</head>`);
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

  const sitemapUrls = [];
  const currentDate = new Date().toISOString().split('T')[0];

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
      </div>
    </header>
    <main id="main-content">
      <section class="hero-section">
        <div class="container">
          <h1 class="hero-title">Discover Great Technical &amp; Scientific Blogs</h1>
          <p class="hero-subtitle">An independent directory of ${blogs.length} high-signal publications across engineering, mathematics, physics, science, and automotive technology.</p>
        </div>
      </section>
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Browse Categories</h2>
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
      <section class="directory-section">
        <div class="container">
          <h2 class="section-title">All Publications</h2>
          <div class="blog-grid">
            ${blogs.map(b => `
              <article class="blog-card">
                <h3><a href="/blog/${b.slug}">${escapeHtml(b.title)}</a></h3>
                <p>${escapeHtml(b.description || `Curated ${b.category} publication.`)}</p>
                <a href="${escapeHtml(b.address)}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                <a href="/category/${b.categorySlug}">${escapeHtml(b.category)}</a>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
  `;

  const homeHtml = buildHtml({
    template,
    title: 'BlogAI - Curated Community Blog Directory',
    description: `Discover, search, filter, and subscribe to over ${blogs.length} high-quality independent blogs across engineering, math, physics, science, and automotive technology.`,
    canonicalUrl: `${SITE_URL}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BlogAI Directory',
      url: SITE_URL,
      description: 'Curated community directory of high-quality blogs in engineering, mathematics, physics, science, and automotive technology.',
    },
    bodyContent: homeBody,
  });
  writeRouteFile('/', homeHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' });

  // 2. Categories (/category/:categorySlug)
  for (const cat of categories) {
    const catBlogs = blogs.filter(b => b.categorySlug === cat.slug);
    const catBody = `
      <header class="site-header">
        <div class="container"><a href="/" class="site-logo"><span class="logo-title">BlogAI</span></a></div>
      </header>
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>${escapeHtml(cat.name)}</li></ol></nav>
          <h1>${escapeHtml(cat.name)} Blogs</h1>
          <p>${escapeHtml(cat.description)}</p>
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
      title: `${cat.name} Blogs - Curated Directory | BlogAI`,
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
    sitemapUrls.push({ loc: `${SITE_URL}/category/${cat.slug}`, changefreq: 'weekly', priority: '0.8' });
  }

  // 3. Tags (/tag/:tagSlug)
  for (const t of tags) {
    const tagBlogs = blogs.filter(b => b.tags.some(tagText => tagText.toLowerCase() === t.name.toLowerCase()));
    const tagBody = `
      <header class="site-header">
        <div class="container"><a href="/" class="site-logo"><span class="logo-title">BlogAI</span></a></div>
      </header>
      <main id="main-content">
        <div class="container">
          <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>Tags</li><li>#${escapeHtml(t.name)}</li></ol></nav>
          <h1>#${escapeHtml(t.name)} Blogs</h1>
          <p>Explore ${tagBlogs.length} curated independent publications discussing #${escapeHtml(t.name)}.</p>
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
      title: `#${t.name} Blogs - Topic Directory | BlogAI`,
      description: `Explore ${tagBlogs.length} curated independent publications tagged with #${t.name} in the BlogAI directory.`,
      canonicalUrl: `${SITE_URL}/tag/${t.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Blogs Tagged with #${t.name}`,
        url: `${SITE_URL}/tag/${t.slug}`,
        numberOfItems: tagBlogs.length,
      },
      bodyContent: tagBody,
    });
    writeRouteFile(`/tag/${t.slug}`, tagHtml);
    sitemapUrls.push({ loc: `${SITE_URL}/tag/${t.slug}`, changefreq: 'weekly', priority: '0.6' });
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
      title: `${b.title} - ${b.category} Blog | BlogAI Directory`,
      description: b.description || `Explore ${b.title}, a curated independent blog in ${b.category} covering ${(b.tags || []).join(', ')}.`,
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
    sitemapUrls.push({ loc: `${SITE_URL}/blog/${b.slug}`, changefreq: 'monthly', priority: '0.7' });
  }

  // 5. Submit (/submit)
  const submitHtml = buildHtml({
    template,
    title: 'Submit a Publication | BlogAI Directory',
    description: 'Recommend a high-quality independent blog in engineering, mathematics, physics, science, or automotive tech for inclusion in BlogAI Directory.',
    canonicalUrl: `${SITE_URL}/submit`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Submit a Blog for Review</h1><p>Suggest high-signal publications for inclusion in the directory.</p></div></main>`,
  });
  writeRouteFile('/submit', submitHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/submit`, changefreq: 'monthly', priority: '0.5' });

  // 6. About (/about)
  const aboutHtml = buildHtml({
    template,
    title: 'About the Directory | BlogAI Directory',
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
  sitemapUrls.push({ loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.5' });

  // 7. Guidelines (/guidelines)
  const guidelinesHtml = buildHtml({
    template,
    title: 'Submission Guidelines | BlogAI Directory',
    description: 'Review the editorial and technical quality guidelines for listing blogs in the BlogAI directory.',
    canonicalUrl: `${SITE_URL}/guidelines`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Submission &amp; Quality Guidelines</h1></div></main>`,
  });
  writeRouteFile('/guidelines', guidelinesHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/guidelines`, changefreq: 'monthly', priority: '0.4' });

  // 8. Privacy (/privacy)
  const privacyHtml = buildHtml({
    template,
    title: 'Privacy Policy | BlogAI Directory',
    description: 'Privacy policy for BlogAI Directory: zero tracking, no cookies, and no personal data collection.',
    canonicalUrl: `${SITE_URL}/privacy`,
    bodyContent: `<main id="main-content"><div class="container"><h1>Privacy Policy</h1><p>Zero tracking, no analytics cookies, no personal data resale.</p></div></main>`,
  });
  writeRouteFile('/privacy', privacyHtml);
  sitemapUrls.push({ loc: `${SITE_URL}/privacy`, changefreq: 'yearly', priority: '0.3' });

  // 9. 404 (404.html)
  const notFoundHtml = buildHtml({
    template,
    title: '404 - Page Not Found | BlogAI Directory',
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
    <loc>${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

  // Copy feed.opml to dist/
  const rootOpml = path.join(ROOT_DIR, 'feed.opml');
  if (fs.existsSync(rootOpml)) {
    fs.copyFileSync(rootOpml, path.join(DIST_DIR, 'feed.opml'));
  }

  console.log(`[SUCCESS] Pre-rendered ${sitemapUrls.length + 1} static pages and generated sitemap.xml with ${sitemapUrls.length} canonical URLs.`);
}

runPrerender().catch(err => {
  console.error('[ERROR] Prerender failed:', err);
  process.exit(1);
});
