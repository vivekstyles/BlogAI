#!/usr/bin/env python3
"""
scripts/validate_seo.py - Production SEO & Metadata Validator
Validates the generated dist/ folder.

Errors (exit code 1):
- Missing or duplicate <title>, meta description, or canonical URL on indexable pages
- Canonical URLs that are not absolute production URLs
- Missing Open Graph tags (og:title, og:description, og:url)
- Invalid JSON-LD, or BlogPosting markup without headline, datePublished, or author
- Accidental noindex on indexable pages; missing noindex on the 404 page
- Prerendered pages without exactly one <h1>
- Internal links in prerendered HTML that do not resolve to a generated page or file
- sitemap.xml that is invalid, lists URLs with no generated page, lists noindexed pages,
  lists URLs whose page canonicalizes elsewhere, or has malformed or future lastmod dates
- robots.txt without the sitemap directive; invalid feed.opml

Warnings (reported, do not fail the build):
- Titles longer than 60 characters, descriptions outside 70-160 characters
- Indexable, self-canonical pages missing from the sitemap
- Article pages without any contextual link to another article
"""

import datetime
import json
import re
import sys
import xml.etree.ElementTree as ET
from html import unescape
from pathlib import Path
from typing import Dict, List, Optional

SITE_URL = "https://blogai.directory"
TITLE_MAX = 60
DESC_MIN, DESC_MAX = 70, 160


def meta_content(content: str, attr: str, name: str) -> Optional[str]:
    match = re.search(
        rf'<meta\s+{attr}=["\']{re.escape(name)}["\']\s+content=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE
    )
    return unescape(match.group(1).strip()) if match else None


def route_for(rel_path: str) -> str:
    """dist-relative file path -> site path ('articles/x/index.html' -> '/articles/x')."""
    if rel_path == "index.html":
        return "/"
    if rel_path.endswith("/index.html"):
        return "/" + rel_path[: -len("/index.html")]
    return "/" + rel_path


