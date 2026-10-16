# SEO_STRATEGY_RULES.md

## 1. Core SEO Principles

1. Optimize every page for users first and search engines second.
2. Never guarantee first-page rankings, a specific ranking position, or a particular amount of organic traffic.
3. Base SEO decisions on evidence, search intent, website data, and relevant competitor analysis.
4. Never fabricate keyword volumes, keyword difficulty, traffic estimates, backlinks, rankings, citations, or search performance data.
5. Preserve existing functionality, design, routes, and content unless a change is necessary and authorized.
6. Every indexable page must have a clear purpose and provide genuine value.
7. Avoid keyword stuffing, mass-generated low-quality pages, doorway pages, and unnecessary duplication.
8. Treat SEO as a continuous process: research, implement, validate, measure, and improve.
9. Inspect the existing project and URL structure before implementing SEO changes.
10. Document significant changes and validate them before considering them complete.

## 2. React + Vite Technical SEO

1. Use the existing React + Vite architecture unless there is a demonstrated technical reason to change it.
2. Ensure important article content, headings, links, metadata, and structured data are discoverable by search engines.
3. Evaluate client-side rendering limitations for every important public content route.
4. Prefer static generation or prerendering for content-heavy pages when practical. Consider server-side rendering if required by the project's needs.
5. Do not assume that adding metadata through client-side JavaScript alone guarantees reliable indexing.
6. Ensure every important URL can be loaded directly, including after a browser refresh.
7. Return appropriate HTTP status codes. Missing pages must not incorrectly return successful status codes when the hosting architecture can support proper 404 responses.
8. Keep titles, descriptions, canonical URLs, robots directives, and structured data unique and accurate for each route.
9. Avoid rendering duplicate metadata when navigating between React routes.
10. Ensure the production build, hosting configuration, and routing fallback work correctly.

## 3. URL and Routing Rules

1. Every public article must have a stable, descriptive, unique URL.
2. Use readable lowercase URL slugs separated by hyphens.
3. Avoid unnecessary query parameters, session IDs, and tracking parameters in canonical URLs.
4. Do not change existing public URLs without assessing SEO impact and defining appropriate permanent redirects.
5. Ensure every canonical URL points to the preferred version of the page.
6. Prevent duplicate pages caused by trailing slashes, alternate route formats, URL parameters, or multiple paths to the same content.
7. Use consistent URL patterns for articles, categories, tags, and external blog-directory entries.
8. Do not automatically index every tag, search result, filter combination, or pagination state.
9. Index category and tag pages only when they offer useful, distinct content and are intended to appear in search results.
10. Keep navigation links crawlable and use descriptive anchor text.

## 4. Mandatory sitemap.xml Rules

1. Maintain a valid XML sitemap at `/sitemap.xml`.
2. In a Vite application, use `public/sitemap.xml` for a static sitemap or implement a reliable build-time sitemap generator.
3. Generate the sitemap from the actual published content and routing data rather than maintaining a separate, easily outdated list of URLs.
4. Include eligible canonical, indexable, publicly accessible URLs that return successful responses.
5. Include relevant article pages, useful category pages, and other valuable landing pages intended for indexing.
6. Exclude redirects, error pages, duplicate URLs, private pages, development routes, and pages marked `noindex`.
7. Use absolute canonical HTTPS URLs for production.
8. Keep the sitemap synchronized with article creation, publication, URL changes, and removal.
9. Set `lastmod` only when the page has genuinely changed in a meaningful way. Never update all dates simply because the sitemap was rebuilt.
10. Use a sitemap index and multiple sitemaps when the number or type of URLs makes that appropriate. Follow current search-engine sitemap limits.
11. Reference the sitemap URL in `robots.txt`.
12. Validate XML syntax, URL accessibility, canonical consistency, and indexability.
13. Ensure staging, localhost, preview, and development URLs never appear in the production sitemap.
14. If sitemap generation fails, make the build or validation pipeline report the failure rather than silently publishing an incorrect sitemap.
15. Provide instructions for submitting the sitemap in Google Search Console and monitoring discovered URLs.

## 5. robots.txt and Indexing Rules

1. Maintain a valid production `robots.txt`.
2. Do not block essential CSS, JavaScript, or other resources needed to render public pages.
3. Never accidentally block the entire website or important article sections.
4. Understand that `robots.txt` crawling restrictions are not equivalent to a `noindex` directive.
5. Do not rely on `robots.txt` alone to remove a URL from search results.
6. Keep private content protected through authentication and authorization, not merely through robots directives.
7. Use `noindex` selectively for pages that should not appear in search results.
8. Do not include `noindex` URLs in the XML sitemap.
9. Check for conflicting robots directives, canonical tags, HTTP headers, and sitemap entries.
10. Verify important pages using live URLs and available Search Console indexing reports.

