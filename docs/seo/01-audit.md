# 1. Website SEO audit

Audit date: 2026-10-16. Sources: repository at commit `480d3e2`, `npm run build` output in `dist/`, `curl` and `nslookup` against the live hosts.

## 1. How the site is built

| Area | Finding | Evidence |
|---|---|---|
| Stack | React 19 + Vite 6 single-page app, React Router 7, deployed to GitHub Pages by `.github/workflows/updateInfo.yml` | `package.json`, workflow |
| Rendering | Client-rendered, plus **static prerendering**: `scripts/prerender.js` writes one HTML file per route with title, description, canonical, Open Graph, JSON-LD, and crawlable body HTML (full article text included) | `dist/articles/*/index.html` contains the whole article |
| Hydration | `createRoot` replaces the prerendered body; nothing is hidden from crawlers that do not run JS | `src/main.jsx` |
| Articles | Markdown + YAML frontmatter in `content/articles/`, compiled by `scripts/build_articles.js` (KaTeX at build time, heading anchors, TOC, related articles and blogs). Drafts never reach the output | `scripts/build_articles.js` |
| Directory | 44 external blogs from `Categories/*/blogs.csv` → `src/data/blogs.json` | `scripts/build_data.py` |
| Sitemap / robots | Generated `dist/sitemap.xml`; static `public/robots.txt` with `Sitemap:` line | `dist/` |
| Validation | `scripts/validate_seo.py` already ran in CI before this work | workflow step "Validate SEO metadata" |

Verdict on rendering: **no SSR migration is needed.** Prerendering already ships complete, crawlable HTML for every route. The remaining rendering risk is the host's URL handling (P1-1), not React.

## 2. Inventory

Counts from the build on 2026-10-16, after the changes in [05-implementation-log.md](05-implementation-log.md).

| Page type | Route | Pages | Indexable | In sitemap |
|---|---|---|---|---|
| Home | `/` | 1 | yes | yes |
| Articles listing | `/articles` | 1 | yes | yes |
| Article | `/articles/:slug` | 7 | yes | yes |
| Directory | `/directory` | 1 | yes | yes |
| Category | `/category/:slug` | 5 | yes | yes |
| Tag, 2+ items | `/tag/:slug` | 37 | yes | yes |
| Tag, 1 item | `/tag/:slug` | 125 | **noindex, follow** | no |
| Blog listing detail | `/blog/:slug` | 44 | yes | yes |
| Static | `/submit`, `/about`, `/guidelines`, `/privacy` | 4 | yes | yes |
| 404 | `404.html` | 1 | noindex | no |
| **Total** | | **226** | **100** | **100** |

### Published articles

| Slug | Title (H1) | Words* | Category | Published |
|---|---|---|---|---|
| `algebra-problems-with-solutions-for-beginners` | 150 Best Algebra Problems With Solutions for Beginners | 6,809 | Mathematics | 2026-10-16 |
| `math-tricks-to-solve-problems-faster` | 101 Best Math Tricks to Solve Problems Faster | 8,659 | Mathematics | 2026-10-16 |
| `probability-statistics-real-world-examples` | 100 Best Probability and Statistics Examples for Real-World Applications | 6,001 | Mathematics | 2026-10-16 |
| `linear-algebra-concepts-for-machine-learning` | 101 Best Linear Algebra Concepts for Machine Learning and AI | 5,649 | Mathematics, Engineering | 2026-10-16 |
| `math-formulas-every-student-should-know` | 100 Best Mathematics Formulas Every Student Should Know | 4,717 | Mathematics | 2026-10-16 |
| `read-engineering-blog-posts-critically` | How to Read an Engineering Blog Post Critically | 474 | Engineering | 2026-10-16 |
| `follow-technical-blogs-with-rss` | How to Follow Technical Blogs with RSS and OPML | 563 | Engineering | 2026-10-14 |

\* `wordCount` from the build, which excludes math and code. Draft not published: `mathematics-reading-list`.

## 3. Prioritized issue tracker

Status key: **Fixed** = implemented and validated locally in this pass. **Open** = needs the owner or external access.

### P0 — Critical

| ID | Issue | Evidence | Fix | Status | Validation |
|---|---|---|---|---|---|
| P0-1 | **Canonical domain does not resolve.** All 100 canonicals, the sitemap, robots.txt and JSON-LD point at `https://blogai.directory`, which has no DNS record. The GitHub Pages fallback URL also returns 404. Nothing can be crawled or indexed. | `nslookup blogai.directory` → Non-existent domain; `curl https://vivekstyles.github.io/BlogAI/` → 404 | Owner decision: (a) register `blogai.directory`, point DNS at GitHub Pages, set the custom domain in repo Settings → Pages, and enable "Enforce HTTPS"; or (b) choose another domain. Hosting under the `/BlogAI/` project path would also need a Vite `base` change and router `basename`, so a custom domain (apex or subdomain) is much simpler. The domain is now one constant, `SITE_URL` in `src/utils/seo.js`, plus `public/robots.txt` and `SITE_URL` in `scripts/validate_seo.py`. | **Open: owner** | `curl -I https://<domain>/` returns 200; GSC property verified |
| P0-2 | Deployment unverified: Pages may not be enabled, or the workflow may never have deployed. | Same 404 | Check repo Settings → Pages (source: GitHub Actions) and the latest workflow run | **Open: owner** | Actions run shows a `deploy` job URL |

### P1 — High

