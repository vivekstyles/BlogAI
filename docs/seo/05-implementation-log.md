# 5. Implementation log, validation and roadmap

## 1. Changes (2026-10-16)

No URLs changed. No articles were deleted, merged, redirected or unpublished. All changes are uncommitted and reviewable with `git diff`.

| Change | Files | Issue |
|---|---|---|
| Shared SEO rules module: `SITE_URL`, title formatting (` \| BlogAI` suffix, dropped above 60 chars), tag, category and blog meta builders, author schema | `src/utils/seo.js` (new) | P1-4, P1-5, P2-8 |
| Pages use the shared module instead of hardcoded domains and titles | `src/pages/{Home,Articles,Directory,Category,TagPage,BlogDetails,About}.jsx`, `src/components/seo/SEOHead.jsx`, `src/utils/articleSchema.js` | P1-4, P2-8 |
| Prerender uses the same builders, so static HTML matches the client | `scripts/prerender.js` | P1-4, P1-5 |
| Tag pages with fewer than 2 items: `noindex, follow`, left out of the sitemap (125 pages) | `src/utils/seo.js`, `scripts/prerender.js`, `src/pages/TagPage.jsx` | P1-3 |
| Sitemap: `lastmod` only from real article dates; `changefreq` and `priority` removed | `scripts/prerender.js` | P2-1 |
| Article bodies split out of the main bundle (`src/data/article-content/<slug>.json`, loaded per article with a loading and error state) | `scripts/build_articles.js`, `src/services/articleService.js`, `src/pages/ArticleDetails.jsx`, `src/pages/ArticleDetails.css` | P1-2 |
| `authorType` frontmatter (Person/Organization); BlogAI Editors marked as Organization | `scripts/build_articles.js`, `content/articles/*.md`, `_template.md` | P1-6 |
| `seoTitle` frontmatter (60 characters or fewer, validated); set for the probability article | `scripts/build_articles.js`, `ArticleDetails.jsx`, `prerender.js`, `probability-statistics-real-world-examples.md` | P1-5 |
| `twitter:card` is `summary` when there is no image | `SEOHead.jsx`, `prerender.js` | P2-3 |
| Prerendered head JSON-LD removed at startup (React re-emits it) | `src/main.jsx` | P2-2 |
| Home description trimmed to fit 160 characters; engineering article description trimmed from 166 to 154 characters | `Home.jsx`, `prerender.js`, `read-engineering-blog-posts-critically.md` | warn |
| Contextual link: RSS article → engineering-reading article | `follow-technical-blogs-with-rss.md` | P2-7 |
| Validator: one-H1 check, broken internal links, sitemap ↔ page consistency (exists, indexable, self-canonical, no duplicates, valid and non-future `lastmod`), required BlogPosting fields, title and description length warnings, missing-from-sitemap warnings, article-to-article link warning | `scripts/validate_seo.py` | §12 automation |
| Tests: shared SEO rules, author schema, split article output, `seoTitle` limit; article routing test now waits for the async body | `src/test/seo.test.js` (new), `src/test/routing.test.jsx` | — |

### Sitemap pass (2026-10-16, later the same day)

| Change | Files |
|---|---|
| `sitemap.xml` is now a sitemap index over `sitemap-{pages,articles,categories,tags,blogs}.xml`; index `lastmod` is the newest child URL; tag `lastmod` comes from tagged articles | `scripts/prerender.js`, `src/utils/seo.js` (`SITEMAP_SECTIONS`) |
| Slashless `route.html` written next to `route/index.html` so canonical URLs answer 200 without a redirect | `scripts/prerender.js` |
| Directory listings without a description: `noindex, follow` and left out of the sitemap (8 pages) | `src/utils/seo.js` (`isBlogIndexable`), `prerender.js`, `src/pages/BlogDetails.jsx` |
| Shared sitemap and robots.txt parser (sitemap namespace, limits, lastmod, robots wildcard matching) | `scripts/sitemap_utils.py` (new) |
| Build validator: index and child sitemaps, cross-sitemap duplicates, robots.txt blocking, slashless and slash copies must match | `scripts/validate_seo.py` |
| Live checker: 200-without-redirect, HTML, no noindex or `X-Robots-Tag`, self-canonical, real 404s | `scripts/check_live_seo.py` (new), `npm run check:live` |
| CI `verify-live` job after deploy, enabled by repository variable `SITE_LIVE=true` | `.github/workflows/updateInfo.yml` |
| Test for listing indexability | `src/test/seo.test.js` |

Fault injection, run once: a noindexed URL, a future `lastmod`, a robots-blocked URL, a URL with no page, and a slashless/slash file mismatch were added to `dist/`. The validator reported all 7 resulting errors.

### Python data science articles (2026-10-17)

Five new published articles, forming a "Python for data science" cluster (Engineering category; NumPy also in Mathematics). No existing URLs changed.

