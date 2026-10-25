"""
scripts/diagrams/make_finance_diagrams.py - Figures for the personal finance articles

Renders the SVG figures used by five personal finance articles (money management
tips, personal finance rules, budgeting methods, smart money habits and money
skills for your 20s) into public/images/articles/<article-slug>/. Every number in
the charts is computed here from the stated assumptions, so the article text and
the figures stay in sync:

    python scripts/diagrams/make_finance_diagrams.py

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

CARD_APR = 0.2236  # Federal Reserve G.19, August 2026, accounts assessed interest


def payoff(balance, apr, payment):
    """Months and total interest to clear a balance with a fixed monthly payment."""
    rate, months, interest = apr / 12, 0, 0.0
    while balance > 0.005:
        charge = balance * rate
        interest += charge
        balance = balance + charge - min(payment, balance + charge)
        months += 1
    return months, interest


def monthly_balances(payment, annual_rate, years, fee=0.0):
    """End-of-year balances for a fixed monthly contribution, compounded monthly."""
    rate = (annual_rate - fee) / 12
    balance, out = 0.0, [0.0]
    for month in range(1, years * 12 + 1):
        balance = balance * (1 + rate) + payment
        if month % 12 == 0:
            out.append(balance)
    return out


# ---------------------------------------------------------------------------
# 25 money management tips
# ---------------------------------------------------------------------------
def card_payoff():
    payments = [150, 200, 300, 500]
    results = [payoff(5000, CARD_APR, p) for p in payments]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(left=0.14, right=0.97, top=0.88, bottom=0.17)
    style(ax)
    xs = range(len(payments))
    bars = ax.bar(xs, [r[1] for r in results], color=[AMBER, AMBER, GREEN, GREEN], width=0.55, zorder=3)
    for bar, (months, interest) in zip(bars, results):
        ax.text(bar.get_x() + bar.get_width() / 2, interest + 60, f"${interest:,.0f} interest\n{months} months",
                ha="center", va="bottom", color=FG, fontsize=8.8, linespacing=1.3)
    ax.set_xticks(list(xs))
    ax.set_xticklabels([f"${p}/month" for p in payments])
    ax.set_ylim(0, 3700)
    ax.set_ylabel("total interest paid")
    ax.yaxis.set_major_formatter(lambda v, _: f"${v:,.0f}")
    ax.set_title("Paying off a $5,000 card balance at 22.36% APR", loc="left", color=FG, fontsize=10.5)
    save(fig, "money-management-tips", "credit-card-payoff")


# ---------------------------------------------------------------------------
# 15 personal finance rules
# ---------------------------------------------------------------------------
def fee_drag():
    years = 30
    low = [100000 * (1 + 0.07 - 0.0005) ** y for y in range(years + 1)]
    high = [100000 * (1 + 0.07 - 0.01) ** y for y in range(years + 1)]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(left=0.12, right=0.8, top=0.88, bottom=0.15)
    style(ax)
    ax.plot(range(years + 1), low, color=GREEN)
    ax.plot(range(years + 1), high, color=AMBER)
    ax.text(years + 0.6, low[-1], f"0.05% fee\n${low[-1]:,.0f}", color=GREEN, va="center", fontsize=9)
    ax.text(years + 0.6, high[-1], f"1% fee\n${high[-1]:,.0f}", color=AMBER, va="center", fontsize=9)
    ax.set_xlim(0, years)
    ax.set_xlabel("years")
    ax.yaxis.set_major_formatter(lambda v, _: f"${v / 1000:,.0f}k")
    ax.set_title("$100,000 growing at 7% a year before fees", loc="left", color=FG, fontsize=10.5)
    save(fig, "personal-finance-rules", "fee-drag")


# ---------------------------------------------------------------------------
# 20 budgeting methods
# ---------------------------------------------------------------------------
def budget_chooser():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.9))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    rows = [
        ("I want rules, not tracking", "50/30/20, 60% solution,\npay yourself first, anti-budget"),
        ("I overspend and need control", "zero-based, envelope,\ncash-only, 30-day rule"),
        ("My income changes month to month", "baseline budget, last month's\nincome, priority-based"),
        ("I have one big goal", "reverse budget, sinking funds,\ndebt snowball or avalanche"),
    ]
    ax.text(25, 95, "if this sounds like you", ha="center", color=FG2, fontsize=9)
    ax.text(75, 95, "start with", ha="center", color=FG2, fontsize=9)
    for i, (need, methods) in enumerate(rows):
        y = 70 - i * 22
        box(ax, 3, y, 44, 16, need, edge=GRID, face=BG2, title_color=FG, size=9.4)
        box(ax, 55, y, 42, 16, methods, edge=GREEN, face=BG2, title_color=GREEN, size=8.8)
        connect(ax, (47.8, y + 8), (54.2, y + 8), color=FG2, lw=1.1)
    save(fig, "budgeting-methods", "budget-chooser")


# ---------------------------------------------------------------------------
# 30 smart money habits
# ---------------------------------------------------------------------------
def habit_cadence():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.8))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    cols = [
        ("Daily", "habits 1–6", "pause before buying\nuse a list\ncheck alerts"),
        ("Weekly", "habits 7–13", "10-minute money check\nreview transactions\nplan meals"),
        ("Monthly", "habits 14–22", "pay card in full\nmove savings first\nreview the budget"),
        ("Yearly", "habits 23–30", "raise savings rate\ncheck credit reports\nreview insurance"),
    ]
    w, gap = 22.5, 2
    for i, (title, tag, body) in enumerate(cols):
        x = 2 + i * (w + gap)
        ax.add_patch(plt.Rectangle((x, 6), w, 74, facecolor=BG2, edgecolor=GREEN if i == 2 else GRID,
                                   linewidth=1.3))
        ax.text(x + w / 2, 76, title, ha="center", va="top", color=GREEN, fontsize=10.5, fontweight="bold")
        ax.text(x + w / 2, 62, tag, ha="center", va="top", color=FG2, fontsize=8.6)
        ax.text(x + w / 2, 48, body, ha="center", va="top", color=FG, fontsize=8.6, linespacing=1.45)
    connect(ax, (6, 90), (94, 90), color=FG2, lw=1.2)
    ax.text(6, 84, "small, frequent", color=FG2, fontsize=8.6)
    ax.text(94, 84, "bigger, less often", color=FG2, fontsize=8.6, ha="right")
    save(fig, "smart-money-habits", "habit-cadence")


# ---------------------------------------------------------------------------
# 10 money skills for your 20s
# ---------------------------------------------------------------------------
def start_early():
    early = monthly_balances(300, 0.07, 40)  # from 25 to 65
    late = [0.0] * 10 + monthly_balances(300, 0.07, 30)  # from 35 to 65
    ages = list(range(25, 66))
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(left=0.12, right=0.78, top=0.88, bottom=0.15)
    style(ax)
    ax.plot(ages, early, color=GREEN)
    ax.plot(ages, late, color=AMBER)
    ax.text(65.6, early[-1], f"start at 25\n${early[-1]:,.0f}\n($144,000 paid in)", color=GREEN, va="center",
            fontsize=8.8)
    ax.text(65.6, late[-1], f"start at 35\n${late[-1]:,.0f}\n($108,000 paid in)", color=AMBER, va="center",
            fontsize=8.8)
    ax.set_xlim(25, 65)
    ax.set_xlabel("age")
    ax.yaxis.set_major_formatter(lambda v, _: f"${v / 1000:,.0f}k")
    ax.set_title("$300 a month at an assumed 7% annual return", loc="left", color=FG, fontsize=10.5)
    save(fig, "money-management-skills-in-your-20s", "start-early")


def main():
    only = os.environ.get("FINANCE_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [card_payoff, fee_drag, budget_chooser, habit_cadence, start_early]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