| ID | Issue | Evidence | Fix | Status |
|---|---|---|---|---|
| P1-1 | **Trailing-slash redirects on GitHub Pages.** Routes are written as `route/index.html`. GitHub Pages answers `/articles` with a 301 to `/articles/`, but every canonical, sitemap URL and internal link uses the version without the slash, so every indexable URL would redirect. | Prerender output layout; local `vite preview` serves the home page for slashless URLs | Verify on the live host first. If the redirect happens, either switch canonicals, sitemap and internal links to trailing-slash URLs everywhere, or emit `route.html` files for slashless URLs (GitHub Pages serves `/x` from `x.html`) | **Open: verify after P0-1** |
| P1-2 | **5.4 MB of article bodies in the main JS bundle.** Every page, including home, downloaded all article HTML (5.98 MB JS, 441 KB gzipped). That hurts LCP and INP everywhere. | `dist/assets/index-*.js` 5,976,265 bytes | Article bodies are now split into `src/data/article-content/<slug>.json` and loaded per article | **Fixed**: main bundle 358 KB (105 KB transferred) |
| P1-3 | **125 thin tag pages indexed.** 125 of 162 tag pages list exactly one item, so each is a near-duplicate of the blog or article it links to. | Count from `tags.json` + article tags | `noindex, follow` + sitemap exclusion below 2 items (`TAG_INDEX_MIN_ITEMS`); links stay crawlable | **Fixed** |
| P1-4 | **Static and client metadata disagreed.** Category and tag titles and descriptions in the prerendered HTML differed from what React set after load, so Google's rendered view contradicted the HTML. | e.g. `Mathematics Blogs - Curated Directory \| BlogAI` (static) vs `… \| BlogAI Directory` (client) | Shared builders in `src/utils/seo.js` used by both | **Fixed** |
| P1-5 | **Long titles.** The ` \| BlogAI Directory` suffix pushed 6 of 7 article titles over 60 characters (up to 90). | Build output | Suffix shortened to ` \| BlogAI` and dropped when it would exceed 60. Optional `seoTitle` frontmatter for long H1s | **Fixed** |
| P1-6 | **Article author marked up as a Person.** "BlogAI Editors" is an editorial team, so `Person` markup is inaccurate. | `articleSchema.js` | `authorType` frontmatter (`Person` default, `Organization` for teams) | **Fixed** |
| P1-7 | **No named author or reviewer on YMYL-adjacent math content.** "BlogAI Editors" gives readers no way to judge expertise. | Frontmatter | Owner: add a real author or reviewer with a bio page if one exists. Do not invent one | **Open: owner** |

### P2 — Medium

| ID | Issue | Fix | Status |
|---|---|---|---|
| P2-1 | Sitemap `lastmod` was the build date for 218 of 225 URLs, so it changed on every deploy and gave crawlers no real signal. `changefreq` and `priority` are ignored by Google. | `lastmod` only from real article dates; `changefreq` and `priority` removed | **Fixed** |
| P2-2 | JSON-LD duplicated: the prerendered `<head>` copy stayed after React rendered its own, and went stale after client navigation. | `src/main.jsx` removes the head copies before rendering | **Fixed** |
| P2-3 | `twitter:card` was `summary_large_image` on pages without an image. | `summary` unless an image exists | **Fixed** |
| P2-4 | No Open Graph image anywhere, so social shares show no preview. | Owner: create a real 1200×630 site image and per-article images, then set `image` / `imageAlt` frontmatter | **Open** |
| P2-5 | Heavy article pages: the algebra page is about 1.9 MB of HTML, because KaTeX `htmlAndMathml` output roughly doubles math markup. The client also re-downloads the body that the static HTML already contained. | Options: render MathML-only for repeated inline math, paginate the 150-problem page into 2 or 3 parts, or reuse the prerendered DOM. Measure LCP and INP on the live URL before choosing | **Open** |
| P2-6 | 8 of 44 directory listings have no description, so `/blog/:slug` falls back to a generated sentence (thin page). | Owner: add real descriptions in the CSVs, or noindex listings without one | **Open** |
| P2-7 | `RSS` article had no link to another article. | Contextual link added to `read-engineering-blog-posts-critically` | **Fixed** |
| P2-8 | Hardcoded domain in 10 files. | Centralized in `src/utils/seo.js` (JS); robots.txt and the validator still hold their own copy | **Fixed** (JS) |

### P3 — Planned

| ID | Item |
|---|---|
| P3-1 | Content gaps and cluster expansion ([02-keywords-content.md §2](02-keywords-content.md#2-topic-clusters-and-content-gaps)) |
| P3-2 | `WebSite` `SearchAction` markup is harmless but no longer used by Google (sitelinks search box retired in late 2024); remove whenever it is convenient |
| P3-3 | RSS/Atom feed for first-party articles (the site promotes RSS but publishes no feed of its own) |
| P3-4 | Category pages for Physics, Science and Automobile have directory listings but no articles |

## 4. Checked and fine

- One `<h1>` per prerendered page (now enforced by the validator).
- The 404 page is `noindex`; not-found states inside the app set `noindex, follow`.
- robots.txt allows everything except parameterized search and pagination URLs, which carry canonicals anyway.
- Internal links use real `<a href>` elements; no broken internal links in `dist/` (now enforced).
- Breadcrumb JSON-LD matches the visible breadcrumbs on article pages.
- Article and Breadcrumb structured data contain only facts shown on the page. No ratings, reviews or invented dates.
- Images in article Markdown get `loading="lazy"` and require alt text in frontmatter. No article currently has images.
- Drafts are excluded from the bundle, prerendered pages and sitemap.
- Existing math articles link to each other contextually (each links to the other four).
