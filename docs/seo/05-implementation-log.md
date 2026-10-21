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

### Programming and Technology category and Python articles (2026-10-21)

New category `/category/programming-and-technology` (in `sitemap-categories.xml`) and five published Python articles, all with `publishedAt` 2026-10-21:

- `/articles/python-projects-for-beginners` — 25 projects in three levels (1 figure)
- `/articles/python-automation-scripts` — 15 complete office automation scripts, dry run by default (1 figure)
- `/articles/python-libraries-for-machine-learning` — 20 libraries as a learning path, also in Artificial Intelligence (1 figure)
- `/articles/python-interview-questions` — 30 questions with answers (2 figures)
- `/articles/python-web-scraping-techniques` — 10 techniques plus Scrapy, with a legality and politeness section (1 figure)

Details:

- **Code was run before publication.** Every program and snippet was executed in October 2026 (Python 3.13 for libraries, automation, scraping and projects; Python 3.14.3 for the interview answers) and the outputs quoted are real. Scraping examples ran against the toscrape.com practice sites, python.org's `robots.txt` and one blogai.space page. Testing surfaced four version details now explained in the articles: books.toscrape.com sends no charset, so `response.text` mangles "£"; LightGBM 4.7 deprecates `eval_set` for `eval_X`/`eval_y`; MLflow 3.17 refuses the old `./mlruns` file store by default; the Frankfurter `/v1` API is deprecated in favor of `/v2`. urllib3's backoff sequence (0, 2, 4, 8 s) was checked rather than assumed.
- **Facts checked against primary sources:** python.org downloads and PEP 790 (3.15.0 released 2026-10-09), What's New in 3.14 and 3.15, RFC 9309, PyPI release data for every library version quoted (accessed 2026-10-21), Open-Meteo and Frankfurter terms, Google's app-password help page, Project Gutenberg's robot policy. Reddit threads were not reachable directly; community advice is attributed as opinion only.
- **Overlap:** the 20-library article overlaps the existing 100-library guide. It targets "python libraries for machine learning" with a learning-path format, and the 100 guide now links to it. See [02-keywords-content.md](02-keywords-content.md) for this and three smaller overlap decisions.
- **Category membership:** pandas tips, NumPy examples, the 100-library guide and data science projects list Programming and Technology first; Python ML examples, reading engineering blogs and following blogs with RSS list it as a secondary category. Article URLs did not change; `updatedAt` was not bumped, because the text did not change apart from one added link in the 100-library guide.
- **10 directory blogs** in `Categories/Programming and Technology/blogs.csv`: Real Python, Python Insider, Python Software Foundation News, Ned Batchelder, Trey Hunner, Tall Snarky Canadian (Brett Cannon), The Pragmatic Engineer, Dan Luu, Coding Horror, Josh W. Comeau. Each homepage and feed returned 200 with items from 2026 on 2026-10-21. Hynek Schlawack's blog was considered and left out because its newest post was from September 2025.
- **Site copy:** category lists in meta descriptions and hero text now include programming (`index.html`, `SEOHead.jsx`, `Home.jsx`, `Directory.jsx`, `prerender.js`); "mathematics" became "math" and "automotive technology" became "automotive tech" in three descriptions to stay within 160 characters.
- **Test fix:** `src/test/services.test.js` hard-coded 6 categories, which had been stale since the Artificial Intelligence category; it now checks that the category list matches the categories the blogs use.
- **Figures:** 6 SVGs from the new `scripts/diagrams/make_python_diagrams.py`, which reuses the styling of `make_ml_diagrams.py`. The list-versus-set chart is measured with `timeit` on the machine that runs the script; its caption says so.

`npm run ci` passed: CSV lint, 73 of 73 tests, production build (459 pages, 228 sitemap URLs) and `validate_seo.py`. One remaining warning: the directory page title "Python Software Foundation News - Programming and Technology Blog" is 65 characters; the blog's real name was kept.

### AI in industry and work articles with diagrams (2026-10-20)

