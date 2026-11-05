# GOOGLE_SEARCH_RULES.md — Google Search Central rules for BlogAI

Technical rules taken from Google Search Central documentation (https://developers.google.com/search/docs/), as they apply to this React + Vite site. They complement `SEO-STRATEGY-RULES/rules.md`, which covers content, keywords and process.

Every rule names how it is checked. **Auto** rules fail `python scripts/validate_seo.py` on the production build. **Live** rules are checked by `python scripts/check_live_seo.py` against the deployed site. **Manual** rules need a person, Search Console or a Google testing tool.

## 0. How to run these rules

Run all of these after any change to routes, metadata, structured data, robots.txt, sitemaps, `index.html`, `scripts/prerender.js`, `scripts/build_articles.js`, `src/utils/seo.js`, `src/utils/articleSchema.js` or `src/components/seo/`:

```bash
npm run ci
```

That runs the CSV linter, data and article builds, unit tests, the production build with prerendering, `validate_seo.py`, and `test_validate_seo.py` (which proves the validator still catches each rule's violation).

After a deploy reaches https://blogai.space:

```bash
npm run check:live
```

Rules for the agent:

1. Never mark SEO work done while `validate_seo.py` reports an error. Warnings may stay, but name them in the report.
2. If a rule below cannot be met, say which rule, why, and what the owner must do. Do not weaken a check to make it pass.
3. When adding a new Google requirement, add an Auto check to `scripts/validate_seo.py` where possible, add a failing case to `scripts/test_validate_seo.py`, and list it here.
4. Use only Google's current documentation as the source. Do not invent requirements, limits or ranking effects.

## 1. Crawling and rendering

| ID | Rule | Check |
|---|---|---|
| G1.1 | Every indexable page ships its title, description, canonical, robots meta, JSON-LD and main content in the prerendered HTML, not only after JavaScript runs. | Auto (one `<h1>` in the prerendered body; metadata present in `dist/` HTML) |
| G1.2 | robots.txt must not block the CSS or JS files that pages load. | Auto |
| G1.3 | robots.txt declares `Sitemap: https://blogai.space/sitemap.xml`. | Auto |
| G1.4 | Internal links are real `<a href>` elements that resolve to a generated page or file. | Auto |
| G1.5 | Every sitemap URL answers 200 directly, with no redirect, as HTML. | Live |
| G1.6 | Unknown URLs answer a real 404, not a soft 200. | Live |
| G1.7 | `www` and `http` variants redirect permanently (301/308) to `https://blogai.space`. | Manual (`curl -I`) |

## 2. Indexing controls and canonicals

| ID | Rule | Check |
|---|---|---|
| G2.1 | Every indexable page has one absolute `https://blogai.space` canonical, and no two indexable pages share one. | Auto |
| G2.2 | The 404 page and not-found states declare no canonical and no `og:url` (`canonicalPath={null}` in `SEOHead`). | Auto (404.html); unit-tested in the client |
| G2.3 | The 404 page is `noindex`. Indexable routes never carry `noindex` by accident. | Auto |
| G2.4 | Thin pages (tag pages under `TAG_INDEX_MIN_ITEMS`, directory listings without a description) are `noindex, follow` and left out of the sitemap. | Auto |
| G2.5 | The slashless and trailing-slash files for a route are identical, so both declare the same canonical. | Auto |
| G2.6 | Indexable pages are not blocked by robots.txt, because Google cannot see a `noindex` or canonical on a blocked page. | Auto |
| G2.7 | Live pages carry no `noindex` in meta or `X-Robots-Tag`, and declare themselves canonical. | Live |

## 3. Sitemaps

| ID | Rule | Check |
|---|---|---|
| G3.1 | `/sitemap.xml` is a valid sitemap index; child sitemaps are valid, not nested, and within protocol limits. | Auto |
| G3.2 | Sitemaps list only indexable, self-canonical, robots-allowed URLs with a generated page, each once. | Auto |
| G3.3 | `lastmod` comes only from real content dates, is well-formed and never in the future. Each index entry's `lastmod` equals the newest URL in that child sitemap. | Auto |
| G3.4 | Image sitemap entries point at files that exist. | Auto |
| G3.5 | Submit `https://blogai.space/sitemap.xml` in Search Console and watch the Pages report. | Manual (owner) |

## 4. Titles, descriptions and page basics

| ID | Rule | Check |
|---|---|---|
| G4.1 | Every page has a non-empty `<title>` and meta description. Indexable pages do not share titles or descriptions. | Auto |
| G4.2 | Titles and descriptions never contain `undefined`, `null` or `NaN`. | Auto |
| G4.3 | Titles over 60 characters and descriptions outside 70–160 characters are reported. These are display guidelines, not ranking rules. | Auto (warning) |
| G4.4 | Every page has `<html lang>` and `<meta name="viewport">` (Google indexes the mobile version). | Auto |
| G4.5 | Images in content have `alt` text, and site-hosted images exist. | Auto |
| G4.6 | Articles link contextually to at least one other article, with descriptive anchor text. | Auto (warning) |
| G4.7 | Raster favicons exist (`favicon.ico`, 96×96 PNG, apple-touch-icon); SVG alone is not enough for Google Search. | Auto |

## 5. Social metadata

| ID | Rule | Check |
|---|---|---|
| G5.1 | Every page has `og:title` and `og:description`; every page except 404 has `og:url`. | Auto |
| G5.2 | `og:image`, `twitter:image`, `twitter:card` and `og:url` appear at most once per page. | Auto |
| G5.3 | `twitter:card` is `summary_large_image` only when the page has its own image. The default image is the 512×512 logo, which takes `summary`. | Auto |

## 6. Structured data

| ID | Rule | Check |
|---|---|---|
| G6.1 | All JSON-LD parses and has `@context` and `@type`. | Auto |
| G6.2 | A page has at most one JSON-LD block of each `@type`. | Auto |
| G6.3 | The home page has `WebSite` with `name` and `url` = `https://blogai.space/` (site names), and `Organization` with a raster `logo` of at least 112×112. | Auto |
| G6.4 | `BlogPosting` has `headline`, `datePublished` and `author`. An `Organization` author has a `url`. `dateModified` is not earlier than `datePublished`. | Auto |
| G6.5 | `BlogPosting.image` shows the article, never the site logo. Leave `image` out rather than use the logo. | Auto |
| G6.6 | `BreadcrumbList` has at least two items, positions 1..n, a name on each, and absolute URLs. It matches the visible breadcrumbs. | Auto (structure); Manual (match) |
| G6.7 | Markup describes only what is visible on the page. Never invent authors, ratings, reviews or dates. | Manual |
| G6.8 | Check new markup types with the Rich Results Test or Schema Markup Validator before relying on them. Valid markup does not guarantee a rich result. | Manual |

## 7. Links to other sites

| ID | Rule | Check |
|---|---|---|
| G7.1 | Directory listings are vetted by the owner before publishing, so their links stay followed. If unvetted user-submitted links are ever published, mark them `rel="ugc"` (or `nofollow`). | Manual |
| G7.2 | Paid or sponsored links, if any are ever added, carry `rel="sponsored"`. | Manual |

## 8. Owner actions (outside the codebase)

- Verify the domain in Google Search Console (DNS record on Vercel, or the meta tag placeholder in `index.html`).
- Submit the sitemap and request indexing for new articles.
- Watch Page indexing, Core Web Vitals and Enhancements reports. Do not report Search Console data that was not actually retrieved.
