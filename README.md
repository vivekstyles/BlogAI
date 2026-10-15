# BlogAI - Curated Community-Driven Technical & Scientific Blog Directory

[![CI/CD Validation & Deployment](https://github.com/iamvi/BlogAI/actions/workflows/updateInfo.yml/badge.svg)](https://github.com/iamvi/BlogAI/actions/workflows/updateInfo.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)

BlogAI is a production-ready, accessible, mobile-responsive, and SEO-optimized community directory designed to help developers, engineers, mathematicians, physicists, and curious minds discover, filter, search, and subscribe to high-signal independent blogs.

---

## Table of Contents

1. [Features & Architecture](#features--architecture)
2. [Directory Structure](#directory-structure)
3. [Prerequisites](#prerequisites)
4. [Quick Start & Development](#quick-start--development)
5. [CSV Schema & Data Model](#csv-schema--data-model)
6. [How to Add a Category or Blog](#how-to-add-a-category-or-blog)
7. [Data Ingestion & OPML Generation](#data-ingestion--opml-generation)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [SEO Architecture & Static Pre-Rendering](#seo-architecture--static-pre-rendering)
10. [Search Architecture & Scaling to 10,000+ Blogs](#search-architecture--scaling-to-10000-blogs)
11. [Community Submission Workflow](#community-submission-workflow)
12. [CI/CD & Deployment Instructions](#cicd--deployment-instructions)
13. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Features & Architecture

- **High-Performance Inverted-Index Search:** Multi-token, whitespace-tolerant, case-insensitive search across title, domain, author, tags, and description with AND boolean logic.
- **Static Site Generation (SSG) / Pre-rendering:** Every route (`/`, `/category/:slug`, `/tag/:slug`, `/blog/:slug`, `/submit`, `/about`, `/guidelines`, `/privacy`, `/404.html`) is pre-rendered with complete semantic HTML, route-specific metadata, canonical URLs, and Schema.org structured data.
- **OPML 2.0 Subscription Export:** Single-click export of the entire directory (`feed.opml`) for import into modern RSS readers (NetNewsWire, Feedly, NewsBlur).
- **Accessible & Responsive:** Meets WCAG 2.2 AA standards with visible focus rings, minimum 44px tap targets, `prefers-reduced-motion` compliance, screen-reader landmarks, and mobile navigation drawer.
- **Theme Toggle:** Dark and Light mode support with automatic system preference detection and localStorage persistence.
- **Deterministic Pipeline:** Zero runtime discrepancies—Python ingestion parses CSVs, verifies URLs, catches duplicate domains, computes tag frequency indexes, and produces bit-identical JS/JSON artifacts.

---

## Directory Structure

```text
BlogAI/
├── public/
│   ├── favicon.svg                # Scalable brand icon
│   ├── robots.txt                 # Search engine crawling rules & sitemap declaration
│   └── manifest.webmanifest       # PWA manifest
├── src/
│   ├── app/
│   │   ├── App.jsx                # Root layout with header, main landmark, router, footer
│   │   ├── router.jsx             # Code-split lazy routes (Category, Tag, Blog, etc.)
│   │   └── providers.jsx          # Context and router wrappers
│   ├── components/
│   │   ├── layout/                # Header, Footer, Navigation, Breadcrumbs
│   │   ├── blogs/                 # BlogCard, BlogList, BlogGrid, BlogMetadata, FeedLink, Pagination
│   │   ├── search/                # SearchBar, SearchFilters, SortSelector, EmptyState
│   │   ├── categories/            # CategoryNav, CategoryCard
│   │   ├── tags/                  # TagChip
│   │   └── seo/                   # SEOHead, JsonLd
│   ├── pages/
│   │   ├── Home.jsx               # Discovery home, showcase cards, directory grid
│   │   ├── Category.jsx           # Category-specific directory with unique introduction
│   │   ├── BlogDetails.jsx        # Publication details, RSS actions, related publications
│   │   ├── TagPage.jsx            # Tag-specific topic directory
│   │   ├── SubmitBlog.jsx         # Community submission form with duplicate checks
│   │   ├── About.jsx              # Project mission and OPML guide
│   │   ├── Guidelines.jsx         # Inclusion and quality standards
│   │   ├── Privacy.jsx            # Zero-tracking privacy commitment
│   │   └── NotFound.jsx           # Accessible 404 page with search fallback
│   ├── hooks/
│   │   ├── useSearch.js           # Debounced search & multi-filter manager
│   │   ├── useDebounce.js         # Generic debounce hook
│   │   └── usePagination.js       # Dynamic page windowing with auto-reset
│   ├── services/
│   │   ├── blogService.js         # Central data query provider & mock moderation queue
│   │   └── searchService.js       # Fast inverted token index engine
│   ├── utils/
│   │   ├── slugify.js             # NFKD diacritic-safe URL slug generator
│   │   ├── normalizeText.js       # Whitespace & domain extractor
│   │   └── validation.js          # URL format and duplicate validation
│   ├── data/
│   │   ├── blogs.js / blogs.json
│   │   ├── categories.js / categories.json
│   │   └── tags.js / tags.json
│   ├── styles/
│   │   ├── variables.css          # Design tokens & dark theme palette
│   │   ├── global.css             # Base reset, typography, accessible buttons
│   │   └── responsive.css         # Media queries and grid breakpoints
│   └── main.jsx
├── Categories/
│   ├── Engineering/blogs.csv
│   ├── Mathematics/blogs.csv
│   ├── Physics/blogs.csv
│   ├── Science/blogs.csv
│   └── Automobile/blogs.csv
├── scripts/
│   ├── linter.py                  # Strict CSV validator
│   ├── build_data.py              # Ingestion pipeline & OPML generator
│   ├── prerender.js               # Post-build static route prerenderer
│   └── validate_seo.py            # Automated production SEO & metadata validator
├── tests/
│   └── e2e/
│       └── directory.spec.js      # Playwright end-to-end tests
├── .github/workflows/
│   └── updateInfo.yml             # Automated CI validation & GitHub Pages deployment
├── feed.opml                      # Validated OPML 2.0 RSS subscription outline
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js:** v18.0.0 or later (tested on v20 and v24)
- **npm:** v9.0.0 or later
- **Python:** v3.10 or later (uses Python standard library exclusively; zero external pip dependencies needed)

---

## Quick Start & Development

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/iamvi/BlogAI.git
   cd BlogAI
   npm install
   ```

2. **Lint CSV files and generate data:**
   ```bash
   npm run lint:csv
   npm run build:data
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run unit & integration tests:**
   ```bash
   npm test
   ```

5. **Build and pre-render production release:**
   ```bash
   npm run build
   ```

6. **Validate generated SEO files (titles, sitemap, robots, JSON-LD):**
   ```bash
   npm run validate:seo
   ```

---

## CSV Schema & Data Model

The single source of truth for the directory is stored in `Categories/<CategoryName>/blogs.csv`.

### Full Schema (Recommended)

| Column Name | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| **Title** | Yes | Official name of the publication | `Martin Fowler` |
| **Address** | Yes | Canonical root URL (HTTP/HTTPS) | `https://martinfowler.com/` |
| **RSS feed** | Yes | Valid XML syndication URL | `https://martinfowler.com/feed.atom` |
| **Tags** | Yes | Semicolon or comma-separated tags | `architecture; refactoring; agile` |
| **Description** | Optional | 1–3 sentence editorial summary | `Essays on software architecture and patterns.` |
| **Author** | Optional | Author or engineering team | `Martin Fowler` |
| **Language** | Optional | ISO language code (default `en`) | `en` |
| **Website status** | Optional | Verification status (`active`) | `active` |

### Legacy Format Support

Older CSV files containing only `Title,Address,RSS feed,Tags` are fully supported without breaking older data or dropping columns.

---

## How to Add a Category or Blog

### Adding a New Blog to an Existing Category

1. Open `Categories/<CategoryName>/blogs.csv`.
2. Add a new row following the schema:
   ```csv
   Distributed Labs,https://distlabs.example.com/,https://distlabs.example.com/feed.xml,"distributed systems;raft;storage",In-depth research on consensus protocols.,Alice Doe,en,active
   ```
3. Run `npm run lint:csv` to verify there are no URL errors or duplicate entries.
4. Run `npm run build:data` to regenerate `src/data/` and `feed.opml`.

### Adding a New Category

1. Create a new folder under `Categories/`:
   ```bash
   mkdir Categories/Biology
   ```
2. Create `Categories/Biology/blogs.csv` with the header row and initial publications.
3. Optionally add a description mapping in `CATEGORY_DESCRIPTIONS` in `scripts/build_data.py`.
4. Run `npm run build:data`. The pipeline automatically discovers new category folders and builds corresponding category pages, tags, and OPML outlines!

---

## Data Ingestion & OPML Generation

The automated pipeline (`scripts/build_data.py`):
1. Traverses all subdirectories in `Categories/`.
2. Parses each `blogs.csv` with strict validation.
3. Normalizes whitespace, URL trailing slashes, and tags.
4. Detects duplicates based on canonicalized domains.
5. Computes category metrics and tag frequency distributions.
6. Outputs deterministic JSON and ES module files:
   - `src/data/blogs.json` / `blogs.js`
   - `src/data/categories.json` / `categories.js`
   - `src/data/tags.json` / `tags.js`
7. Generates `feed.opml` in standard OPML 2.0 XML with category outlines.
8. Writes machine-readable `scripts/validation_report.json`.

---

## Testing & Quality Assurance

Our test suite covers the complete application stack:

- **Unit & Integration Tests (`npm test`):**
  - CSV parsing and edge cases in `scripts/linter.py`.
  - Slug stability and NFKD diacritic stripping in `src/utils/slugify.js`.
  - Inverted index tokenization, case-insensitivity, and AND matching in `src/services/searchService.js`.
  - Pagination boundary handling and state synchronization in `src/hooks/usePagination.js`.
  - Component accessibility, label associations, and event firing in `src/test/components.test.jsx`.
  - Complete router navigation, dynamic category/tag filtering, submission validation, and 404 handling in `src/test/routing.test.jsx`.
- **Production SEO Audit (`npm run validate:seo`):**
  - Confirms all 200+ generated pages in `dist/` have unique titles, unique meta descriptions, absolute canonical tags, Open Graph tags, and valid JSON-LD schemas.
  - Verifies `sitemap.xml` format and `robots.txt` directives.
- **End-to-End Tests (`npm run test:e2e`):**
  - Playwright browser tests verifying search filtering, category pill navigation, detail views, and community submission forms.

---

## SEO Architecture & Static Pre-Rendering

Client-only SPAs suffer from weak indexing, missing previews in social cards, and crawl-budget penalties. BlogAI resolves this through static site generation (SSG) via `scripts/prerender.js`:

1. **Pre-rendered HTML Files:** Every category (`dist/category/<slug>/index.html`), tag (`dist/tag/<slug>/index.html`), and blog (`dist/blog/<slug>/index.html`) is generated on disk with complete markup inside `<div id="root">`.
2. **Dynamic Metadata:** Each page has customized `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:title`, `og:description`, `og:url`, and Twitter cards.
3. **Structured Data:** Safely escaped JSON-LD scripts are injected:
   - `WebSite` with `SearchAction` on the homepage.
   - `CollectionPage` on category and tag listings.
   - `Blog` on individual publication details pages.
   - `AboutPage` on the about page.
4. **Crawlability:** All internal links use clean standard `<a href="...">` anchor tags, providing search engine crawlers with an unbroken link graph.
5. **XML Sitemap & Robots:** Automatically generated `dist/sitemap.xml` lists all canonical URLs. `public/robots.txt` instructs crawlers while disallowing infinite search parameter query spaces.

---

## Search Architecture & Scaling to 10,000+ Blogs

For smaller datasets, linear string matching is sufficient. As directories grow to tens of thousands of publications:

- **Current Implementation:** BlogAI uses an in-memory inverted token index (`searchService.js`). Tokens are pre-indexed across title, domain, author, tags, and description. Search lookups run in sub-millisecond time (`O(tokens)`) with set intersections.
- **Scaling Pathway:**
  - **1,000 - 10,000 Blogs:** Inverted index runs inside a dedicated Web Worker (`searchWorker.js`), ensuring zero UI thread blocking during keystrokes.
  - **10,000+ Blogs:** Transition to Pagefind or serverless indexing (Algolia / Meilisearch / Cloudflare Workers KV) without altering the frontend `SearchBar` or `SearchFilters` component APIs.

---

## Community Submission Workflow

1. Users visit `/submit` and enter blog details (Title, URL, RSS, Category, Tags, Description).
2. The form validates URL schemes, checks against the existing dataset for duplicate domains, and enforces length limits.
3. When submitted in client mode, the item is safely validated and queued into local moderation storage (`blogai_moderation_queue`) with a clear message explaining that submissions are reviewed before publishing.
4. Contributors are also prompted to submit via GitHub Pull Request directly to `Categories/<Category>/blogs.csv`.

---

## CI/CD & Deployment Instructions

The repository includes a GitHub Actions workflow (`.github/workflows/updateInfo.yml`):

1. Checks out repository.
2. Installs dependencies (`npm ci`).
3. Runs strict CSV linter (`python scripts/linter.py`).
4. Rebuilds data and verifies determinism (`git diff --exit-code src/data/ feed.opml`).
5. Runs Vitest unit & integration test suite (`npm test`).
6. Builds Vite bundle and executes pre-rendering (`npm run build`).
7. Executes production SEO validation (`python scripts/validate_seo.py`).
8. Deploys artifact to **GitHub Pages**.

### Deploying to Other Platforms

- **Cloudflare Pages:** Set Build Command to `npm run build` and Build Output Directory to `dist`.
- **Vercel / Netlify:** Set Build Command to `npm run build` and Output Directory to `dist`. SPA fallback is supported via `dist/404.html`.

---

## Troubleshooting & FAQ

- **PowerShell Script Execution Restriction:**
  If PowerShell blocks running `npm` or `npx`, use `npm.cmd` and `npx.cmd`.
- **Data Not Updating:**
  Run `npm run build:data` to rebuild JavaScript and JSON artifacts from CSV sources.
- **Lint Failures:**
  Run `python scripts/linter.py` to identify the exact file, row number, and column that failed validation.
