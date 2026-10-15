#!/usr/bin/env python3
"""
scripts/linter.py - Strict CSV validator for BlogAI Directory
Validates all category CSV files for:
- Required columns (Title, Address, RSS feed, Tags)
- Valid URL formatting (http/https, valid network location)
- Tag formatting (semicolon-separated, non-empty)
- Duplicate blog detection (normalized URLs, titles, slugs)
- Unicode preservation and clean whitespace
- Deterministic reporting with file and line numbers
Exit code 0 on success, 1 on validation errors.
"""

import sys
import os
import csv
import re
import urllib.parse
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional

REQUIRED_COLUMNS = ["Title", "Address", "RSS feed", "Tags"]
OPTIONAL_COLUMNS = ["Description", "Author", "Language", "Website status"]

def normalize_text(text: Optional[str]) -> str:
    if text is None:
        return ""
    # Strip whitespace, collapse internal multiple spaces
    return " ".join(text.strip().split())

def normalize_url(url: str) -> str:
    url = url.strip()
    if not url:
        return ""
    parsed = urllib.parse.urlsplit(url)
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    # Remove default ports
    if netloc.endswith(":80") and scheme == "http":
        netloc = netloc[:-3]
    elif netloc.endswith(":443") and scheme == "https":
        netloc = netloc[:-4]
    # Strip redundant trailing slash from root path
    path = parsed.path
    if path == "/" or not path:
        path = ""
    else:
        path = re.sub(r"/+", "/", path)
    return urllib.parse.urlunsplit((scheme, netloc, path, parsed.query, parsed.fragment))

def is_valid_url(url: str) -> bool:
    try:
        parsed = urllib.parse.urlsplit(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc) and "." in parsed.netloc
    except Exception:
        return False

import unicodedata

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = text.lower().strip()
    # Replace non-alphanumeric characters with hyphens
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = text.strip("-")
    return text or "item"

def parse_tags(raw_tags: str) -> List[str]:
    raw = normalize_text(raw_tags)
    if not raw:
        return []
    # Accept semicolon or comma separated tags, standard is semicolon
    delimiter = ";" if ";" in raw else ","
    tags = []
    for t in raw.split(delimiter):
        cleaned = normalize_text(t).lower()
        if cleaned and cleaned not in tags:
            tags.append(cleaned)
    return tags

def lint_categories(categories_dir: Path) -> Tuple[bool, List[str], List[dict]]:
    errors: List[str] = []
    records: List[dict] = []
    seen_urls: Dict[str, Tuple[str, int]] = {}
    seen_slugs: Dict[str, Tuple[str, int]] = {}

    if not categories_dir.exists() or not categories_dir.is_dir():
        errors.append(f"Categories directory '{categories_dir}' does not exist.")
        return False, errors, records

    category_folders = sorted([d for d in categories_dir.iterdir() if d.is_dir()])
    if not category_folders:
        errors.append(f"No category folders found in '{categories_dir}'.")
        return False, errors, records

    for cat_dir in category_folders:
        cat_name = cat_dir.name
        csv_file = cat_dir / "blogs.csv"
        if not csv_file.exists():
            errors.append(f"Category folder '{cat_name}' is missing 'blogs.csv'.")
            continue

        try:
            with open(csv_file, mode="r", encoding="utf-8-sig", newline="") as f:
                reader = csv.DictReader(f)
                if not reader.fieldnames:
                    errors.append(f"[{csv_file.name}] Empty file or missing header in {cat_name}.")
                    continue

                fieldnames = [fn.strip() for fn in reader.fieldnames if fn]
                # Check required columns
                missing_cols = [col for col in REQUIRED_COLUMNS if col not in fieldnames]
                if missing_cols:
                    errors.append(f"[{cat_name}/blogs.csv] Missing required columns: {', '.join(missing_cols)}")
                    continue

                for row_idx, row in enumerate(reader, start=2): # 1-indexed, header is row 1
                    title = normalize_text(row.get("Title"))
                    address = normalize_text(row.get("Address"))
                    feed = normalize_text(row.get("RSS feed"))
                    raw_tags = normalize_text(row.get("Tags"))
                    desc = normalize_text(row.get("Description"))
                    author = normalize_text(row.get("Author"))
                    lang = normalize_text(row.get("Language")) or "en"
                    status = normalize_text(row.get("Website status")) or "active"

                    location = f"{cat_name}/blogs.csv:row {row_idx}"

                    # Validate required fields
                    if not title:
                        errors.append(f"[{location}] 'Title' is empty.")
                    if not address:
                        errors.append(f"[{location}] 'Address' is empty.")
                    elif not is_valid_url(address):
                        errors.append(f"[{location}] Invalid 'Address' URL format: '{address}'.")

                    if not feed:
                        errors.append(f"[{location}] 'RSS feed' is empty.")
                    elif not is_valid_url(feed):
                        errors.append(f"[{location}] Invalid 'RSS feed' URL format: '{feed}'.")

                    tags = parse_tags(raw_tags)
                    if not tags:
                        errors.append(f"[{location}] 'Tags' must contain at least one valid tag.")

                    # Duplicate check by normalized URL
                    if address:
                        norm_url = normalize_url(address)
                        if norm_url in seen_urls:
                            prev_loc = seen_urls[norm_url]
                            errors.append(f"[{location}] Duplicate URL '{address}' already registered at {prev_loc[0]}:row {prev_loc[1]}.")
                        else:
                            seen_urls[norm_url] = (cat_name, row_idx)

                    # Slug collision check
                    if title:
                        base_slug = slugify(title)
                        if base_slug in seen_slugs:
                            prev_loc = seen_slugs[base_slug]
                            # When same slug occurs, check if it's identical or colliding
                            errors.append(f"[{location}] Slug collision '{base_slug}' from '{title}' conflicts with {prev_loc[0]}:row {prev_loc[1]}.")
                        else:
                            seen_slugs[base_slug] = (cat_name, row_idx)

                    record = {
                        "id": f"{slugify(cat_name)}-{slugify(title)}",
                        "title": title,
                        "slug": slugify(title),
                        "address": address,
                        "normalizedUrl": normalize_url(address),
                        "feed": feed,
                        "tags": tags,
                        "description": desc,
                        "author": author,
                        "language": lang,
                        "status": status,
                        "category": cat_name,
                        "categorySlug": slugify(cat_name),
                        "sourceFile": f"{cat_name}/blogs.csv",
                        "sourceRow": row_idx,
                    }
                    records.append(record)

        except Exception as e:
            errors.append(f"[{cat_name}/blogs.csv] Error parsing CSV: {str(e)}")

    is_valid = len(errors) == 0
    return is_valid, errors, records

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    root_dir = Path(__file__).resolve().parent.parent
    categories_dir = root_dir / "Categories"

    print("Running strict CSV linter...")
    is_valid, errors, records = lint_categories(categories_dir)

    if not is_valid:
        print(f"\n[ERROR] Linter failed with {len(errors)} error(s):")
        for err in errors:
            print(f"  * {err}")
        sys.exit(1)

    print(f"\n[SUCCESS] Linter passed: All {len(records)} blog records in {categories_dir} are valid and unique.")
    sys.exit(0)

if __name__ == "__main__":
    main()