| URL | Format | Code verification |
|---|---|---|
| `/articles/python-libraries-for-data-science` | 100 libraries grouped by task, with a chooser table and starter stacks | 1 snippet run |
| `/articles/python-data-science-projects` | 101 project briefs with public datasets, by level | 1 snippet run |
| `/articles/pandas-tips-and-tricks-for-data-analysis` | 100 tips with code and output | 100 snippets run (pandas 3.0.3, no PyArrow) |
| `/articles/numpy-examples-for-numerical-computing` | 101 examples with code and output | 101 snippets run (NumPy 2.3.5) |
| `/articles/python-machine-learning-examples` | 100 applied examples with code and output | 100 snippets run (scikit-learn 1.9.0) |

- Every code output was produced by executing the snippet (Python 3.13.12) and pasting stdout. No snippet raised an error or warning.
- H1 titles keep "Best" as requested; each has a `seoTitle` without it (60 characters or fewer).
- Each article links to 4–5 related articles with descriptive anchors.
- External links checked by script on 2026-10-17. Three were fixed (a wrong KDnuggets path, Feature-engine and Eurostat URLs). arXiv and some publisher DOIs refused automated requests; those identifiers were checked by hand.
- The ML article uses only scikit-learn's bundled real datasets or clearly labeled synthetic data, and states that its scores are not benchmarks.

### Canonical domain switched to blogai.space (2026-10-17)

The site is served by Vercel at `https://blogai.space`, but canonicals, the sitemap, robots.txt, JSON-LD and Open Graph URLs used `https://blogai.directory`, which does not resolve (P0-1).

| Change | Files |
|---|---|
| `SITE_URL` set to `https://blogai.space` (client, prerender and article build) | `src/utils/seo.js` |
| `SITE_URL` for the build validator and live checker | `scripts/sitemap_utils.py`, `scripts/check_live_seo.py` |
| `Sitemap:` line | `public/robots.txt` |
| Default canonical and `og:url` in the HTML shell | `index.html` |
| Expected canonical in a unit test | `src/test/articles.test.js` |
| Regenerated article data | `src/data/articles.json` |

No URL paths changed, so no redirects are needed. The old domain never resolved, so no search engine indexed it. `npm test` (73 passed), `npm run build` and `npm run validate:seo` pass, and no file in `dist/` or `src/data/` mentions the old domain. The live site keeps the old canonicals until the next Vercel production deploy.

## 2. Validation

Run locally on 2026-10-16:

| Check | Result |
|---|---|
| `npm run build:articles` | 7 published, 1 draft skipped |
| `npm test` | **72 passed** (66 before, plus 6 new) |
| `npm run build` (Vite + prerender) | 226 pages, sitemap with 100 URLs |
| `python scripts/validate_seo.py` | **Passed, 0 errors, 0 warnings** (100 indexable, 126 noindexed) |
| Main JS bundle | 5,976,265 → 357,911 bytes. Article page in the browser transferred 105 KB for the main chunk plus 45 KB for the linear-algebra body |
| Browser check (`vite preview`, `/articles/linear-algebra-concepts-for-machine-learning/`) | Title correct; body renders (16 sections, 342 KaTeX nodes); exactly one BlogPosting and one BreadcrumbList; Organization author; `twitter:card=summary` |
| `/tag/rss/` static HTML | `noindex, follow` |

**Not run:** `npm run test:e2e` (Playwright), Lighthouse or PageSpeed, Rich Results Test, and any live-URL check, because the domain does not resolve (P0-1). The UI did not change apart from the article-body loading placeholder, so the responsive and visual checks in the UI rules were limited to a desktop screenshot of one article page.

**Local preview caveat:** `vite preview` serves the home page HTML for slashless URLs such as `/articles/x`. Production on GitHub Pages behaves differently (P1-1), so verify there.

## 3. 30/60/90-day roadmap

### Days 0–30: get indexed

1. **P0-1 / P0-2:** register or point the domain, confirm Pages deploys, enforce HTTPS.
2. **P1-1:** `curl -I` the slashless and trailing-slash forms of `/articles`, one article, and one tag. Fix canonicals or file layout to remove any redirects.
3. Commit this work; confirm the CI `validate_seo.py` step passes.
4. Verify GSC and Bing; submit the sitemap; request indexing for `/`, `/articles`, and the 7 articles.
5. Record the baseline row in [03-promotion-measurement.md](03-promotion-measurement.md).
6. Run PageSpeed Insights on the algebra article; decide on P2-5.
7. Owner decisions: drop "Best" from titles? Name an author or reviewer (P1-7)?

### Days 31–60: quality and accuracy

1. Scripted re-verification of worked answers in the 5 math articles (SymPy).
2. P2-6: add descriptions for the 8 directory listings that lack them.
3. P2-4: real social image(s).
4. Expand `read-engineering-blog-posts-critically` with real worked examples.
5. Finish or delete the `mathematics-reading-list` draft.
6. First GSC query review: update the keyword map, look for cannibalization, and rewrite descriptions with high impressions and low CTR.

### Days 61–90: grow carefully

1. Write 1 or 2 cluster articles **only where GSC or a keyword tool shows demand** (candidates in [02-keywords-content.md §2](02-keywords-content.md#2-topic-clusters-and-content-gaps)).
2. Build the printable formula sheet as a link asset; start resource-page outreach.
3. P3-3: Atom feed for articles.
4. 90-day review: indexed vs submitted, clicks and impressions trend by section, CWV pass rate. Re-prioritize this tracker.
