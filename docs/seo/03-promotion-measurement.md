# 3. Promotion and measurement

## 1. Ethical promotion and link earning

Do none of these until P0-1 (live domain) is fixed. Links to a dead domain are wasted.

| Tactic | Concrete action | Why someone would link | Effort |
|---|---|---|---|
| Linkable assets | Printable PDF formula sheet built from the formulas article; an interactive "check your algebra answer" page if it can be built honestly | Teachers and tutors link to free printable resources | M |
| Resource pages | Find university and teacher pages that list "algebra practice resources" or "math for ML reading"; suggest the article only where it fits the list | Fills a real gap on their list | M |
| Directory reciprocity, done honestly | Tell the 44 listed blog owners they are listed (once, no link request). Some will mention or link the directory | They are featured | S |
| OPML collection | The curated `feed.opml` is useful to developers on its own; share it where "what blogs do you follow?" threads are on-topic | Saves readers time | S |
| Communities | r/learnmath, r/MachineLearning, Hacker News, Math Stack Exchange: **read each community's self-promotion rules first.** Share only when answering a question the article actually answers, and disclose that it is your site | Answers a real question | S, ongoing |
| Newsletter / RSS | Publish an Atom feed for first-party articles (P3-3) so readers and aggregators can subscribe | Subscription and syndication | S |
| Corrections and updates | When an article is meaningfully updated, bump `updatedAt` and note what changed | Keeps references current | S |

**Never:** buy links, use PBNs, exchange links in bulk, post AI-generated guest posts, automate comments, or post promotional links where a community's rules forbid it.

## 2. Measurement

### Setup (after launch)

1. **Google Search Console:** domain property for the live domain, verified by DNS TXT record. Submit `https://<domain>/sitemap.xml`.
2. **Bing Webmaster Tools:** import from GSC.
3. **Analytics:** the privacy policy promises *"zero tracking, no cookies"*. Any analytics must keep that promise: use cookieless, aggregate-only tooling (for example self-hosted Plausible or Umami, or GSC data alone), or update the privacy policy first. GSC needs no on-site tracking.
4. **Core Web Vitals:** GSC Core Web Vitals report (field data, needs traffic) plus PageSpeed Insights on the home page, `/directory`, and the heaviest article (`algebra-problems-…`).

### Dashboard specification

| Level | Metric | Source | Cadence | Caveat |
|---|---|---|---|---|
| Site | Indexed vs submitted URLs (target: about 100 indexed, 125 tag pages "Excluded by noindex") | GSC Pages report | Weekly | Indexing of a new domain takes weeks |
| Site | Clicks, impressions, CTR, average position | GSC Performance | Weekly, compared over 28 days | Average position is impression-weighted; read it per query, not site-wide |
| Category | Same, filtered by page URL prefix (`/articles/`, `/category/`, `/blog/`, `/tag/`) | GSC | Monthly | — |
| Article | Top queries per URL; queries that map to the "wrong" URL (cannibalization signal) | GSC Performance → Pages → Queries | Monthly | — |
| Article | Engaged visits, scroll depth or time on page | Cookieless analytics, if adopted | Monthly | Only if the privacy policy allows it |
| Technical | CWV pass rate, crawl errors, 404s, redirects | GSC | Weekly | — |
| Links | New and lost referring domains | GSC Links report (sampled) | Monthly | GSC link data is incomplete |
| Action | Clicks on "Visit website" and RSS links | Cookieless analytics events | Monthly | Optional |

### Baseline

**There is no baseline yet**, because the site has never been reachable at its canonical domain. Record these on day 1 after launch and keep them in this file:

| Date | Indexed | Impressions (28d) | Clicks (28d) | CWV good URLs | Referring domains |
|---|---|---|---|---|---|
| _launch day_ | | | | | |

Compare in 28-day windows against the previous window. Allow for GSC's 2–3 day data delay and for normal search volatility.