Five new published articles. No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/ai-transforming-industries-examples` | 25 examples, one or two per industry (what changed, evidence, what to watch); 1 chart. Categories Engineering and Science | 2025-2026 figures checked by web search in October 2026 against company releases, regulators and papers; company figures labeled |
| `/articles/ai-applications-healthcare-finance-education` | 30 applications, 10 per field (what AI does, evidence, limits); 1 chart. Categories Engineering and Science | Trial results taken from the papers' abstracts or institutional releases; DOIs confirmed |
| `/articles/ai-in-business-operations-marketing-sales` | 40 changes in three functions (what changes, evidence, watch out for); 1 diagram | Randomized studies cited by DOI; legal items linked to the ruling or regulator |
| `/articles/ai-use-cases-manufacturing-retail-logistics` | 50 use cases with example, metrics, editorial maturity rating and main risk; 1 diagram | Overlap with the ML applications article handled by pointing to its entry numbers |
| `/articles/ai-future-of-work-examples` | 75 examples in eight groups, each labeled by evidence type (trial, survey, admin data, company figure, forecast, law); 1 chart; short FAQ | Labor-market claims taken from the studies' own pages; predictions labeled as predictions |

- Diagrams: 5 SVG files from `scripts/diagrams/make_ai_diagrams.py`, which reuses the palette and helpers in `make_ml_diagrams.py`. Chart values are copied from the cited sources and printed by the script. Theme colors only, solid fills, no gradients or blue.
- External links (161 unique) checked by script; all 14 DOIs confirmed through the doi.org handle API. Links answering 403 or not connecting (FDA, McKinsey, WEF, SEC, PwC, Axios and others) are bot-blocking responses to scripted requests; each URL came from a search result for that page. Fixed during checks: a Gallup syndication link that had moved, a WGA page that had moved, and a Retail Dive link replaced with another report of the same announcement.
- Corrections made while fact-checking: rentosertib lung-function result described as exploratory; UPS ORION figure aligned with the cited source; Pactum result described as a share of invited suppliers; EU AI Act dates updated after the Digital Omnibus amendment was adopted in 2026.
- Front matter: descriptions 152-158 characters; each H1 keeps the requested "Best" title and has a `seoTitle` without it.
- `machine-learning-applications` now links to the industries and future-of-work articles.
- Checks run: `npm run ci` (lint, data build, article build, 73 tests passed, production build and prerender of 383 pages with 177 sitemap URLs, `validate_seo.py` passed). Browser check with `vite preview` at desktop and 375 px: no horizontal page scroll, figures load, one H1, BlogPosting and BreadcrumbList present.
- Not done: no keyword tool data; Rich Results Test and live checks wait for deployment. Several cited numbers (Waymo rides, FDA device counts, hallucination case counts) change monthly.

### Machine learning articles with diagrams (2026-10-19)

Five new published articles. No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/machine-learning-algorithms-explained` | 100 algorithms in 11 families, each with what / how / when / Python / real-world application; 6 diagrams. Categories Engineering and Mathematics | All 97 runnable snippets executed (scikit-learn 1.9.0, NumPy 2.3.5, PyTorch 2.14 CPU) and their printed output pasted in; 3 snippets needing XGBoost, CatBoost or UMAP are marked "not run". Toy examples whose first version did not show the claimed effect (HMM, LSTM, DQN, MCTS, self-training, word2vec, GAN) were redesigned and the text reports honest results, including where a method did worse |
| `/articles/machine-learning-projects` | 101 project briefs (build, data, approach, evaluate, done when, stretch) in three levels; 4 diagrams | Starter template and leakage demo executed; dataset links checked |
| `/articles/machine-learning-datasets` | 100 datasets in 10 groups with size, use, pitfalls and access terms; 4 diagrams | Sizes and terms taken from providers' pages or papers; changing figures (Common Voice, FineWeb, MovieLens 32M, Re-LAION) checked by web search in October 2026 |
| `/articles/feature-engineering-techniques` | 101 techniques with runnable snippets; 6 diagrams | All 100 runnable snippets executed and output pasted in; 2 marked "not run" because they download a model or weights |
| `/articles/machine-learning-applications` | 100 applications across 13 industries with method, sourced example, limits; 4 diagrams. Categories Engineering and Science | Company-reported figures labeled as such; independent evaluations included where they exist (Epic sepsis model, AlphaChip, METR developer study) |

