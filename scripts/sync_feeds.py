#!/usr/bin/env python3
"""
scripts/sync_feeds.py - RSS/Atom Feed Ingestion Engine for BlogAI Directory
Fetches and parses RSS/Atom feeds for directory blogs, extracting up to 5 latest articles per publication.
Appends referral UTM parameters (?utm_source=blogai.space&utm_medium=directory) to all outbound article links.
Outputs:
- src/data/blog_articles.json
- src/data/blog_articles.js
"""

import sys
import os
import json
import re
import html
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

# Ensure linter module can be imported
sys.path.append(str(Path(__file__).resolve().parent))
from linter import lint_categories

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (BlogAI/1.0; +https://blogai.space)"
TIMEOUT_SECONDS = 7
MAX_ARTICLES_PER_BLOG = 5
MAX_WORKERS = 20

def clean_html(raw_html: str) -> str:
    """Strip HTML tags and unescape entities, returning clean summary text."""
    if not raw_html:
        return ""
    # Strip CDATA markers if present as raw strings
    text = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", raw_html, flags=re.DOTALL)
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Decode entities
    text = html.unescape(text)
    # Normalize whitespace
    text = " ".join(text.strip().split())
    # Limit length for card preview
    if len(text) > 180:
        text = text[:177] + "..."
    return text

def add_utm(url: str) -> str:
    """Appends standard UTM query parameters to outbound article link."""
    if not url:
        return ""
    try:
        parsed = urllib.parse.urlsplit(url.strip())
        if not parsed.scheme or not parsed.netloc:
            return url
        query_params = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
        # Filter out existing utm params
        filtered = [(k, v) for k, v in query_params if not k.startswith("utm_")]
        filtered.append(("utm_source", "blogai.space"))
        filtered.append(("utm_medium", "directory"))
        new_query = urllib.parse.urlencode(filtered)
        return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, new_query, parsed.fragment))
    except Exception:
        return url

def parse_date(date_str: str) -> str:
    """Normalizes RFC 822 or ISO dates to YYYY-MM-DD."""
    if not date_str:
        return ""
    date_str = date_str.strip()
    try:
        dt = parsedate_to_datetime(date_str)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    # Fallback to regex for YYYY-MM-DD
    match = re.search(r"(\d{4}-\d{2}-\d{2})", date_str)
    if match:
        return match.group(1)
    return date_str[:10]

def parse_feed_content(xml_bytes: bytes, base_url: str) -> list:
    """Parses RSS or Atom XML bytes into a list of article dicts."""
    articles = []
    try:
        root = ET.fromstring(xml_bytes)
    except Exception:
        # Retry with sanitized XML (removing control characters)
        cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", xml_bytes.decode("utf-8", errors="ignore"))
        root = ET.fromstring(cleaned.encode("utf-8"))

    # Atom feed detection (root tag usually ends with 'feed')
    if root.tag.endswith("feed"):
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        entries = root.findall(".//atom:entry", ns) or root.findall(".//entry") or root.findall("{http://www.w3.org/2005/Atom}entry")
        for entry in entries:
            title = ""
            for tag in ["{http://www.w3.org/2005/Atom}title", "title"]:
                el = entry.find(tag)
                if el is not None and el.text:
                    title = clean_html(el.text)
                    break

            link = ""
            for tag in ["{http://www.w3.org/2005/Atom}link", "link"]:
                links = entry.findall(tag)
                for l in links:
                    rel = l.attrib.get("rel", "alternate")
                    href = l.attrib.get("href", "")
                    if rel in ("alternate", "") and href:
                        link = href
                        break
                if link:
                    break

            date_str = ""
            for tag in ["{http://www.w3.org/2005/Atom}published", "{http://www.w3.org/2005/Atom}updated", "published", "updated"]:
                el = entry.find(tag)
                if el is not None and el.text:
                    date_str = el.text
                    break

            desc = ""
            for tag in ["{http://www.w3.org/2005/Atom}summary", "{http://www.w3.org/2005/Atom}content", "summary", "content"]:
                el = entry.find(tag)
                if el is not None and el.text:
                    desc = clean_html(el.text)
                    break

            cats = []
            for tag in ["{http://www.w3.org/2005/Atom}category", "category"]:
                for c in entry.findall(tag):
                    term = c.attrib.get("term") or c.text
                    if term and term.strip() and term.strip() not in cats:
                        cats.append(term.strip())

            if title and link:
                articles.append({
                    "title": title,
                    "link": add_utm(urllib.parse.urljoin(base_url, link)),
                    "date": parse_date(date_str),
                    "description": desc,
                    "categories": cats[:3]
                })
            if len(articles) >= MAX_ARTICLES_PER_BLOG:
                break

    else:
        # RSS 2.0 / RSS 1.0 (RDF)
        items = root.findall(".//item")
        for item in items:
            title = clean_html(item.findtext("title") or "")
            link = (item.findtext("link") or "").strip()
            # Some feeds put link inside <link> text or <guid isPermaLink="true">
            if not link:
                guid = item.find("guid")
                if guid is not None and guid.attrib.get("isPermaLink") == "true" and guid.text:
                    link = guid.text.strip()

            date_str = item.findtext("pubDate") or item.findtext("{http://purl.org/dc/elements/1.1/}date") or ""
            desc = clean_html(item.findtext("description") or item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or "")

            cats = []
            for c in item.findall("category"):
                if c.text and c.text.strip() and c.text.strip() not in cats:
                    cats.append(c.text.strip())

            if title and link:
                articles.append({
                    "title": title,
                    "link": add_utm(urllib.parse.urljoin(base_url, link)),
                    "date": parse_date(date_str),
                    "description": desc,
                    "categories": cats[:3]
                })
            if len(articles) >= MAX_ARTICLES_PER_BLOG:
                break

    return articles

