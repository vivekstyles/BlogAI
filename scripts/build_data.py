#!/usr/bin/env python3
"""
scripts/build_data.py - Deterministic Data Pipeline and OPML Generator
Discovers categories, validates records, extracts tags, computes statistics,
and generates:
- src/data/blogs.js & src/data/blogs.json
- src/data/categories.js & src/data/categories.json
- src/data/tags.js & src/data/tags.json
- feed.opml
- scripts/validation_report.json
"""

import sys
import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Any

# Import validation logic from linter
from linter import lint_categories, slugify

CATEGORY_DESCRIPTIONS = {
    "Artificial Intelligence": "Machine learning, large language models, AI research, and how AI is applied in industry and work.",
    "Engineering": "Software engineering architectures, distributed systems, reliability, backend infrastructure, and developer craft.",
    "Mathematics": "Pure and applied mathematics, combinatorics, analysis, theoretical foundations, and mathematical expositions.",
    "Programming and Technology": "Programming languages, software development, Python, developer tools, and how technology is built and used.",
    "Physics": "Theoretical cosmology, quantum foundations, particle physics, astrophysics, and modern physical inquiry.",
    "Science": "Interdisciplinary scientific discovery, chemical biology, neuroscience, peer review, and research methodology.",
    "Automobile": "Automotive engineering, electric mobility, vehicle technology, road tests, and car culture.",
    "Food and Nutrition": "Nutrition science, healthy eating, sports nutrition, food policy, and everyday recipes.",
    "Personal Finance": "Budgeting, saving, debt, investing, retirement planning, and the everyday habits that build financial stability."
}