- Diagrams are 24 SVG files generated by `scripts/diagrams/make_ml_diagrams.py` from fixed-seed scikit-learn toy or synthetic data; alt text and captions quote the numbers the script prints. Palette-only colors (scan found only theme hex values), solid fills, no gradients or blue. Each image has width, height, alt text and `loading="lazy"`.
- External links (505 unique) checked by script. Publisher DOIs refuse automated requests, so all 141 DOIs were confirmed through the doi.org handle API. Fixed: DeepMind blog URL change, ALVINN proceedings URL, ECMWF AIFS page, CoNLL-2003 and AG News access links; the LFW site did not resolve from our network, so the article links to the TensorFlow Datasets mirror instead.
- Front matter: descriptions 149–157 characters; each H1 keeps "Best" and has a `seoTitle` without it.
- Checks run: `npm test` (73 passed), `npm run build` (358 pages, 167 sitemap URLs), `validate_seo.py` (passed, 167 indexable, 191 noindexed). Browser check with `vite preview` at 375 px: no horizontal page scroll, all figures load, one H1, BlogPosting and BreadcrumbList present.
- Not done: no keyword tool data (see the data limits note in 02-keywords-content.md); Rich Results Test and live checks wait for deployment.

### Mathematics articles with diagrams (2026-10-19)

Five new published articles. No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/advanced-mathematics-concepts-with-applications` | 100 concepts in 12 areas, each with applications; 5 diagrams (Fourier series, complex rotation, SIR model, logistic map, shortest path). Categories Mathematics and Science | Toy RSA, Diffie–Hellman, CRT and prime counts recomputed with SymPy; SIR peak and final size from the diagram script's ODE solution; historical and physical claims cited (NIST SP 800-57, Ashby 2003, Clay Institute, cube20.org, original papers by DOI) |
| `/articles/linear-algebra-problems-with-solutions` | 101 problems with collapsible solutions and checks; 5 diagrams | Every answer recomputed with SymPy (RREF, determinants, inverses, LU, eigenvalues, SVD, condition number) |
| `/articles/calculus-formulas-theorems-and-examples` | 100 formulas and theorems with hypotheses and examples; 4 diagrams | Derivatives, integrals, series values and ODE examples recomputed with SymPy |
| `/articles/probability-and-statistics-concepts-for-data-science` | 101 concepts with ML and data-science usage; 5 diagrams | Distribution values, sample sizes, test statistics, AUC and softmax recomputed with SciPy and NumPy; example numbers labelled illustrative |
| `/articles/mathematical-optimization-techniques` | 100 techniques plus a "choosing a technique" table; 5 diagrams. Categories Mathematics and Engineering | Gradient-descent, Newton, LP and dual, assignment and portfolio examples recomputed with NumPy and SciPy (`linprog`, `linear_sum_assignment`) |

- Diagrams are 24 SVG files in `public/images/articles/<slug>/`, generated by `scripts/diagrams/make_math_diagrams.py` (matplotlib) from the same numbers the text uses. They use only theme colors (neutral background, green accent, amber second accent) with solid fills, no gradients and no blue; a scan of the SVGs found only palette hex values. Text is converted to paths so it renders the same everywhere. Each image has descriptive alt text, a caption, explicit width and height to avoid layout shift, and `loading="lazy"`.
- Article bodies embed diagrams as `<figure><img><figcaption>` HTML. `ArticleContent.css` gained `figure` and `figcaption` styles (spacing and secondary text color only).
- `validate_seo.py` now fails the build if a prerendered page has an `<img>` without `alt`, or a site-hosted image missing from `dist/`. Fault-injected once by removing one SVG; the validator reported it.
- H1 titles keep "Best" as requested; each has a `seoTitle` of 60 characters or fewer without it.
- External links checked by script on 2026-10-19. Publisher DOIs refuse automated requests, so each DOI was confirmed through the doi.org handle API. Beezer's textbook moved from `linear.ups.edu` (unreachable) to `linear.pugetsound.edu`.
- Checks run: `npm test` (73 passed), `npm run build` (346 pages, 158 sitemap URLs), `validate_seo.py` (passed). Browser check with `vite preview`: figures load and size correctly at desktop width and at 375 px, no KaTeX errors, one H1 per page, no horizontal page scroll on mobile.

### Food and Nutrition category and articles (2026-10-18)

New directory category **Food and Nutrition** (`/category/food-and-nutrition`) with seven blogs in `Categories/Food and Nutrition/blogs.csv` (The Nutrition Source, Food Politics, Stronger by Science, Precision Nutrition, NutritionFacts.org, Minimalist Baker, Love and Lemons). Each RSS feed was fetched on 2026-10-18 and returned a valid RSS 2.0 document with recent items. Site-wide descriptions (home, directory, submit page, `index.html`, manifest) now mention nutrition, and the category test expects 6 categories.

Five new published articles, all in the Food and Nutrition category. No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/healthy-foods-to-eat-every-day` | 100 foods grouped by food type, with why and how to eat each | Nutrient figures from NIH ODS fact sheets; health claims link to WHO, DGA 2025–2030, Harvard Nutrition Source, NCCIH, FDA, IARC and peer-reviewed studies (Reynolds 2019, PREDIMED 2018, Wastyk 2021) |
| `/articles/high-protein-foods` | 101 foods with protein, kcal and protein per 100 kcal per serving, plus targets and two sample days | Per-100 g values from Health Canada's Canadian Nutrient File API (fetched 2026-10-18), scaled to stated serving weights by script; targets from DGA 2025–2030, Leidy 2015, ISSN 2017, Morton 2018, Schoenfeld and Aragon 2018 |
| `/articles/foods-rich-in-vitamins-and-minerals` | 100 foods with amounts and %DV per serving, grouped by food type | Every amount copied from the food-source tables of 25 NIH ODS fact sheets (extracted 2026-10-18); DV table checked against the FDA Daily Value page |
| `/articles/healthy-meal-ideas` | 34 breakfasts, 34 lunches, 33 dinners, plus meal-prep and food-safety sections | Plate pattern from Harvard and WHO; cooking temperatures and storage times from FoodSafety.gov; no calorie or nutrient numbers per meal, to avoid unverified figures |
| `/articles/nutrition-tips-for-a-balanced-diet` | 100 tips in 12 topic groups | Limits and advice from WHO (Jan 2026 fact sheet), DGA 2025–2030, FDA label, sodium, caffeine and supplement pages, CDC, NIH ODS and WHO Europe (alcohol) |

