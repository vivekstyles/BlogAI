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