def generate_opml(categories_data: List[Dict[str, Any]], blogs_data: List[Dict[str, Any]], output_path: Path):
    """Generates an OPML 2.0 subscription outline file deterministically."""
    root = ET.Element("opml", version="2.0")
    head = ET.SubElement(root, "head")
    title_el = ET.SubElement(head, "title")
    title_el.text = "BlogAI Community Directory Feed Collection"
    date_el = ET.SubElement(head, "dateCreated")
    # Deterministic or fixed format ISO date
    date_el.text = "2026-01-01T00:00:00Z"
    owner_el = ET.SubElement(head, "ownerName")
    owner_el.text = "BlogAI Community"

    body = ET.SubElement(root, "body")

    # Group by category in deterministic order
    blogs_by_cat: Dict[str, List[Dict[str, Any]]] = {}
    for b in blogs_data:
        blogs_by_cat.setdefault(b["category"], []).append(b)

    for cat in sorted(blogs_by_cat.keys()):
        cat_outline = ET.SubElement(body, "outline", text=cat, title=cat)
        cat_blogs = sorted(blogs_by_cat[cat], key=lambda x: x["title"].lower())
        for b in cat_blogs:
            ET.SubElement(
                cat_outline,
                "outline",
                type="rss",
                text=b["title"],
                title=b["title"],
                xmlUrl=b["feed"],
                htmlUrl=b["address"],
                category=b["category"]
            )

    # Indent XML deterministically
    ET.indent(root, space="  ")
    tree = ET.ElementTree(root)
    with open(output_path, "wb") as f:
        tree.write(f, encoding="utf-8", xml_declaration=True)

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    root_dir = Path(__file__).resolve().parent.parent
    categories_dir = root_dir / "Categories"
    src_data_dir = root_dir / "src" / "data"
    opml_file = root_dir / "feed.opml"
    report_file = root_dir / "scripts" / "validation_report.json"

    src_data_dir.mkdir(parents=True, exist_ok=True)

    print("Building centralized blog directory data...")
    is_valid, errors, records = lint_categories(categories_dir)

    # Prepare validation report
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "valid": is_valid,
        "totalRecords": len(records),
        "totalErrors": len(errors),
        "errors": errors
    }
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    if not is_valid:
        print(f"[ERROR] Cannot build data due to {len(errors)} validation error(s).")
        for err in errors:
            print(f"  * {err}")
        sys.exit(1)

    # Sort records deterministically by Category and Title
    records = sorted(records, key=lambda x: (x["category"].lower(), x["title"].lower()))

    # Calculate Tag indices
    tag_counts: Dict[str, int] = {}
    tag_blogs: Dict[str, List[str]] = {} # tag_slug -> list of blog IDs
    for r in records:
        for t in r["tags"]:
            t_slug = slugify(t)
            tag_counts[t] = tag_counts.get(t, 0) + 1
            tag_blogs.setdefault(t_slug, []).append(r["id"])

    sorted_tags = sorted(
        [
            {
                "name": t,
                "slug": slugify(t),
                "count": count,
                "blogCount": count
            }
            for t, count in tag_counts.items()
        ],
        key=lambda x: (-x["count"], x["name"])
    )

    # Group categories
    categories_dict: Dict[str, Dict[str, Any]] = {}
    for r in records:
        c_name = r["category"]
        c_slug = r["categorySlug"]
        if c_name not in categories_dict:
            categories_dict[c_name] = {
                "name": c_name,
                "slug": c_slug,
                "description": CATEGORY_DESCRIPTIONS.get(c_name, f"Curated collection of {c_name} blogs."),
                "count": 0,
                "tags": set()
            }
        categories_dict[c_name]["count"] += 1
        for t in r["tags"]:
            categories_dict[c_name]["tags"].add(t)

    categories_list = []
    for c_name in sorted(categories_dict.keys()):
        c_data = categories_dict[c_name]
        categories_list.append({
            "name": c_data["name"],
            "slug": c_data["slug"],
            "description": c_data["description"],
            "count": c_data["count"],
            "popularTags": sorted(list(c_data["tags"]))[:8]
        })

    # Write src/data/blogs.json & src/data/blogs.js
    blogs_json_path = src_data_dir / "blogs.json"
    with open(blogs_json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    blogs_js_path = src_data_dir / "blogs.js"
    with open(blogs_js_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated by scripts/build_data.py - DO NOT EDIT MANUALLY\n")
        f.write("export const blogs = ")
        json.dump(records, f, indent=2, ensure_ascii=False)
        f.write(";\n\nexport default blogs;\n")

    # Write src/data/categories.json & src/data/categories.js
    cat_json_path = src_data_dir / "categories.json"
    with open(cat_json_path, "w", encoding="utf-8") as f:
        json.dump(categories_list, f, indent=2, ensure_ascii=False)

    cat_js_path = src_data_dir / "categories.js"
    with open(cat_js_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated by scripts/build_data.py - DO NOT EDIT MANUALLY\n")
        f.write("export const categories = ")
        json.dump(categories_list, f, indent=2, ensure_ascii=False)
        f.write(";\n\nexport default categories;\n")

    # Write src/data/tags.json & src/data/tags.js
    tags_json_path = src_data_dir / "tags.json"
    with open(tags_json_path, "w", encoding="utf-8") as f:
        json.dump(sorted_tags, f, indent=2, ensure_ascii=False)

    tags_js_path = src_data_dir / "tags.js"
    with open(tags_js_path, "w", encoding="utf-8") as f:
        f.write("// Auto-generated by scripts/build_data.py - DO NOT EDIT MANUALLY\n")
        f.write("export const tags = ")
        json.dump(sorted_tags, f, indent=2, ensure_ascii=False)
        f.write(";\n\nexport default tags;\n")

    # Generate feed.opml
    generate_opml(categories_list, records, opml_file)

    print(f"[SUCCESS] Built {len(records)} blogs, {len(categories_list)} categories, and {len(sorted_tags)} unique tags.")
    print(f"Generated feed.opml ({opml_file.name}) and validation report ({report_file.name}).")

if __name__ == "__main__":
    main()