- H1 titles keep "Best" as requested (the "Lifestylea" typo in the brief was corrected); each has a `seoTitle` without it (60 characters or fewer).
- Each article links to the other four and to `/category/food-and-nutrition`. Each says it is general information, not medical advice, and flags groups who need care (pregnancy, kidney disease, warfarin, mercury, allergies).
- Where guidelines disagree (the 2025–2030 DGA's protein target, full-fat dairy, butter and tallow) the articles state both positions and cite Harvard's critique.
- USDA FoodData Central's API was rate-limited and its bulk download failed, which is why protein values come from the Canadian Nutrient File. Values differ slightly from USDA figures for some foods.
- External links checked on 2026-10-18 with WebFetch or the in-app browser. Fixed: FDA arsenic page (moved), IARC red/processed meat release (old URL 404; now the PDF press release), FDA caffeine wording ("two to three 12-ounce cups", not "four or five"). The NIH ODS pages refuse automated requests and were read in a browser. The DGA PDF downloads but its text could not be extracted here; the figures cited from it are corroborated by realfood.gov, AAFP and Harvard.

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

### Science articles (2026-10-17)

Five new published articles, forming a general-science cluster (Science category). No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/science-facts-that-explain-how-the-world-works` | 100 facts with short explanations, grouped by topic | Figures checked against USGS, NOAA, NASA, NHGRI, IUPAC and Sender et al. (2016, cell counts); estimates are labelled as estimates |
| `/articles/science-experiments-at-home` | 101 household experiments (chemistry, biology, Earth science, weather, sky) with safety rules | Chemistry and biology explanations follow OpenStax; mould and microbe activities are sealed-only; no physics duplicates |
| `/articles/scientific-discoveries-that-changed-the-world` | 100 discoveries in chronological order with who, when and why it mattered | Dates and Nobel years checked against nobelprize.org and agency pages (WHO, NOAA, NHGRI, CERN, LIGO, EHT) |
| `/articles/science-projects-for-students` | 101 project briefs (question, method, skills, extension) in three levels | ISEF rules for human participants, vertebrates, biological agents and hazardous chemicals linked; data sources (NOAA, USGS, NASA, GBIF, USA-NPN, AlphaFold DB, Xeno-canto, HOT) checked |
| `/articles/applications-of-science-in-everyday-life` | 100 applications grouped by setting | Health and safety claims link to CDC, FDA, USDA FSIS, EPA, EIA, UNEP, AirNow and USGS |

- H1 titles keep "Best" as requested; each has a `seoTitle` without it (60 characters or fewer).
- Each article links to the other four, to `/category/science` and to its physics counterpart. The experiments, projects and applications articles say in their introductions that physics topics are covered by the physics cluster, to avoid cannibalisation (see the cannibalisation table in `02-keywords-content.md`).
- The experiments and projects articles state that the activities were not run for the article, and flag adult supervision, human participants, microbes and hazardous chemicals.
- External links checked by script on 2026-10-17. Moved pages were replaced (USDA FSIS botulism page, CDC wastewater page, LIGO detection page); the American Cleaning Institute citation was dropped because it could not be verified. CDC, FSIS, Science Buddies, GBIF and the Exploratorium block automated requests; CDC and FSIS were checked in a browser, and the others are long-standing home or index pages.

### Physics articles (2026-10-17)

Five new published articles, forming a physics cluster (Physics and Science categories; formulas also in Mathematics). No existing URLs changed.

| URL | Format | Verification |
|---|---|---|
| `/articles/physics-concepts-explained-with-examples` | 100 concepts, each with a real-world example, plus common misconceptions | Definitions checked against OpenStax; specific claims link to NASA, NOAA, BIPM, DOE, CDC, ENERGY STAR and Ashby (GPS) |
| `/articles/physics-experiments-at-home` | 101 household experiments with materials, steps and explanation; safety rules up front | Numbers in examples (ruler drop, microwave speed of light, Sun diameter, solar-system scale) recomputed |
| `/articles/physics-formulas-every-student-should-know` | 100 formulas with symbols, units, use conditions and worked examples | Every worked example recomputed in Python; constants from NIST CODATA 2022 |
| `/articles/physics-projects-for-students` | 101 project briefs (question, method, skills, extension) in three levels | Tools and papers (phyphox, Tracker, CosmicWatch, TinyLev, GWOSC, ISEF rules) checked against their sources |
| `/articles/applications-of-physics-in-everyday-life` | 100 applications grouped by setting | Claims about devices link to FDA, NRC, NIH NIBIB, NASA and NOAA pages |

- H1 titles keep "Best" as requested; each has a `seoTitle` without it (60 characters or fewer). Descriptions are 147–157 characters.
- Each article links to the other four, to `/category/physics`, and (formulas, projects) to the math formulas and NumPy articles.
- The experiments and projects articles state that the activities were not run for the article, and mark adult-supervision and qualified-supervision items.
- External links checked by script on 2026-10-17. Moved pages were replaced (DOE LED page, FDA pulse oximeter communication, NRC smoke detector fact sheet, NASA Glenn lift page). Exploratorium, IOP Spark, publisher DOIs and the CDC block automated requests; they were checked in a browser or by their identifiers. STScI/MAST was unreachable from the test network, so the TESS project links to NASA's mission page instead.

### Artificial Intelligence category (2026-10-20)

New category `/category/artificial-intelligence` (in `sitemap-categories.xml`, lastmod 2026-10-20).

- 11 articles now list Artificial Intelligence as their first category: the five AI-in-industry articles and six machine learning articles (`feature-engineering-techniques`, `machine-learning-algorithms-explained`, `machine-learning-applications`, `machine-learning-datasets`, `machine-learning-projects`, `python-machine-learning-examples`). Their earlier categories stay as secondary categories, so Engineering, Science and Mathematics pages keep listing them. Article URLs are `/articles/<slug>` and did not change, so no redirects are needed. `updatedAt` was not changed because the article text did not change.
- 10 directory blogs added in `Categories/Artificial Intelligence/blogs.csv`: Lil'Log, Simon Willison's Weblog, BAIR Blog, Ahead of AI, Import AI, Andrej Karpathy Blog, Interconnects, Google Research Blog, Eugene Yan, Hamel's Blog. Each homepage and feed returned 200 with recent items on 2026-10-20.
- Hardcoded category lists in meta descriptions and hero copy now include AI (`index.html`, `SEOHead.jsx`, `Home.jsx`, `Directory.jsx`, `prerender.js`).
- `npm run dev` and `npm run build` now run `scripts/build_data.py` first (through `scripts/run_build_data.js`), so CSV changes reach the site and sitemap on every Vercel deploy. The header category menu counts articles plus blogs.

`npm test` (73 passed), `npm run build` (409 pages, 199 sitemap URLs) and `validate_seo.py` pass.

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

### GitHub Pages deploy removed (2026-10-17)

Hosting is on Vercel, so `.github/workflows/updateInfo.yml` no longer uploads to or deploys GitHub Pages. The `deploy` job, the Pages artifact upload, the `pages: write` and `id-token: write` permissions, and the `pages` concurrency group were removed. `validate-and-test` still runs on pushes and pull requests to `main`. `verify-live` now runs daily (06:00 UTC) and on manual runs instead of after a Pages deploy, still gated by `SITE_LIVE=true`. Pages itself still has to be unpublished by the owner in repo Settings → Pages.

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