## 6. Keyword Research and Search Intent

1. Research keywords before creating or substantially rewriting an article.
2. Assign each article one primary topic and a clearly defined search intent.
3. Identify relevant secondary terms, long-tail queries, related concepts, and user questions.
4. Determine whether the query is informational, navigational, commercial, or transactional.
5. Match the content format to the actual intent shown by search results and audience needs.
6. Use reliable keyword tools and search data when available.
7. Clearly distinguish verified metrics from estimates and qualitative assessments.
8. Do not target keywords solely because they have high estimated search volume.
9. Consider relevance, competition, business value, audience fit, and the ability to produce a genuinely useful page.
10. Maintain a keyword-to-URL map to prevent multiple articles from unnecessarily competing for the same search intent.
11. Check existing content before proposing a new article targeting a similar topic.
12. Revisit keyword targets when search behavior or the content landscape changes.

## 7. Content Quality Rules

1. Write original, accurate, useful content that addresses the reader's actual problem.
2. Provide a clear answer to the main question early in the article.
3. Use descriptive headings and a logical H1, H2, and H3 hierarchy.
4. Include practical examples, evidence, explanations, and actionable guidance where relevant.
5. Cite authoritative sources for claims that require verification.
6. Verify mathematical formulas, calculations, technical examples, statistics, and time-sensitive information.
7. Never invent sources, expert quotations, studies, survey results, or personal experiences.
8. Avoid superficial rewrites of competing articles.
9. Do not expand content merely to reach a target word count.
10. Add FAQs only when they answer meaningful questions not already addressed adequately.
11. Display author information and publication or update dates accurately.
12. Update articles when facts, recommendations, software behavior, or source information materially changes.
13. Keep external references relevant, credible, and useful.
14. Do not claim that an article is based on original research unless the research was actually conducted.
15. Review AI-assisted content for accuracy, originality, usefulness, and editorial quality before publication.

## 8. On-Page SEO Rules

1. Give every indexable page a unique, descriptive title.
2. Write a useful meta description that accurately represents the page.
3. Include the primary topic naturally in the title, introduction, or relevant headings when appropriate.
4. Avoid keyword stuffing and arbitrary keyword density requirements.
5. Use a single clear primary H1 for article pages.
6. Use descriptive, human-readable URLs.
7. Add relevant internal and authoritative external links.
8. Optimize images with descriptive filenames, appropriate dimensions, and useful alt text when the image conveys information.
9. Use empty alt text for decorative images when appropriate.
10. Add appropriate canonical tags and robots directives.
11. Provide useful Open Graph metadata for social sharing.
12. Use descriptive link text rather than generic text such as "click here" whenever practical.
13. Do not duplicate the same title or description across unrelated pages.
14. Do not promise that a particular title length or meta description length guarantees rankings or display behavior.

## 9. Internal Linking and Topic Clusters

1. Organize related articles into meaningful topic clusters.
2. Create pillar pages only when they provide a useful overview of a topic.
3. Link supporting articles to relevant pillar pages and related articles.
4. Add contextual links that genuinely help readers continue learning.
5. Identify and resolve orphaned articles where appropriate.
6. Use descriptive, natural anchor text.
7. Avoid excessive exact-match anchor text and automated links unrelated to page content.
8. Maintain breadcrumbs when useful for navigation.
9. Verify that important articles are reachable through crawlable internal links.
10. Audit internal links after changing slugs, removing articles, or restructuring categories.

## 10. Structured Data Rules

1. Use schema.org structured data only when it accurately describes visible page content.
2. Use suitable types such as `Article` or `BlogPosting` for eligible articles.
3. Implement `BreadcrumbList` when appropriate.
4. Use accurate author, headline, publication date, modification date, and image properties.
5. Use the correct canonical page URL and publisher information.
6. Do not invent reviews, ratings, credentials, or other unsupported properties.
7. Validate structured data with Google's current testing tools and documentation.
8. Remember that valid structured data does not guarantee a rich result or higher ranking.
9. Add structured data to the HTML rendered for the relevant route.
10. Keep structured data synchronized with the actual article.

## 11. Performance, Mobile, and Accessibility