def resolve_internal(dist_dir: Path, href: str) -> bool:
    path = href.split("#", 1)[0].split("?", 1)[0]
    if path in ("", "/"):
        return (dist_dir / "index.html").exists()
    target = dist_dir / path.lstrip("/")
    return target.is_file() or (target / "index.html").is_file()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    root_dir = Path(__file__).resolve().parent.parent
    dist_dir = root_dir / "dist"

    print("Running production SEO audit on dist/...")

    if not dist_dir.exists():
        print(f"[ERROR] dist directory '{dist_dir}' not found. Run 'npm run build' first.")
        sys.exit(1)

    errors: List[str] = []
    warnings: List[str] = []
    seen_titles: Dict[str, str] = {}
    seen_descriptions: Dict[str, str] = {}
    seen_canonicals: Dict[str, str] = {}
    # site path -> {"indexable": bool, "canonical": str}
    pages: Dict[str, Dict] = {}
    total_pages = 0

    html_files = sorted(dist_dir.glob("**/*.html"))
    if not html_files:
        errors.append("No HTML files found in dist directory.")

    for html_file in html_files:
        total_pages += 1
        rel_path = html_file.relative_to(dist_dir).as_posix()
        try:
            content = html_file.read_text(encoding="utf-8")
        except Exception as e:
            errors.append(f"[{rel_path}] Could not read file: {e}")
            continue

        is_404 = rel_path == "404.html"
        robots = meta_content(content, "name", "robots") or ""
        is_noindex = "noindex" in robots.lower()
        # Noindexed pages (404, thin tag pages) may share boilerplate; uniqueness only matters for indexable ones
        check_unique = not is_noindex

        # 1. Title validation
        title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
        if not title_match or not title_match.group(1).strip():
            errors.append(f"[{rel_path}] Missing or empty <title> tag.")
        else:
            title = unescape(title_match.group(1).strip())
            if check_unique:
                if title in seen_titles:
                    errors.append(f"[{rel_path}] Duplicate <title> '{title}' matches {seen_titles[title]}.")
                else:
                    seen_titles[title] = rel_path
                if len(title) > TITLE_MAX:
                    warnings.append(f"[{rel_path}] Title is {len(title)} characters (> {TITLE_MAX}): '{title}'")

        # 2. Meta description validation
        desc = meta_content(content, "name", "description")
        if not desc:
            errors.append(f"[{rel_path}] Missing or empty <meta name=\"description\">.")
        elif check_unique:
            if desc in seen_descriptions:
                errors.append(f"[{rel_path}] Duplicate description matches {seen_descriptions[desc]}.")
            else:
                seen_descriptions[desc] = rel_path
            if not DESC_MIN <= len(desc) <= DESC_MAX:
                warnings.append(f"[{rel_path}] Description is {len(desc)} characters (aim for {DESC_MIN}-{DESC_MAX}).")

        # 3. Canonical URL validation
        canon_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE)
        canon = canon_match.group(1).strip() if canon_match else ""
        if not canon:
            errors.append(f"[{rel_path}] Missing or empty <link rel=\"canonical\">.")
        else:
            if not canon.startswith(SITE_URL):
                errors.append(f"[{rel_path}] Canonical URL '{canon}' must be absolute and use production domain.")
            if check_unique:
                if canon in seen_canonicals:
                    errors.append(f"[{rel_path}] Duplicate canonical URL '{canon}' matches {seen_canonicals[canon]}.")
                else:
                    seen_canonicals[canon] = rel_path

        # 4. Open Graph validation
        for og_prop in ["og:title", "og:description", "og:url"]:
            if f'property="{og_prop}"' not in content and f"property='{og_prop}'" not in content:
                errors.append(f"[{rel_path}] Missing Open Graph property '{og_prop}'.")

        # 5. Robots directive
        if is_404:
            if not is_noindex:
                errors.append(f"[{rel_path}] 404 page must specify 'noindex' in robots meta directive.")
        elif is_noindex and not rel_path.startswith("tag/"):
            errors.append(f"[{rel_path}] Indexable page has accidental 'noindex' directive.")

        # 6. JSON-LD syntax and required BlogPosting properties
        json_ld_matches = re.findall(
            r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>', content, re.IGNORECASE | re.DOTALL
        )
        for ld_text in json_ld_matches:
            try:
                json_data = json.loads(ld_text.strip())
            except Exception as e:
                errors.append(f"[{rel_path}] Invalid JSON-LD syntax: {e}")
                continue
            if "@context" not in json_data or "@type" not in json_data:
                errors.append(f"[{rel_path}] JSON-LD missing @context or @type.")
            if json_data.get("@type") in ("BlogPosting", "Article"):
                for prop in ("headline", "datePublished", "author"):
                    if not json_data.get(prop):
                        errors.append(f"[{rel_path}] {json_data['@type']} JSON-LD missing '{prop}'.")

        # 7. Exactly one h1 in the prerendered body
        root_match = re.search(r'<div id="root">(.*)</div>', content, re.DOTALL)
        body = root_match.group(1) if root_match else ""
        h1_count = len(re.findall(r"<h1[\s>]", body, re.IGNORECASE))
        if h1_count != 1:
            errors.append(f"[{rel_path}] Prerendered body has {h1_count} <h1> elements (expected exactly 1).")

        # 8. Internal links resolve to generated pages or files
        for href in sorted(set(re.findall(r'<a\s[^>]*href="(/[^"]*)"', body))):
            if href.startswith("//"):
                continue
            if not resolve_internal(dist_dir, href):
                errors.append(f"[{rel_path}] Broken internal link: {href}")

        # 9. Articles should link to at least one other article in their body
        if rel_path.startswith("articles/") and rel_path != "articles/index.html":
            article_body = re.search(r'<div class="article-content">(.*?)</article>', body, re.DOTALL)
            if article_body and "href=\"/articles/" not in article_body.group(1):
                warnings.append(f"[{rel_path}] Article body has no contextual link to another article.")

        pages[route_for(rel_path)] = {"indexable": not is_noindex, "canonical": canon, "file": rel_path}

    # 10. Sitemap.xml validation and consistency with the generated pages
    sitemap_file = dist_dir / "sitemap.xml"
    sitemap_locs: List[str] = []
    if not sitemap_file.exists():
        errors.append("sitemap.xml missing in dist directory.")
    else:
        try:
            root = ET.parse(sitemap_file).getroot()
            ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            url_elements = root.findall("ns:url", ns)
            if not url_elements:
                errors.append("sitemap.xml contains no <url> elements.")
            today = datetime.date.today().isoformat()
            for url_el in url_elements:
                loc_el = url_el.find("ns:loc", ns)
                loc = loc_el.text.strip() if loc_el is not None and loc_el.text else ""
                if not loc:
                    errors.append("sitemap.xml has a <url> without <loc>.")
                    continue
                sitemap_locs.append(loc)
                lastmod_el = url_el.find("ns:lastmod", ns)
                if lastmod_el is not None:
                    lastmod = (lastmod_el.text or "").strip()
                    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", lastmod):
                        errors.append(f"sitemap.xml: {loc} has malformed lastmod '{lastmod}'.")
                    elif lastmod > today:
                        errors.append(f"sitemap.xml: {loc} has a future lastmod '{lastmod}'.")
                if not loc.startswith(SITE_URL):
                    errors.append(f"sitemap.xml: {loc} is not on {SITE_URL}.")
                    continue
                path = loc[len(SITE_URL):] or "/"
                page = pages.get(path)
                if page is None:
                    errors.append(f"sitemap.xml: {loc} has no generated page in dist/.")
                elif not page["indexable"]:
                    errors.append(f"sitemap.xml: {loc} is noindexed ({page['file']}) and must not be listed.")
                elif page["canonical"] != loc:
                    errors.append(f"sitemap.xml: {loc} canonicalizes to {page['canonical']}.")
            if len(set(sitemap_locs)) != len(sitemap_locs):
                errors.append("sitemap.xml lists duplicate URLs.")
            print(f"[SEO] sitemap.xml contains {len(sitemap_locs)} canonical URLs.")
        except Exception as e:
            errors.append(f"sitemap.xml is not valid XML: {e}")

    listed = set(sitemap_locs)
    for path, page in sorted(pages.items()):
        expected = SITE_URL + (path if path != "/" else "/")
        if page["indexable"] and page["canonical"] == expected and expected not in listed and path != "/404.html":
            warnings.append(f"[{page['file']}] Indexable, self-canonical page is missing from sitemap.xml.")

    # 11. Robots.txt validation
    robots_file = dist_dir / "robots.txt"
    if not robots_file.exists():
        errors.append("robots.txt missing in dist directory.")
    else:
        content = robots_file.read_text(encoding="utf-8")
        if f"sitemap: {SITE_URL}/sitemap.xml" not in content.lower():
            errors.append(f"robots.txt does not declare Sitemap: {SITE_URL}/sitemap.xml")

    # 12. Feed OPML validation
    opml_file = dist_dir / "feed.opml"
    if not opml_file.exists():
        errors.append("feed.opml missing in dist directory.")
    else:
        try:
            ET.parse(opml_file)
        except Exception as e:
            errors.append(f"feed.opml is not valid XML: {e}")

    noindexed = sum(1 for p in pages.values() if not p["indexable"])
    print(f"[SEO] {total_pages} pages checked: {total_pages - noindexed} indexable, {noindexed} noindexed.")

    if warnings:
        print(f"\n[WARN] {len(warnings)} warning(s):")
        for warn in warnings[:40]:
            print(f"  - {warn}")
        if len(warnings) > 40:
            print(f"  ... and {len(warnings) - 40} more warnings.")

    if errors:
        print(f"\n[ERROR] SEO validation failed with {len(errors)} issue(s):")
        for err in errors[:25]:
            print(f"  * {err}")
        if len(errors) > 25:
            print(f"  ... and {len(errors) - 25} more errors.")
        sys.exit(1)

    print(f"\n[SUCCESS] Production SEO audit passed for all {total_pages} pages, sitemap.xml, robots.txt, and feed.opml.")
    sys.exit(0)


if __name__ == "__main__":
    main()