def fetch_feed_for_blog(blog: dict) -> tuple:
    """Fetches and parses a single blog feed. Returns (blog_slug, articles_list, error_or_none)."""
    feed_url = blog.get("feed")
    slug = blog.get("slug")
    if not feed_url:
        return slug, [], "No feed URL"

    req = urllib.request.Request(
        feed_url,
        headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"}
    )

    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            content = resp.read()
        articles = parse_feed_content(content, blog.get("address", feed_url))
        return slug, articles, None
    except Exception as e:
        return slug, [], str(e)

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    root_dir = Path(__file__).resolve().parent.parent
    categories_dir = root_dir / "Categories"
    output_json = root_dir / "src" / "data" / "blog_articles.json"
    output_js = root_dir / "src" / "data" / "blog_articles.js"

    print("Gathering registered blogs from categories...")
    is_valid, errors, records = lint_categories(categories_dir)
    if not is_valid:
        print("[ERROR] Categories failed linting. Cannot sync feeds.")
        sys.exit(1)

    # Load existing cache if available
    cache = {}
    if output_json.exists():
        try:
            with open(output_json, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded existing cache with {len(cache)} entries.")
        except Exception:
            cache = {}

    blogs_with_feeds = [r for r in records if r.get("feed")]
    print(f"Syncing feeds for {len(blogs_with_feeds)} blogs using {MAX_WORKERS} workers...")

    results = {}
    success_count = 0
    fallback_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_blog = {executor.submit(fetch_feed_for_blog, b): b for b in blogs_with_feeds}
        for future in as_completed(future_to_blog):
            blog = future_to_blog[future]
            slug = blog["slug"]
            try:
                slug, articles, err = future.result()
                if not err and articles:
                    results[slug] = {
                        "blogTitle": blog["title"],
                        "blogSlug": slug,
                        "feedUrl": blog["feed"],
                        "lastSynced": datetime.now(timezone.utc).isoformat(),
                        "articles": articles
                    }
                    success_count += 1
                else:
                    # Fallback to cache if available
                    if slug in cache and cache[slug].get("articles"):
                        results[slug] = cache[slug]
                        fallback_count += 1
                    else:
                        results[slug] = {
                            "blogTitle": blog["title"],
                            "blogSlug": slug,
                            "feedUrl": blog["feed"],
                            "lastSynced": datetime.now(timezone.utc).isoformat(),
                            "articles": []
                        }
                        fail_count += 1
            except Exception as e:
                if slug in cache and cache[slug].get("articles"):
                    results[slug] = cache[slug]
                    fallback_count += 1
                else:
                    results[slug] = {
                        "blogTitle": blog["title"],
                        "blogSlug": slug,
                        "feedUrl": blog["feed"],
                        "lastSynced": datetime.now(timezone.utc).isoformat(),
                        "articles": []
                    }
                    fail_count += 1

    # Deterministic sort by blog slug
    sorted_results = {k: results[k] for k in sorted(results.keys())}

    output_json.parent.mkdir(parents=True, exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(sorted_results, f, indent=2, ensure_ascii=False)

    with open(output_js, "w", encoding="utf-8") as f:
        f.write("// Auto-generated by scripts/sync_feeds.py - DO NOT EDIT MANUALLY\n")
        f.write("export const blogArticles = ")
        json.dump(sorted_results, f, indent=2, ensure_ascii=False)
        f.write(";\n\nexport default blogArticles;\n")

    total_articles = sum(len(v.get("articles", [])) for v in sorted_results.values())
    print(f"\n[SUCCESS] Feed sync complete:")
    print(f"  * Freshly fetched: {success_count} blogs")
    print(f"  * Preserved from cache: {fallback_count} blogs")
    print(f"  * Unreachable/Empty: {fail_count} blogs")
    print(f"  * Total RSS articles indexed: {total_articles}")
    print(f"  * Written to {output_json} and {output_js}")

if __name__ == "__main__":
    main()