1. Ensure pages work across mobile, tablet, and desktop devices.
2. Optimize images, fonts, JavaScript bundles, and unnecessary third-party scripts.
3. Avoid blocking rendering with unnecessary resources.
4. Measure real performance when field data is available.
5. Use Google's current Core Web Vitals guidance, including LCP, INP, and CLS.
6. Use semantic HTML, accessible navigation, visible focus states, and meaningful image descriptions.
7. Ensure article content remains readable without unnecessary animation or interaction.
8. Lazy-load appropriate below-the-fold images without delaying the main content image unnecessarily.
9. Avoid layout shifts caused by images, advertisements, or dynamically inserted components.
10. Recheck performance after major UI, dependency, or routing changes.

## 12. First-Party Articles vs. External Blog Directory

Maintain a clear distinction between first-party articles and external blog-directory entries.

### First-party articles

- Host the full article on the website.
- Provide unique content, a stable canonical URL, appropriate metadata, and suitable structured data.
- Include articles in the sitemap when they are published and indexable.
- Link to related articles and authoritative sources.
- Do not publish placeholder or incomplete articles as finished content.

### External blog-directory entries

- Clearly identify the original blog or publisher.
- Link to the original source using the correct external URL.
- Do not create indexable thin pages that simply repeat a title, feed URL, or short description.
- Index directory detail pages only when they provide meaningful, distinct value to visitors.
- Do not canonicalize a first-party article to an unrelated external article.
- Avoid duplicating full external article content without permission.

## 13. Search Performance Monitoring

1. Use Google Search Console when access is available.
2. Track clicks, impressions, CTR, average position, indexing, and relevant query-to-page performance.
3. Use analytics data to understand meaningful reader actions and organic traffic.
4. Establish a baseline before significant SEO changes.
5. Compare suitable time periods and account for seasonality and reporting delays.
6. Investigate pages with meaningful impressions but low CTR.
7. Review relevant pages ranking near the first page for opportunities to improve content and usefulness.
8. Investigate sudden traffic drops before making large-scale changes.
9. Do not interpret average position as an exact, universal ranking for every user.
10. Never fabricate Search Console, analytics, backlink, or ranking data.
11. Maintain a record of important SEO changes and their dates.
12. Avoid repeatedly rewriting pages before sufficient evidence is available to evaluate changes.

## 14. Backlink and Promotion Rules

1. Prioritize earning relevant, editorially justified backlinks.
2. Create useful resources, original research, tools, and reference materials that merit citations.
3. Promote content through relevant communities and professional channels where sharing is permitted.
4. Use personalized, truthful outreach.
5. Do not buy manipulative links or participate in private blog networks.
6. Avoid mass spam, automated comments, fake engagement, and link exchanges designed to manipulate rankings.
7. Respect platform policies, editorial requirements, and community rules.
8. Track outreach and referring-domain data only when reliable information is available.

## 15. Automated SEO Validation

Run appropriate checks during the build or publishing process.

Validate:

- Production build success.
- Required metadata for indexable routes.
- Unique titles and descriptions where applicable.
- Canonical URL consistency.
- Sitemap XML validity and URL eligibility.
- `robots.txt` accessibility and configuration.
- Broken internal links.
- Invalid or missing route handling.
- Structured data validity.
- Image alt text and obvious asset failures.
- Redirects and accidental duplicate URLs.
- Article publication status and sitemap synchronization.

Distinguish blocking errors from warnings. Do not fail publication for subjective recommendations unless explicitly configured to do so.

## 16. Prioritization and Change Management

Use this priority system:

- **P0 — Critical:** Indexing or crawlability failures.
- **P1 — High:** Significant problems affecting important pages or search intent.
- **P2 — Medium:** Meaningful content, metadata, internal-linking, or performance improvements.
- **P3 — Planned:** Longer-term content expansion and authority-building opportunities.

For every significant recommendation, document its evidence, affected URLs, expected benefit, confidence, implementation effort, and validation method.

Before making changes:

1. Inspect the relevant code and content.
2. Identify dependencies and potential SEO risks.
3. Preserve a reviewable version of existing content.
4. Avoid destructive changes without authorization.

After making changes:

1. Run relevant tests and production builds.
2. Inspect generated HTML and metadata.
3. Validate affected routes and sitemap entries.
4. Document completed and outstanding work.
5. Report any limitations caused by missing tools, data, or access.

## 17. Definition of Done

An SEO task is complete only when:

- The change addresses an identified requirement or evidence-backed problem.
- Existing functionality remains intact.
- Relevant technical and content checks pass.
- The affected URLs and metadata are validated.
- Sitemap and indexing behavior remain correct.
- Changes are documented.
- Remaining risks and external dependencies are disclosed.

The overall objective is to build a technically accessible, useful, trustworthy, and maintainable website whose content can earn relevant organic search visibility over time.
