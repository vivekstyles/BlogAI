# SEO program — BlogAI

Started 2026-10-16. Every finding here was checked against the repository, the production build (`dist/`), or a live request. No search volume, difficulty, traffic or ranking numbers appear anywhere in these docs, because no keyword tool, Google Search Console or analytics source is connected.

## Read this first

**The site is not live at its canonical domain.** `blogai.directory` returns NXDOMAIN (checked 2026-10-16), and `https://vivekstyles.github.io/BlogAI/` returns 404. Every canonical tag, sitemap URL and structured-data URL points at `blogai.directory`. Until that domain resolves and serves `dist/`, no on-page work can produce search traffic. See P0-1 in [01-audit.md](01-audit.md).

## Documents

| # | Deliverable | Where | Status |
|---|---|---|---|
| 1 | Website SEO audit | [01-audit.md](01-audit.md) | Done |
| 2 | Inventory of articles and indexable pages | [01-audit.md §2](01-audit.md#2-inventory) | Done |
| 3 | Keyword-to-URL map | [02-keywords-content.md §1](02-keywords-content.md#1-keyword-to-url-map) | Done (qualitative; no volume data) |
| 4 | Topic clusters and content gaps | [02-keywords-content.md §2](02-keywords-content.md#2-topic-clusters-and-content-gaps) | Done |
| 5 | Technical SEO issue tracker | [01-audit.md §3](01-audit.md#3-prioritized-issue-tracker) | Done |
| 6 | Per-article recommendations | [02-keywords-content.md §4](02-keywords-content.md#4-per-article-recommendations) | Done |
| 7 | Internal-linking map | [02-keywords-content.md §5](02-keywords-content.md#5-internal-linking-map) | Done |
| 8 | Competitor / SERP analysis | [02-keywords-content.md §3](02-keywords-content.md#3-serp-and-competitor-snapshot) | Partial: sampled results, not Google |
| 9 | Backlink and promotion plan | [03-promotion-measurement.md §1](03-promotion-measurement.md#1-ethical-promotion-and-link-earning) | Done |
| 10 | Measurement spec and baseline | [03-promotion-measurement.md §2](03-promotion-measurement.md#2-measurement) | Spec done; baseline needs GSC after launch |
| 11 | Pre-publication checklist | [04-publishing-checklist.md](04-publishing-checklist.md) | Done |
| 12 | Automated checks | `scripts/validate_seo.py`, `scripts/build_articles.js`, `src/test/seo.test.js` | Done, already in CI |
| 13 | Implementation log | [05-implementation-log.md](05-implementation-log.md) | Done |
| 14 | Post-implementation validation | [05-implementation-log.md §2](05-implementation-log.md#2-validation) | Done (local build; live checks wait for launch) |
| — | XML sitemaps, robots.txt, Search Console setup | [06-sitemap.md](06-sitemap.md) | Done; live check waits for launch |
| 15 | 30/60/90-day roadmap | [05-implementation-log.md §3](05-implementation-log.md#3-306090-day-roadmap) | Done |

## Commands

```bash
npm run ci
```

That runs the CSV linter, data and article builds, unit tests, the production build with prerendering, and `validate_seo.py`. The GitHub Actions workflow runs the same steps on every push and pull request.

After each deploy (once the domain is live), check the live sitemap URLs:

```bash
npm run check:live
```
