#!/usr/bin/env python3
"""
scripts/test_validate_seo.py - Proves validate_seo.py catches each rule in
.claude/rules/GOOGLE-SEARCH-RULES/rules.md.

Copies dist/ once, then for each case breaks one thing, runs the validator on the copy,
and expects it to fail with the case's message. The file is restored before the next case.
A clean copy must pass first, so a failure here always points at the broken rule.

Run after `npm run build`. Exit code 0 when every case behaves as expected.
"""

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
VALIDATOR = ROOT / "scripts" / "validate_seo.py"
ARTICLE = "articles/prompt-engineering-techniques"


def sub(pattern, repl, count=1):
    """Edit that applies a regex replacement and insists it matched."""

    def apply(text):
        new, n = re.subn(pattern, repl, text, count=count, flags=re.DOTALL)
        if n == 0:
            raise AssertionError(f"pattern not found: {pattern}")
        return new

    return apply


def both(route):
    """A route is written twice (route.html and route/index.html); break both copies."""
    return [f"{route}.html", f"{route}/index.html"]


# (rule id, files to edit, edit, expected error substring)
CASES = [
    ("G1.2", ["robots.txt"], lambda t: t + "\nDisallow: /assets/\n", "which pages need to render"),
    ("G1.3", ["robots.txt"], sub(r"Sitemap:.*", ""), "does not declare Sitemap"),
    ("G1.4", ["index.html"], sub(r'<a href="/articles"', '<a href="/no-such-page"'), "Broken internal link"),
    ("G2.1", ["index.html"], sub(r'rel="canonical" href="https://blogai.space/"', 'rel="canonical" href="http://localhost/"'),
     "must be absolute and use production domain"),
    ("G2.2", ["404.html"], sub(r"</head>", '<link rel="canonical" href="https://blogai.space/404" /></head>'),
     "404 page must not declare a canonical"),
    ("G2.3", both("about"), sub(r'name="robots" content="[^"]*"', 'name="robots" content="noindex, follow"'),
     "accidental 'noindex'"),
    ("G2.5", [f"{ARTICLE}.html"], sub(r"<h1", "<h1 data-x"), "Differs from"),
    ("G3.2", ["sitemap-pages.xml"], sub(r"</urlset>", "<url><loc>https://blogai.space/ghost</loc></url></urlset>"),
     "has no generated page"),
    ("G3.3", ["sitemap-articles.xml"], sub(r"<lastmod>[^<]*</lastmod>", "<lastmod>2999-01-01</lastmod>"), "lastmod"),
    ("G4.1", both("about"), sub(r"<title>.*?</title>", "<title></title>"), "Missing or empty <title>"),
    ("G4.2", both("about"), sub(r"<title>.*?</title>", "<title>undefined | BlogAI</title>"), "placeholder value"),
    ("G4.4", ["index.html"], sub(r'<html lang="en">', "<html>"), "no lang attribute"),
    ("G4.4", ["index.html"], sub(r'<meta name="viewport"[^>]*>', ""), "Missing <meta name=\"viewport\">"),
    ("G4.5", both(ARTICLE), sub(r'(<div class="article-content">)', r'\1<img src="/images/missing.png" alt="x">'),
     "Missing image file"),
    ("G4.7", ["favicon.ico"], None, "favicon.ico missing"),
    ("G5.1", both("about"), sub(r'<meta property="og:title"[^>]*>', ""), "Missing Open Graph property 'og:title'"),
    ("G5.2", both("about"), sub(r"</head>", '<meta property="og:image" content="https://blogai.space/x.png" /></head>'),
     "Duplicate property=\"og:image\""),
    ("G5.3", both("about"), sub(r'name="twitter:card" content="summary"', 'name="twitter:card" content="summary_large_image"'),
     "only image is the logo"),
    ("G6.1", both("about"), sub(r"</head>", '<script type="application/ld+json">{oops</script></head>'),
     "Invalid JSON-LD syntax"),
    ("G6.2", both(ARTICLE), sub(r'(<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "BreadcrumbList".*?</script>)',
                                r"\1\1"), "JSON-LD blocks of @type BreadcrumbList"),
    ("G6.3", ["index.html"], sub(r'"@type": "WebSite"', '"@type": "WebPage"'), "Home page needs WebSite"),
    ("G6.3", ["index.html"], sub(r'"logo": \{.*?\},', ""), "Organization JSON-LD with a logo"),
    ("G6.4", both(ARTICLE), sub(r'"datePublished": "[^"]*"', '"datePublished": ""'), "missing 'datePublished'"),
    ("G6.4", both(ARTICLE), sub(r'"dateModified": "[^"]*"', '"dateModified": "2000-01-01"'), "is earlier than datePublished"),
    ("G6.4", both(ARTICLE), sub(r'"name": "BlogAI Editors",\s*"url": "[^"]*"', '"name": "BlogAI Editors"'),
     "Organization author needs a url"),
    ("G6.5", both(ARTICLE), sub(r'"inLanguage": "en"\s*\}', '"inLanguage": "en", "image": ["https://blogai.space/icon-512.png"]}'),
     "not the site logo"),
    ("G6.6", both(ARTICLE), sub(r'"position": 2', '"position": 7'), "wrong position"),
]


def run_validator(dist: Path):
    result = subprocess.run(
        [sys.executable, str(VALIDATOR), "--dist", str(dist)],
        capture_output=True, text=True, encoding="utf-8",
    )
    return result.returncode, result.stdout + result.stderr


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if not DIST.exists():
        print("[ERROR] dist/ not found. Run 'npm run build' first.")
        sys.exit(1)

    failures = []
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / "dist"
        shutil.copytree(DIST, work)

        code, output = run_validator(work)
        if code != 0:
            print("[ERROR] The unmodified build does not pass validate_seo.py, so the cases cannot be judged:")
            print(output[-2000:])
            sys.exit(1)
        print("[OK]   clean build passes")

        for rule, files, edit, expected in CASES:
            originals = {f: (work / f).read_bytes() for f in files}
            try:
                for f in files:
                    if edit is None:
                        (work / f).unlink()
                    else:
                        path = work / f
                        path.write_text(edit(path.read_text(encoding="utf-8")), encoding="utf-8")
                code, output = run_validator(work)
                if code == 0 or expected not in output:
                    failures.append(rule)
                    print(f"[FAIL] {rule}: expected an error containing '{expected}'")
                else:
                    print(f"[OK]   {rule}: {expected}")
            except AssertionError as e:
                failures.append(rule)
                print(f"[FAIL] {rule}: could not apply the case ({e})")
            finally:
                for f, data in originals.items():
                    (work / f).write_bytes(data)

    if failures:
        print(f"\n[ERROR] {len(failures)} of {len(CASES)} rule cases were not caught: {', '.join(failures)}")
        sys.exit(1)
    print(f"\n[SUCCESS] validate_seo.py caught all {len(CASES)} rule violations.")


if __name__ == "__main__":
    main()
