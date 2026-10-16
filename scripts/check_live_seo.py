#!/usr/bin/env python3
"""
scripts/check_live_seo.py - Post-deploy sitemap and indexability check.

Fetches robots.txt, the sitemap index and every child sitemap from the deployed site, then
requests every listed URL WITHOUT following redirects and checks that it:
- answers 200 directly (no redirect, no error),
- is served as HTML,
- carries no noindex (meta robots or X-Robots-Tag header),
- declares itself as canonical,
- is allowed by robots.txt.
Also checks that a few unknown URLs answer 404 rather than a soft 200.

Usage:
  python scripts/check_live_seo.py                       # checks https://blogai.directory
  python scripts/check_live_seo.py --base http://localhost:4173
      Fetches from another host (a preview server or staging) while still expecting the
      production URLs in sitemaps and canonicals.
Exit code 0 when every check passes, 1 otherwise.
"""

import argparse
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html import unescape
from typing import List, Optional, Tuple

from sitemap_utils import SITE_URL, RobotsRules, parse_sitemap, url_path

USER_AGENT = "BlogAI-SEO-Check/1.0 (+https://blogai.directory/about)"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def fetch(url: str) -> Tuple[int, dict, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with OPENER.open(req, timeout=20) as resp:
            return resp.status, dict(resp.headers), resp.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read() if e.fp else b""


def check_page(base: str, loc: str, robots: RobotsRules) -> List[str]:
    path = url_path(loc)
    problems: List[str] = []
    if not robots.is_allowed(path):
        problems.append("blocked by robots.txt")
    try:
        status, headers, body = fetch(base + path)
    except Exception as e:
        return [f"request failed: {e}"]
    headers = {k.lower(): v for k, v in headers.items()}
    if status != 200:
        where = f" -> {headers.get('location')}" if 300 <= status < 400 else ""
        return problems + [f"HTTP {status}{where}"]
    if "text/html" not in headers.get("content-type", ""):
        problems.append(f"content-type is {headers.get('content-type')!r}")
    if "noindex" in headers.get("x-robots-tag", "").lower():
        problems.append("X-Robots-Tag: noindex")
    html = body.decode("utf-8", errors="replace")
    robots_meta = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    if robots_meta and "noindex" in robots_meta.group(1).lower():
        problems.append("meta robots noindex")
    canon = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', html, re.IGNORECASE)
    canonical: Optional[str] = unescape(canon.group(1)) if canon else None
    if canonical != loc:
        problems.append(f"canonical is {canonical}")
    return problems


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base", default=SITE_URL, help="origin to fetch from (default: %(default)s)")
    args = parser.parse_args()
    base = args.base.rstrip("/")

    errors: List[str] = []
    print(f"Checking {base} (expecting canonical URLs on {SITE_URL})")

    status, _, body = fetch(f"{base}/robots.txt")
    robots = RobotsRules(body.decode("utf-8", errors="replace") if status == 200 else "")
    if status != 200:
        errors.append(f"robots.txt: HTTP {status}")
    elif f"{SITE_URL}/sitemap.xml" not in robots.sitemaps:
        errors.append(f"robots.txt does not declare Sitemap: {SITE_URL}/sitemap.xml")

    page_locs: List[str] = []
    status, _, body = fetch(f"{base}/sitemap.xml")
    if status != 200:
        errors.append(f"sitemap.xml: HTTP {status}")
    else:
        kind, entries = parse_sitemap(body, "sitemap.xml", errors)
        if kind == "urlset":
            page_locs = [loc for loc, _ in entries]
        for child_loc, _ in entries if kind == "index" else []:
            child_status, _, child_body = fetch(base + url_path(child_loc))
            if child_status != 200:
                errors.append(f"{child_loc}: HTTP {child_status}")
                continue
            child_kind, child_entries = parse_sitemap(child_body, child_loc.rsplit("/", 1)[-1], errors)
            if child_kind == "urlset":
                page_locs += [loc for loc, _ in child_entries]
    if len(set(page_locs)) != len(page_locs):
        errors.append("The same URL is listed in more than one sitemap.")

    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda loc: (loc, check_page(base, loc, robots)), page_locs))
    failing = [(loc, problems) for loc, problems in results if problems]
    for loc, problems in failing:
        errors.append(f"{loc}: {'; '.join(problems)}")

    # Unknown URLs must be real 404s, not soft 404s served as the app shell
    for probe in ("/this-page-does-not-exist", "/articles/this-article-does-not-exist"):
        probe_status, _, _ = fetch(base + probe)
        if probe_status != 404:
            errors.append(f"{probe}: expected HTTP 404, got {probe_status} (soft 404)")

    print(f"[LIVE] {len(page_locs)} sitemap URLs checked, {len(page_locs) - len(failing)} OK.")
    if errors:
        print(f"\n[ERROR] {len(errors)} issue(s):")
        for err in errors[:50]:
            print(f"  * {err}")
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more.")
        sys.exit(1)
    print("[SUCCESS] Every sitemap URL answers 200, is indexable, self-canonical, and crawlable.")


if __name__ == "__main__":
    main()
