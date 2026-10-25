"""
scripts/diagrams/make_income_diagrams.py - Figures for the earning-money articles

Renders the SVG figures used by five articles about earning extra income (making
money online, side hustles, passive income, making money from home and AI tools)
into public/images/articles/<article-slug>/. Every number in the charts is computed
here from the stated assumptions, so the article text and the figures stay in sync:

    python scripts/diagrams/make_income_diagrams.py

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
    BG2,
    FG,
    FG2,
    GREEN,
    GRID,
    WIDTH_IN,
    blank,
    box,
    connect,
    save,
    style,
)

IRS_MILEAGE = 0.76  # IRS Announcement 2026-11, business miles from 1 July 2026
SE_TAX = 0.153  # 12.4% Social Security + 2.9% Medicare
SE_BASE = 0.9235  # Schedule SE applies the tax to 92.35% of net earnings


def gig_hour(gross=22.0, miles=15.0):
    """Gross pay for one delivery hour, minus mileage cost and self-employment tax."""
    car = miles * IRS_MILEAGE
    net = gross - car
    se = net * SE_BASE * SE_TAX
    return gross, car, se, net - se


def capital_needed(monthly, rate):
    """Balance that produces `monthly` dollars a month at a simple annual yield."""
    return monthly * 12 / rate


# ---------------------------------------------------------------------------
# 25 ways to make money online for beginners
# ---------------------------------------------------------------------------
def online_chooser():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.9))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    rows = [
        ("I have a skill people pay for", "freelancing: ways 1–10\nfirst payment in days to weeks"),
        ("I have spare time, no skill yet", "studies and testing: ways 11–13\nsmall amounts, paid quickly"),
        ("I have things or can make things", "selling: ways 14–18\npaid per sale, some upfront work"),
        ("I can wait months for results", "audience: ways 19–25\nslow start, can grow over years"),
    ]
    ax.text(25, 95, "if this sounds like you", ha="center", color=FG2, fontsize=9)
    ax.text(75, 95, "start with", ha="center", color=FG2, fontsize=9)
    for i, (need, ways) in enumerate(rows):
        y = 70 - i * 22
        box(ax, 3, y, 44, 16, need, edge=GRID, face=BG2, title_color=FG, size=9.4)
        box(ax, 55, y, 42, 16, ways, edge=GREEN, face=BG2, title_color=GREEN, size=8.8)
        connect(ax, (47.8, y + 8), (54.2, y + 8), color=FG2, lw=1.1)
    save(fig, "make-money-online-for-beginners", "online-chooser")


# ---------------------------------------------------------------------------
# 15 side hustle ideas
# ---------------------------------------------------------------------------
def gig_true_hourly():
    gross, car, se, keep = gig_hour()
    labels = ["gross pay", "car cost\n(15 mi at 76¢)", "self-employment\ntax", "left before\nincome tax"]
    values = [gross, -car, -se, keep]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(left=0.1, right=0.97, top=0.88, bottom=0.2)
    style(ax)
    running, bottoms, heights, colors = gross, [], [], []
    for i, v in enumerate(values):
        if i == 0:
            bottoms.append(0)
            heights.append(v)
            colors.append(GREEN)
        elif i == len(values) - 1:
            bottoms.append(0)
            heights.append(v)
            colors.append(GREEN)
        else:
            running += v
            bottoms.append(running)
            heights.append(-v)
            colors.append(AMBER)
    xs = range(len(values))
    ax.bar(xs, heights, bottom=bottoms, color=colors, width=0.55, zorder=3)
    for x, b, h, v in zip(xs, bottoms, heights, values):
        text = f"${v:,.2f}" if v > 0 else f"−${-v:,.2f}"
        ax.text(x, b + h + 0.5, text, ha="center", va="bottom", color=FG, fontsize=9)
    ax.set_xticks(list(xs))
    ax.set_xticklabels(labels, fontsize=8.8)
    ax.set_ylim(0, 26)
    ax.yaxis.set_major_formatter(lambda v, _: f"${v:,.0f}")
    ax.set_title("One delivery hour: $22 gross, 15 miles driven (assumptions)", loc="left", color=FG,
                 fontsize=10.5)
    save(fig, "side-hustle-ideas", "gig-true-hourly")


# ---------------------------------------------------------------------------
# 20 passive income ideas
# ---------------------------------------------------------------------------
def capital_for_500():
    rates = [
        ("savings, national average 0.38%", 0.0038),
        ("12-month CD, national average 1.76%", 0.0176),
        ("4% withdrawal rule of thumb", 0.04),
        ("I bond composite 4.26%", 0.0426),
    ]
    needed = [capital_needed(500, r) for _, r in rates]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    fig.subplots_adjust(left=0.37, right=0.86, top=0.86, bottom=0.12)
    style(ax)
    ys = range(len(rates))
    ax.barh(ys, needed, color=[AMBER, AMBER, GREEN, GREEN], height=0.55, zorder=3)
    for y, n in zip(ys, needed):
        ax.text(n + 25000, y, f"${n:,.0f}", va="center", color=FG, fontsize=9)
    ax.set_yticks(list(ys))
    ax.set_yticklabels([label for label, _ in rates], fontsize=8.8)
    ax.invert_yaxis()
    ax.set_xlim(0, 1_900_000)
    ax.set_xticks([0, 500_000, 1_000_000, 1_500_000])
    ax.xaxis.set_major_formatter(lambda v, _: f"${v / 1e6:,.1f}M")
    ax.set_title("Money needed to produce $500 a month at each yield", loc="left", color=FG, fontsize=10.5)
    save(fig, "passive-income-ideas", "capital-for-500")


# ---------------------------------------------------------------------------
# 30 ways to make money from home
# ---------------------------------------------------------------------------
def startup_cost_tiers():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    cols = [
        ("About $0", "ideas 1–12", "skills you have\nsell what you own\nstudies, testing"),
        ("Under $50", "ideas 13–22", "basic supplies\nsmall listing fees\none paid tool"),
        ("$100 or more", "ideas 23–30", "permits or checks\ninsurance\nequipment"),
    ]
    w, gap = 30, 3
    for i, (title, tag, body) in enumerate(cols):
        x = 3 + i * (w + gap)
        ax.add_patch(plt.Rectangle((x, 6), w, 72, facecolor=BG2, edgecolor=GREEN if i == 0 else GRID,
                                   linewidth=1.3))
        ax.text(x + w / 2, 74, title, ha="center", va="top", color=GREEN, fontsize=10.5, fontweight="bold")
        ax.text(x + w / 2, 60, tag, ha="center", va="top", color=FG2, fontsize=8.6)
        ax.text(x + w / 2, 46, body, ha="center", va="top", color=FG, fontsize=8.8, linespacing=1.45)
    connect(ax, (6, 90), (94, 90), color=FG2, lw=1.2)
    ax.text(6, 84, "start today", color=FG2, fontsize=8.6)
    ax.text(94, 84, "check local rules first", color=FG2, fontsize=8.6, ha="right")
    save(fig, "make-money-from-home", "startup-cost-tiers")


# ---------------------------------------------------------------------------
# 10 AI tools to make money online
# ---------------------------------------------------------------------------
TOOL_STACK = [  # list prices on the vendors' pricing pages, 25 October 2026, monthly billing
    ("Claude Pro", 20),
    ("Descript (from)", 16),
    ("Midjourney Basic", 10),
    ("ElevenLabs Starter", 6),
]


def tool_break_even():
    total = sum(p for _, p in TOOL_STACK)
    rates = [15, 25, 50]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    fig.subplots_adjust(left=0.1, right=0.97, top=0.86, bottom=0.17)
    style(ax)
    xs = range(len(rates))
    hours = [total / r for r in rates]
    ax.bar(xs, hours, color=GREEN, width=0.5, zorder=3)
    for x, h, r in zip(xs, hours, rates):
        ax.text(x, h + 0.08, f"{h:.1f} hours", ha="center", va="bottom", color=FG, fontsize=9.2)
    ax.set_xticks(list(xs))
    ax.set_xticklabels([f"you earn ${r}/hour" for r in rates])
    ax.set_ylim(0, 4.4)
    ax.set_ylabel("billable hours per month")
    ax.set_title(f"Hours of paid work to cover a ${total}/month tool stack", loc="left", color=FG, fontsize=10.5)
    save(fig, "ai-tools-to-make-money", "tool-break-even")


def main():
    only = os.environ.get("INCOME_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [online_chooser, gig_true_hourly, capital_for_500, startup_cost_tiers, tool_break_even]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
