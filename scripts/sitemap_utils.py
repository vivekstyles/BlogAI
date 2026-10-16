"""
Shared sitemap and robots.txt helpers for scripts/validate_seo.py (checks dist/ at build time)
and scripts/check_live_seo.py (checks the deployed site).
"""

import datetime
import re
import xml.etree.ElementTree as ET
from typing import List, Optional, Tuple

SITE_URL = "https://blogai.space"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
# Protocol limits: https://www.sitemaps.org/protocol.html
MAX_URLS_PER_SITEMAP = 50_000
MAX_SITEMAP_BYTES = 50 * 1024 * 1024

Entry = Tuple[str, Optional[str]]  # (loc, lastmod)


def parse_sitemap(data: bytes, name: str, errors: List[str]) -> Tuple[str, List[Entry]]:
    """Parses a sitemap or sitemap index. Returns (kind, entries) with kind 'index' or 'urlset'."""
    if len(data) > MAX_SITEMAP_BYTES:
        errors.append(f"{name} is larger than 50 MB uncompressed.")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as e:
        errors.append(f"{name} is not valid XML: {e}")
        return "invalid", []

    tag = root.tag.split("}", 1)[-1]
    if not root.tag.startswith(f"{{{SITEMAP_NS}}}"):
        errors.append(f"{name} does not use the sitemap namespace {SITEMAP_NS}.")
    if tag == "sitemapindex":
        kind, child = "index", "sitemap"
    elif tag == "urlset":
        kind, child = "urlset", "url"
    else:
        errors.append(f"{name} root element is <{tag}>, expected <urlset> or <sitemapindex>.")
        return "invalid", []

    ns = {"ns": SITEMAP_NS}
    entries: List[Entry] = []
    today = datetime.date.today().isoformat()
    for el in root.findall(f"ns:{child}", ns):
        loc_el = el.find("ns:loc", ns)
        loc = (loc_el.text or "").strip() if loc_el is not None else ""
        if not loc:
            errors.append(f"{name} has a <{child}> without <loc>.")
            continue
        if not loc.startswith(SITE_URL + "/"):
            errors.append(f"{name}: {loc} is not an absolute {SITE_URL} URL.")
        lastmod = None
        lastmod_el = el.find("ns:lastmod", ns)
        if lastmod_el is not None:
            lastmod = (lastmod_el.text or "").strip()
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", lastmod):
                errors.append(f"{name}: {loc} has malformed lastmod '{lastmod}'.")
            elif lastmod > today:
                errors.append(f"{name}: {loc} has a future lastmod '{lastmod}'.")
        entries.append((loc, lastmod))

    if not entries:
        errors.append(f"{name} lists no entries.")
    if len(entries) > MAX_URLS_PER_SITEMAP:
        errors.append(f"{name} lists {len(entries)} entries (max {MAX_URLS_PER_SITEMAP}).")
    locs = [loc for loc, _ in entries]
    if len(set(locs)) != len(locs):
        errors.append(f"{name} lists duplicate URLs.")
    return kind, entries


class RobotsRules:
    """Minimal robots.txt matcher for the '*' group: Allow/Disallow with * and $, longest match wins."""

    def __init__(self, text: str):
        self.rules: List[Tuple[bool, str]] = []
        self.sitemaps: List[str] = []
        in_star_group = False
        last_was_agent = False
        for raw in text.splitlines():
            line = raw.split("#", 1)[0].strip()
            if ":" not in line:
                continue
            field, value = (part.strip() for part in line.split(":", 1))
            field = field.lower()
            if field == "sitemap":
                self.sitemaps.append(value)
                continue
            if field == "user-agent":
                in_star_group = (in_star_group and last_was_agent) or value == "*"
                last_was_agent = True
                continue
            last_was_agent = False
            if in_star_group and field in ("allow", "disallow") and value:
                self.rules.append((field == "allow", value))

    @staticmethod
    def _matches(pattern: str, path: str) -> bool:
        regex = re.escape(pattern).replace(r"\*", ".*")
        if regex.endswith(r"\$"):
            regex = regex[:-2] + "$"
        return re.match(regex, path) is not None

    def is_allowed(self, path_and_query: str) -> bool:
        best_len, allowed = -1, True
        for is_allow, pattern in self.rules:
            if self._matches(pattern, path_and_query) and (
                len(pattern) > best_len or (len(pattern) == best_len and is_allow)
            ):
                best_len, allowed = len(pattern), is_allow
        return allowed


def url_path(url: str) -> str:
    return url[len(SITE_URL):] or "/" if url.startswith(SITE_URL) else url
