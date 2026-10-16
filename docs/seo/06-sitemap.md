# 6. XML sitemaps and robots.txt

## How it works

The sitemaps are generated on every `npm run build` by `scripts/prerender.js`, from the same data that builds the pages (`src/data/articles.json`, `blogs.json`, `categories.json`, `tags.json`). Publishing an article (`status: published`) adds it on the next build; switching it back to `draft` removes it. Nothing is maintained by hand.

```
https://blogai.space/robots.txt
  └─ Sitemap: https://blogai.space/sitemap.xml          ← sitemap index
       ├─ sitemap-pages.xml       home, /articles, /directory, /submit, /about, /guidelines, /privacy
       ├─ sitemap-articles.xml    first-party articles
       ├─ sitemap-categories.xml  category pages
       ├─ sitemap-tags.xml        tag pages with 2+ items
       └─ sitemap-blogs.xml       directory listing pages with a real description
```

**Why an index at about 92 URLs?** The 50,000-URL limit is far away. The split exists so Search Console reports *submitted vs indexed* separately for each section. When indexing drops, you can see whether articles or directory listings are affected. The index stays at `/sitemap.xml`, so the URL in robots.txt and Search Console never changes.

## Inclusion rules

A URL is listed only if it is meant to be found in search. The build applies these rules, and `validate_seo.py` fails the build if a listed URL breaks one.

| Page | Listed when | Excluded (and why) |
|---|---|---|
| Article | `status: published` and canonical is this site | Drafts (never built); articles with an external `canonical` (the original is the indexable copy) |
| Tag | 2 or more articles + blogs | 1-item tags: `noindex, follow` near-duplicates (125 pages) |
| Directory listing `/blog/:slug` | The CSV row has a description | Rows without one: the page would be generated filler, so it is `noindex, follow` (currently the 8 Automobile listings). Adding a description to the CSV re-includes it automatically |
| Category, static pages, home, listings | Always | — |
| 404, unknown routes, `?q=` / `?page=` URLs | Never | Error page; parameter URLs are blocked in robots.txt and canonicalize to the clean URL |

Every listed URL is absolute HTTPS on `https://blogai.space`, has no trailing slash, and matches the page's own `<link rel="canonical">`.

## `lastmod` policy

`lastmod` is emitted **only where a real content date exists**:

- article → its `updatedAt` (bump it only for meaningful edits; see the checklist);
- `/articles`, home → newest article `updatedAt`;
- category and tag pages → newest `updatedAt` among their articles;
- each child sitemap in the index → the newest `lastmod` inside it.

Directory listings and static pages have no tracked modification date, so they carry no `lastmod`. That is better than a build date that changes on every deploy, which teaches Google to ignore the field. A known limitation: when a category or tag page changes only because a directory blog was added, its `lastmod` does not move.

## No redirects: slashless URLs return 200

GitHub Pages answers `/about` with a 301 to `/about/` when only `about/index.html` exists, which would turn every sitemap URL into a redirect. The prerender now writes **both** `about.html` (serves `/about` with 200) and `about/index.html` (serves `/about/`, whose canonical points back to `/about`). The validator fails the build if the two copies ever differ.

Tested on 2026-10-16 with `check_live_seo.py` against local servers:

| Server model | Result |
|---|---|
| Directory-only static server (`python -m http.server`) | 91 of 92 URLs 301 to a trailing slash: this is the failure mode, and the checker reports it |
| GitHub Pages-style lookup (file → `.html` → directory) | **92 of 92 URLs return 200**; unknown URLs return 404 |

GitHub Pages' exact precedence for `/articles`, where both `articles.html` and `articles/` exist, can only be confirmed on the live host. That is the first thing to check after launch.

## Validation

| When | Command | Checks |
|---|---|---|
| Every build (CI) | `npm run validate:seo` | Valid XML and namespace; index → child files exist; no nested indexes; protocol limits (50k URLs, 50 MB); absolute production URLs; no duplicates within or across sitemaps; valid, non-future `lastmod`; index `lastmod` equals the newest child URL; every URL has a generated page that is indexable, self-canonical and allowed by robots.txt; robots.txt declares the index; warns about indexable pages missing from the sitemaps |
| After deploy | `npm run check:live` (or `python scripts/check_live_seo.py --base <origin>`) | Fetches robots.txt and all sitemaps from the live site; every URL must return **200 without a redirect**, be HTML, carry no `noindex` meta or `X-Robots-Tag`, and declare itself canonical; unknown URLs must return a real 404 |
| CI after deploy | `verify-live` job | Runs `check_live_seo.py` after each deploy to `main`. **Disabled until the domain is live:** set the repository variable `SITE_LIVE=true` (Settings → Secrets and variables → Actions → Variables) |

## robots.txt

`public/robots.txt` allows all crawling except search and pagination parameter URLs, and declares `Sitemap: https://blogai.space/sitemap.xml`. No change was needed. Do not list the child sitemaps there; the index covers them.

## Submitting and monitoring in Google Search Console

Prerequisite: the domain resolves and `npm run check:live` passes (P0-1 in [01-audit.md](01-audit.md)).

1. **Add the property.** In Search Console → Add property → **Domain** → `blogai.space`, then add the TXT record it gives you at your DNS provider and click Verify. A Domain property covers http/https and all subdomains.
2. **Submit the index.** Go to Indexing → Sitemaps → enter `sitemap.xml` → Submit. Submit only the index; Search Console discovers the five child sitemaps from it and lists each one.
3. **Confirm it was read.** Within a day, the status should be **Success**, with the discovered URL count matching the build log (`… and 92 canonical URLs` today). "Couldn't fetch" means the file is not reachable at that URL; check it with `curl -I`.
4. **Bing.** In Bing Webmaster Tools, choose Import from Google Search Console, or submit the same `sitemap.xml`.
5. **Request indexing** with URL Inspection for the home page and the 7 articles. This is optional; the sitemap is enough over time.

Do **not** use the retired "sitemap ping" endpoints; Google ignores them. Search Console re-reads a submitted sitemap periodically, and `lastmod` tells it what changed.

### Weekly monitoring

| Where | What to check | Action if wrong |
|---|---|---|
| Indexing → Sitemaps | Each child sitemap shows **Success** and the expected URL count | Count dropped unexpectedly: check the last build log and diff of `content/` or the CSVs |
| Indexing → Pages, filtered by sitemap (dropdown at the top: "All submitted pages" or one child sitemap) | Indexed vs not indexed per section | See the reasons below |
| "Page with redirect" for submitted URLs | Should be **0** | Run `npm run check:live`; it names the redirecting URLs |
| "Excluded by 'noindex' tag" for submitted URLs | Should be **0** (noindex pages are never listed) | A build bug: `validate_seo.py` should have failed |
| "Duplicate, Google chose different canonical" | Investigate per URL | Usually near-duplicate thin pages; improve or noindex them |
| "Crawled / Discovered – currently not indexed" | Normal for a new site at first; track the trend | If articles stay here after 4–6 weeks, look at content quality and internal links |
| "Not found (404)" | Should list only deleted URLs | A URL was removed without a redirect; decide whether to add one |
| Experience → Core Web Vitals | Article URLs in "Good" | See P2-5 (heavy article pages) |

The baseline table in [03-promotion-measurement.md](03-promotion-measurement.md#baseline) should record the Sitemaps report's submitted and indexed counts on launch day.
