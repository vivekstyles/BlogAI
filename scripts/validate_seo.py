#!/usr/bin/env python3
"""
scripts/validate_seo.py - Production SEO & Metadata Validator
Validates the generated dist/ folder for:
- Unique <title> tags (no duplicate titles among indexable pages)
- Unique, non-empty <meta name="description"> tags
- Valid canonical <link rel="canonical"> with absolute URLs
- Open Graph tags (og:title, og:description, og:url)
- Valid JSON-LD structured data syntax
- Correct robots directives
- Sitemap.xml presence and valid XML structure
- Robots.txt presence with sitemap directive
- OPML feed availability in dist/
Exit code 0 on success, 1 on error.
"""

import sys
import os
import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Set

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
    seen_titles: Dict[str, str] = {}
    seen_descriptions: Dict[str, str] = {}
    seen_canonicals: Dict[str, str] = {}
    total_pages = 0

    html_files = sorted(list(dist_dir.glob("**/*.html")))
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

        is_404 = "404" in rel_path

        # 1. Title validation
        title_match = re.search(r"<title>(.*?)</title>", content, re.IGNORECASE | re.DOTALL)
        if not title_match or not title_match.group(1).strip():
            errors.append(f"[{rel_path}] Missing or empty <title> tag.")
        else:
            title = title_match.group(1).strip()
            if not is_404:
                if title in seen_titles:
                    errors.append(f"[{rel_path}] Duplicate <title> '{title}' matches {seen_titles[title]}.")
                else:
                    seen_titles[title] = rel_path

        # 2. Meta description validation
        desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE)
        if not desc_match or not desc_match.group(1).strip():
            errors.append(f"[{rel_path}] Missing or empty <meta name=\"description\">.")
        else:
            desc = desc_match.group(1).strip()
            if not is_404:
                if desc in seen_descriptions:
                    errors.append(f"[{rel_path}] Duplicate description matches {seen_descriptions[desc]}.")
                else:
                    seen_descriptions[desc] = rel_path

        # 3. Canonical URL validation
        canon_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE)
        if not canon_match or not canon_match.group(1).strip():
            errors.append(f"[{rel_path}] Missing or empty <link rel=\"canonical\">.")
        else:
            canon = canon_match.group(1).strip()
            if not canon.startswith("https://blogai.directory"):
                errors.append(f"[{rel_path}] Canonical URL '{canon}' must be absolute and use production domain.")
            if not is_404:
                if canon in seen_canonicals:
                    errors.append(f"[{rel_path}] Duplicate canonical URL '{canon}' matches {seen_canonicals[canon]}.")
                else:
                    seen_canonicals[canon] = rel_path

        # 4. Open Graph validation
        for og_prop in ["og:title", "og:description", "og:url"]:
            if f'property="{og_prop}"' not in content and f"property='{og_prop}'" not in content:
                errors.append(f"[{rel_path}] Missing Open Graph property '{og_prop}'.")

        # 5. Robots directive
        robots_match = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\'](.*?)["\']\s*/?>', content, re.IGNORECASE)
        if is_404:
            if not robots_match or "noindex" not in robots_match.group(1).lower():
                errors.append(f"[{rel_path}] 404 page must specify 'noindex' in robots meta directive.")
        else:
            if robots_match and "noindex" in robots_match.group(1).lower():
                errors.append(f"[{rel_path}] Indexable page has accidental 'noindex' directive.")

        # 6. JSON-LD syntax validation
        json_ld_matches = re.findall(r'<script\s+type=["\']application/ld\+json["\']\s*>(.*?)</script>', content, re.IGNORECASE | re.DOTALL)
        for ld_text in json_ld_matches:
            try:
                json_data = json.loads(ld_text.strip())
                if "@context" not in json_data or "@type" not in json_data:
                    errors.append(f"[{rel_path}] JSON-LD missing @context or @type.")
            except Exception as e:
                errors.append(f"[{rel_path}] Invalid JSON-LD syntax: {e}")

    # 7. Sitemap.xml validation
    sitemap_file = dist_dir / "sitemap.xml"
    if not sitemap_file.exists():
        errors.append("sitemap.xml missing in dist directory.")
    else:
        try:
            tree = ET.parse(sitemap_file)
            root = tree.getroot()
            ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            loc_elements = root.findall(".//ns:loc", ns)
            if not loc_elements:
                loc_elements = root.findall(".//loc")
            if not loc_elements:
                errors.append("sitemap.xml contains no <loc> elements.")
            else:
                sitemap_locs = [el.text.strip() for el in loc_elements if el.text]
                print(f"[SEO] sitemap.xml contains {len(sitemap_locs)} valid canonical URLs.")
        except Exception as e:
            errors.append(f"sitemap.xml is not valid XML: {e}")

    # 8. Robots.txt validation
    robots_file = dist_dir / "robots.txt"
    if not robots_file.exists():
        errors.append("robots.txt missing in dist directory.")
    else:
        content = robots_file.read_text(encoding="utf-8")
        if "sitemap: https://blogai.directory/sitemap.xml" not in content.lower():
            errors.append("robots.txt does not declare Sitemap: https://blogai.directory/sitemap.xml")

    # 9. Feed OPML validation
    opml_file = dist_dir / "feed.opml"
    if not opml_file.exists():
        errors.append("feed.opml missing in dist directory.")
    else:
        try:
            ET.parse(opml_file)
        except Exception as e:
            errors.append(f"feed.opml is not valid XML: {e}")

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
