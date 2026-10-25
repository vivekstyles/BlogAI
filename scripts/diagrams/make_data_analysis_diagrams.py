"""
scripts/diagrams/make_data_analysis_diagrams.py - Figures for the data analysis articles

Renders the SVG figures used by five data analysis articles (beginner projects,
analysis techniques, tools, SQL queries and data visualization techniques) into
public/images/articles/<article-slug>/. Most figures are diagrams of the structure
each article describes. The visualization article's charts use small, invented
numbers fixed in this file (labeled as illustrative in the article), so they are
the same on every machine:

    python scripts/diagrams/make_data_analysis_diagrams.py

Styling, colors and helpers come from make_ml_diagrams.py: dark neutral background,
green accent, amber as the only second accent, solid fills only, and no blue.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import matplotlib.pyplot as plt  # noqa: E402

from make_ml_diagrams import (  # noqa: E402
    AMBER,
    BG,
    BG2,
    FG,
    FG2,
    GREEN,
    GRID,
    NEUTRAL,
    WIDTH_IN,
    blank,
    box,
    connect,
    save,
    style,
)

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
# Invented monthly sales (thousands) for five regions, used by the visualization figures
REGIONS = {
    "North": [42, 44, 47, 46, 49, 52, 51, 53, 55, 57, 60, 66],
    "South": [38, 37, 39, 41, 40, 42, 44, 43, 45, 44, 47, 52],
    "East": [30, 32, 31, 33, 35, 34, 36, 38, 37, 39, 41, 45],
    "West": [36, 35, 33, 31, 30, 28, 27, 26, 25, 24, 24, 26],
    "Central": [25, 27, 26, 28, 29, 31, 30, 32, 33, 32, 35, 38],
}


# ---------------------------------------------------------------------------
# 25 data analysis projects for beginners
# ---------------------------------------------------------------------------
def project_roadmap():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.8))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    levels = [
        (2, "Level 1: spreadsheets", "projects 1–9",
         "sort, filter, formulas\npivot tables\ncharts\ncleaning text and dates"),
        (35, "Level 2: SQL", "projects 10–17",
         "SELECT, WHERE, GROUP BY\njoins\nwindow functions\ncohorts and funnels"),
        (68, "Level 3: BI and Python", "projects 18–25",
         "dashboards\npandas notebooks\nautomated reports\na case study of your own"),
    ]
    for x, title, projects, body in levels:
        box(ax, x, 30, 30, 60, title, f"{projects}\n\n{body}", edge=GREEN, face=BG, title_color=GREEN, size=9.8)
    connect(ax, (32.6, 60), (34.4, 60), color=GREEN, lw=1.6)
    connect(ax, (65.6, 60), (67.4, 60), color=GREEN, lw=1.6)
    ax.text(50, 14, "every project ends with a written answer to its question, not just a chart",
            ha="center", color=FG2, fontsize=9.2)
    save(fig, "data-analysis-projects-for-beginners", "project-roadmap")


def analysis_workflow():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.6))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    steps = [
        ("Question", "who decides what,\nwith this answer?"),
        ("Data", "source, licence,\nwhat one row means"),
        ("Clean", "types, duplicates,\nmissing values"),
        ("Analyze", "compare, trend,\nsegment, test"),
        ("Share", "finding first,\nchart, caveats"),
    ]
    w, gap = 17.2, 2.8
    for i, (title, body) in enumerate(steps):
        x = 1 + i * (w + gap)
        edge = GREEN if i in (0, 4) else GRID
        box(ax, x, 32, w, 56, title, body, edge=edge, title_color=GREEN if i in (0, 4) else FG, size=9.4)
        if i < len(steps) - 1:
            connect(ax, (x + w + 0.5, 60), (x + w + gap - 0.5, 60), color=FG2, lw=1.3)
    ax.text(50, 14, "most time goes into Data and Clean; most value comes from Question and Share",
            ha="center", color=FG2, fontsize=9.0)
    save(fig, "data-analysis-projects-for-beginners", "analysis-workflow")


# ---------------------------------------------------------------------------
# 15 data analysis techniques
# ---------------------------------------------------------------------------
def technique_chooser():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.9))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    rows = [
        ("What does the data look like?", "descriptive statistics, cleaning, EDA (1–3)"),
        ("How do groups differ?", "segmentation, Pareto (4, 15)"),
        ("Do two things move together?", "correlation, regression (5, 6)"),
        ("Is a difference real or noise?", "hypothesis tests, A/B tests (7, 8)"),
        ("How does it change over time?", "time series, cohorts, funnels (9–11)"),
        ("Which customers are alike?", "RFM, clustering (12, 13)"),
        ("What is unusual?", "outlier and anomaly detection (14)"),
    ]
    for i, (question, answer) in enumerate(rows):
        y = 88 - i * 12.6
        box(ax, 2, y - 8, 43, 9.4, question, edge=GRID, size=9.0)
        box(ax, 55, y - 8, 43, 9.4, answer, edge=GREEN, title_color=GREEN, size=8.6)
        connect(ax, (45.8, y - 3.3), (54.2, y - 3.3), color=GREEN, lw=1.2)
    save(fig, "data-analysis-techniques", "technique-chooser")


# ---------------------------------------------------------------------------
# 20 data analysis tools
# ---------------------------------------------------------------------------
def tool_stack():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    layers = [
        ("Store and query", "PostgreSQL, SQLite, DuckDB, BigQuery", GRID, FG),
        ("Clean and prepare", "Power Query, OpenRefine, dbt", GRID, FG),
        ("Analyze", "Excel, Google Sheets, Python + pandas/Polars, R, KNIME", GREEN, GREEN),
        ("Share", "Power BI, Tableau, Data Studio, Metabase, Superset", GRID, FG),
    ]
    for i, (title, tools, edge, color) in enumerate(layers):
        y = 76 - i * 21
        box(ax, 2, y, 26, 16, title, edge=edge, title_color=color, size=9.6)
        ax.text(32, y + 8, tools, va="center", color=FG2, fontsize=9.2)
        if i < len(layers) - 1:
            connect(ax, (15, y - 0.6), (15, y - 4.4), color=FG2, lw=1.1)
    ax.text(98, 5, "notebooks and IDEs (Jupyter, Positron, VS Code) and Git sit across every layer",
            ha="right", color=FG2, fontsize=8.6)
    save(fig, "data-analysis-tools", "tool-stack")


# ---------------------------------------------------------------------------
# 30 SQL queries
# ---------------------------------------------------------------------------
def shop_schema():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    tables = {
        "customers": (2, 46, ["customer_id  PK", "name", "email", "country", "signup_date"]),
        "orders": (27, 46, ["order_id  PK", "customer_id  FK", "order_date", "status"]),
        "order_items": (52, 46, ["order_id  FK", "product_id  FK", "quantity", "unit_price"]),
        "products": (77, 46, ["product_id  PK", "name", "category", "price"]),
        "events": (27, 4, ["session_id", "customer_id", "event_name", "event_time"]),
    }
    for name, (x, y, cols) in tables.items():
        h = 44 if name != "events" else 32
        y0 = y if name != "events" else y
        box(ax, x, y0, 21, h, name, "\n".join(cols), edge=GREEN if name != "events" else GRID,
            title_color=GREEN if name != "events" else FG, size=9.0)
    connect(ax, (23.6, 78), (26.4, 78), color=FG2, style_="-", lw=1.2)
    connect(ax, (48.6, 78), (51.4, 78), color=FG2, style_="-", lw=1.2)
    connect(ax, (76.4, 78), (73.6, 78), color=FG2, style_="-", lw=1.2)
    for x, label in ((25, "1 : n"), (50, "1 : n"), (75, "n : 1")):
        ax.text(x, 96, label, ha="center", color=FG2, fontsize=8.2)
    ax.text(52, 26, "15 customers · 8 products · 39 orders\n61 order lines · 93 web events (40 sessions)",
            color=FG2, fontsize=9.0, va="center")
    save(fig, "sql-queries-for-data-analysts", "shop-schema")


# ---------------------------------------------------------------------------
# 10 data visualization techniques
# ---------------------------------------------------------------------------
def chart_chooser():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    rows = [
        ("Compare categories", "sorted bar chart"),
        ("Show change over time", "line chart"),
        ("Show a distribution", "histogram, box or dot plot"),
        ("Show a relationship", "scatter plot"),
        ("Show part of a whole", "stacked bar; pie only for 2–3 parts"),
        ("Show many groups", "small multiples or a heatmap"),
    ]
    for i, (question, answer) in enumerate(rows):
        y = 87 - i * 14.4
        box(ax, 2, y - 9, 40, 10.5, question, edge=GRID, size=9.2)
        box(ax, 52, y - 9, 46, 10.5, answer, edge=GREEN, title_color=GREEN, size=9.0)
        connect(ax, (42.8, y - 3.8), (51.2, y - 3.8), color=GREEN, lw=1.2)
    save(fig, "data-visualization-techniques", "chart-chooser")


def declutter():
    totals = {k: sum(v) for k, v in REGIONS.items()}
    order = sorted(totals, key=totals.get)
    fig, (a, b) = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.2))
    fig.subplots_adjust(left=0.1, right=0.97, top=0.84, bottom=0.16, wspace=0.42)
    names = list(REGIONS)
    clutter = [AMBER, GREEN, NEUTRAL, FG2, "#8a6d1f"]
    a.bar(names, [totals[n] for n in names], color=clutter, edgecolor=FG, linewidth=1.2)
    a.grid(True, axis="both", linewidth=1.0)
    a.set_axisbelow(True)
    a.set_ylim(250, 650)
    a.set_title("Before", loc="left", color=FG2)
    a.set_ylabel("Sales")
    a.tick_params(axis="x", labelrotation=35, labelsize=8.5)
    for spine in a.spines.values():
        spine.set_color(FG2)

    colors = [GREEN if n == "West" else NEUTRAL for n in order]
    b.barh(order, [totals[n] for n in order], color=colors)
    for i, n in enumerate(order):
        b.text(totals[n] + 6, i, f"{totals[n]}k", va="center", color=FG if n == "West" else FG2, fontsize=9)
    b.set_xlim(0, 720)
    b.set_xticks([])
    for side in ("top", "right", "bottom"):
        b.spines[side].set_visible(False)
    b.spines["left"].set_color(GRID)
    b.set_title("After: West is the smallest region", loc="left", color=FG, fontsize=10.5)
    b.tick_params(axis="y", length=0)
    save(fig, "data-visualization-techniques", "declutter-before-after")


def highlight_line():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.2))
    fig.subplots_adjust(left=0.08, right=0.86, top=0.86, bottom=0.12)
    style(ax)
    ax.grid(True, axis="y")
    ax.grid(False, axis="x")
    for name, values in REGIONS.items():
        hi = name == "West"
        ax.plot(MONTHS, values, color=GREEN if hi else NEUTRAL, linewidth=2.6 if hi else 1.4,
                zorder=3 if hi else 2)
        ax.text(11.25, values[-1], name, va="center", color=GREEN if hi else FG2, fontsize=9,
                fontweight="bold" if hi else "normal")
    ax.annotate("West fell from 36k in January\nto 24k in October and November", xy=(7, REGIONS["West"][7]),
                xytext=(4.2, 13),
                color=FG, fontsize=9, arrowprops=dict(arrowstyle="-", color=FG2, lw=1))
    ax.set_ylim(10, 70)
    ax.set_ylabel("Monthly sales (thousands)")
    ax.set_title("Sales by region, illustrative data", loc="left", color=FG2, fontsize=10)
    ax.tick_params(axis="x", labelsize=8.5)
    save(fig, "data-visualization-techniques", "highlight-one-line")


def small_multiples():
    fig, axes = plt.subplots(1, 5, figsize=(WIDTH_IN, 2.4), sharey=True)
    fig.subplots_adjust(left=0.07, right=0.99, top=0.8, bottom=0.14, wspace=0.12)
    for ax, (name, values) in zip(axes, REGIONS.items()):
        for other in REGIONS.values():
            ax.plot(range(12), other, color=GRID, linewidth=1)
        ax.plot(range(12), values, color=GREEN, linewidth=2)
        ax.set_title(name, fontsize=9.5, color=FG)
        ax.set_xticks([0, 11], ["Jan", "Dec"])
        ax.tick_params(labelsize=8)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)
        for side in ("left", "bottom"):
            ax.spines[side].set_color(GRID)
    axes[0].set_ylim(15, 70)
    save(fig, "data-visualization-techniques", "small-multiples")


def same_mean_distributions():
    import numpy as np

    rng = np.random.default_rng(1)  # same seed and draws as the snippet in the article
    a = rng.normal(50, 5, 500)
    b = np.concatenate([rng.normal(40, 3, 250), rng.normal(60, 3, 250)])
    print(f"  means: {a.mean():.1f} vs {b.mean():.1f}")
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 2.6), sharey=True)
    fig.subplots_adjust(left=0.07, right=0.98, top=0.84, bottom=0.13, wspace=0.08)
    for ax, data, title in zip(axes, [a, b], ["Group A: one peak", "Group B: two peaks"]):
        style(ax)
        ax.grid(False, axis="x")
        ax.hist(data, bins=30, color=NEUTRAL, edgecolor=BG, linewidth=0.5)
        ax.axvline(data.mean(), color=GREEN, linewidth=2)
        ax.text(data.mean() + 0.8, 52, f"mean {data.mean():.1f}", color=GREEN, fontsize=9)
        ax.set_title(title, loc="left", fontsize=10)
    axes[0].set_ylim(0, 58)
    save(fig, "data-visualization-techniques", "same-mean-distributions")


def main():
    only = os.environ.get("DA_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [project_roadmap, analysis_workflow, technique_chooser, tool_stack, shop_schema, chart_chooser,
               declutter, highlight_line, small_multiples, same_mean_distributions]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()
    totals = {k: sum(v) for k, v in REGIONS.items()}
    print("region totals:", totals)


if __name__ == "__main__":
    main()
