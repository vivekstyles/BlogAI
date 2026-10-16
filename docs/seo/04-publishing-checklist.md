# 4. Pre-publication SEO checklist

Use this for every new or substantially updated article in `content/articles/`. **[auto]** items are enforced by the build (`npm run ci`) and fail it. **[warn]** items are reported by `validate_seo.py` but do not fail. Everything else needs a human.

## Before writing

- [ ] Audience and their level are written down in one sentence.
- [ ] Search intent chosen (informational, navigational, commercial, transactional) and the format fits it: practice set, reference, how-to, or explainer.
- [ ] One primary keyword plus a few secondary and question queries are chosen and added to [02-keywords-content.md §1](02-keywords-content.md#1-keyword-to-url-map).
- [ ] **Overlap check:** no existing article targets the same primary query. If one comes close, differentiate the intent or update that article instead of writing a new one.
- [ ] The article offers something the current results lack (worked solutions, proofs, runnable code, original data). Write that down; it becomes the description.

## Frontmatter

- [ ] `title` (the H1) is accurate. Avoid unsupported superlatives such as "Best" unless the article actually compares options.
- [ ] `seoTitle` set if `title` + " | BlogAI" is over 60 characters and a shorter version reads better. **[auto]** `seoTitle` is 60 characters or fewer.
- [ ] `description` is 120–160 characters, summarizes the actual content, and leads with the unique value. **[warn]** outside 70–160.
- [ ] `slug` is short, lowercase, hyphenated, and will never change. **[auto]** unique.
- [ ] `author` is a real person or the editorial team; `authorType` is `Person` or `Organization`. **[auto]** valid value.
- [ ] `publishedAt` stays fixed; `updatedAt` changes only for meaningful edits. **[auto]** YYYY-MM-DD, and updated is not earlier than published.
- [ ] `categories` exist. **[auto]**
- [ ] `image` set only if a real image exists; `imageAlt` describes it. **[auto]** alt required with image.
- [ ] `canonical` set **only** if the article was first published elsewhere. **[auto]** absolute https. Articles with external canonicals stay out of the sitemap. **[auto]**

## Body

- [ ] The first paragraph answers the reader's main question or says exactly what the page gives them.
- [ ] Headings use `##` and `###` only; the title is the only H1. **[auto]** one `<h1>` per page.
- [ ] Use `tocDepth: 2` for long numbered lists.
- [ ] Every formula, calculation, statistic, date and code output has been checked. Math is re-derived and code is re-run with the output pasted in. **[auto]** LaTeX must parse.
- [ ] Facts that need evidence link to a primary or authoritative source; illustrative numbers are labeled as illustrative.
- [ ] No invented quotes, statistics, authors or dates.
- [ ] 2–5 contextual links to genuinely related articles, with descriptive anchors. **[warn]** no article link at all. **[auto]** internal links resolve.
- [ ] External links go to sources, not competitors' SEO pages. They open in a new tab automatically.
- [ ] FAQ section only if readers really ask those questions; no FAQ schema.
- [ ] Tables and code blocks stay readable on a 320 px screen. Tables scroll inside their own container automatically.

## Release

- [ ] `status: published`.
- [ ] `npm run ci` passes. That covers article build, unit tests, production build and prerender, and `validate_seo.py` (unique titles, descriptions and canonicals; JSON-LD validity and required BlogPosting fields; sitemap ↔ page consistency; no future `lastmod`; no broken internal links).
- [ ] Generated files are committed: `src/data/articles.json`, `src/data/article-content/*.json`. CI fails if they are stale.

## After deploy

- [ ] `curl -sI https://<domain>/articles/<slug>` returns 200 with no redirect (see P1-1).
- [ ] The page source contains the full article text, the canonical, and BlogPosting JSON-LD.
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) shows valid Article and Breadcrumb markup.
- [ ] GSC URL Inspection → Request indexing.
- [ ] After 4 weeks, check the article's queries in GSC and update the keyword map.
