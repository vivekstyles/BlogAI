"""
scripts/diagrams/make_ai_diagrams.py - Diagrams for the AI-in-industry articles

Renders the SVG figures used by five articles on AI across industries and work into
public/images/articles/<article-slug>/. Chart values are copied from the published
sources cited in each article (McKinsey State of AI 2025, Bastani et al. PNAS 2025,
and the productivity studies listed in time_change_by_study); the script prints them
so they can be checked against the alt text. If a source number changes in an article,
change it here too and re-run:

    python scripts/diagrams/make_ai_diagrams.py

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
    FG,
    FG2,
    GREEN,
    GREEN_MUTED,
    GRID,
    WIDTH_IN,
    blank,
    box,
    connect,
    save,
    style,
)


def bar_labels(ax, bars, values, fmt, offset):
    for bar, value in zip(bars, values):
        x = bar.get_width()
        ax.text(x + (offset if x >= 0 else -offset), bar.get_y() + bar.get_height() / 2, fmt(value),
                va="center", ha="left" if x >= 0 else "right", color=FG, fontsize=9.5)


# ---------------------------------------------------------------------------
# 25 examples of how AI is transforming industries in 2026
# ---------------------------------------------------------------------------
def industries_adoption_vs_impact():
    # McKinsey, The state of AI in 2025 (November 2025), survey of 1,993 respondents.
    rows = [
        ("Regularly use AI in at least one function", 88),
        ("At least experimenting with AI agents", 62),
        ("Report any enterprise-level EBIT impact", 39),
        ("Scaling an agentic AI system somewhere", 23),
        ("High performers: 5%+ of EBIT from AI", 6),
    ]
    for label, value in rows:
        print(f"  {label}: {value}%")
    labels = [r[0] for r in rows][::-1]
    values = [r[1] for r in rows][::-1]
    colors = [AMBER if v < 40 else GREEN for v in values]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    ax.grid(axis="y", visible=False)
    bars = ax.barh(labels, values, color=colors, height=0.62)
    bar_labels(ax, bars, values, lambda v: f"{v}%", 1.2)
    ax.set_xlim(0, 100)
    ax.set_xlabel("share of survey respondents")
    ax.tick_params(axis="y", labelsize=9.5, colors=FG)
    fig.subplots_adjust(left=0.42, right=0.96, bottom=0.16, top=0.96)
    save(fig, "ai-transforming-industries-examples", "adoption-vs-impact")


# ---------------------------------------------------------------------------
# 30 AI applications in healthcare, finance and education
# ---------------------------------------------------------------------------
def education_guardrails():
    # Bastani et al. (2025), PNAS 122(26): change relative to the control group.
    practice = {"GPT Base": 48, "GPT Tutor": 127}
    exam = {"GPT Base": -17, "GPT Tutor": 0}  # GPT Tutor: no statistically significant difference
    print(f"  practice {practice}, exam {exam} (GPT Tutor exam effect not significant)")
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.3), sharey=False)
    for ax, title, data in [(axes[0], "Practice sessions, with AI", practice),
                            (axes[1], "Later exam, without AI", exam)]:
        style(ax)
        ax.grid(axis="x", visible=False)
        names = list(data)
        values = list(data.values())
        colors = [GREEN if v > 0 else AMBER if v < 0 else FG2 for v in values]
        bars = ax.bar(names, values, color=colors, width=0.55)
        ax.axhline(0, color=FG2, linewidth=0.9)
        ax.set_title(title)
        for bar, v, name in zip(bars, values, names):
            if v == 0:
                ax.text(bar.get_x() + bar.get_width() / 2, 2, "no significant\ndifference", ha="center", va="bottom",
                        color=FG2, fontsize=8.8)
            else:
                y = v + (3 if v > 0 else -3)
                ax.text(bar.get_x() + bar.get_width() / 2, y, f"{v:+d}%", ha="center",
                        va="bottom" if v > 0 else "top", color=FG, fontsize=9.5)
        ax.tick_params(axis="x", colors=FG)
    axes[0].set_ylim(0, 145)
    axes[1].set_ylim(-28, 20)
    axes[0].set_ylabel("change vs. students without AI")
    fig.subplots_adjust(left=0.1, right=0.98, bottom=0.1, top=0.88, wspace=0.3)
    save(fig, "ai-applications-healthcare-finance-education", "guardrails-practice-vs-exam")


# ---------------------------------------------------------------------------
# 40 ways AI is changing business operations, marketing and sales
# ---------------------------------------------------------------------------
def business_autonomy_levels():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    levels = [
        (3, "1. Assist", "AI suggests, a person decides",
         "support reply suggestions\nseller copilots\ncoding autocomplete", "checkpoint: every decision"),
        (36, "2. Draft", "AI produces, a person reviews",
         "ad variations\nmeeting notes and CRM entries\ncontract summaries", "checkpoint: before use"),
        (69, "3. Act", "AI executes within set limits",
         "small claims under a limit\nfreight quotes\nsupplier negotiation bots", "checkpoint: audit samples"),
    ]
    for x, title, subtitle, examples, check in levels:
        box(ax, x, 46, 28, 44, title, f"{subtitle}\n\n{examples}", edge=GREEN, face=BG, title_color=GREEN, size=10)
        box(ax, x, 24, 28, 12, check, face=GREEN_MUTED, edge=GREEN, size=8.8)
        connect(ax, (x + 14, 45), (x + 14, 37.2), color=FG2)
    connect(ax, (31.6, 68), (35.4, 68), color=FG2)
    connect(ax, (64.6, 68), (68.4, 68), color=FG2)
    connect(ax, (5, 12), (95, 12), color=AMBER, lw=1.6)
    ax.text(50, 6, "more labor saved, but more need for limits, monitoring and a route to a person",
            ha="center", va="center", color=AMBER, fontsize=9.2)
    save(fig, "ai-in-business-operations-marketing-sales", "autonomy-levels")


# ---------------------------------------------------------------------------
# 50 AI use cases in manufacturing, retail and logistics
# ---------------------------------------------------------------------------
def value_chain_map():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    stages = [
        (2, "Manufacturing", "entries 1–16",
         "design and engineering\nproduction and quality\nmaintenance and robotics"),
        (36, "Logistics", "entries 35–50",
         "warehousing\ntransport and last mile\nplanning"),
        (70, "Retail", "entries 17–34",
         "demand and pricing\nshopping and discovery\nstores and service"),
    ]
    for x, title, entries, body in stages:
        box(ax, x, 34, 28, 52, title, f"{entries}\n\n{body}", edge=GREEN, face=BG, title_color=GREEN, size=10.5)
    connect(ax, (30.6, 66), (35.4, 66), color=GREEN, lw=1.6)
    connect(ax, (64.6, 66), (69.4, 66), color=GREEN, lw=1.6)
    ax.text(50, 92, "goods flow", ha="center", color=GREEN, fontsize=9.5)
    connect(ax, (84, 32), (16, 32), color=AMBER, lw=1.4, rad=-0.18)
    ax.text(50, 8, "demand data flows back: sales, returns and forecasts drive planning and production",
            ha="center", color=AMBER, fontsize=9.2)
    save(fig, "ai-use-cases-manufacturing-retail-logistics", "use-case-map")


# ---------------------------------------------------------------------------
# 75 examples of how AI is changing the future of work
# ---------------------------------------------------------------------------
def time_change_by_study():
    # Change in time to complete tasks with AI, from each study's headline result.
    rows = [
        ("Coding task, GitHub Copilot (2023)", -55.8),  # Peng et al., 2023
        ("Writing tasks, ChatGPT (2023)", -40.0),  # Noy & Zhang, Science, 2023
        ("Consulting tasks, GPT-4 (2023)", -25.1),  # Dell'Acqua et al., inside the frontier
        ("Security analysis, Copilot (2024)", -22.0),  # Microsoft, experienced analysts
        ("Expert developers, own code (2025)", 19.0),  # METR, 2025
    ]
    for label, value in rows:
        print(f"  {label}: {value:+.1f}%")
    labels = [r[0] for r in rows][::-1]
    values = [r[1] for r in rows][::-1]
    colors = [GREEN if v < 0 else AMBER for v in values]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    ax.grid(axis="y", visible=False)
    bars = ax.barh(labels, values, color=colors, height=0.6)
    for bar, v in zip(bars, values):
        x = bar.get_width()
        ax.text(x + (1.5 if v > 0 else -1.5), bar.get_y() + bar.get_height() / 2,
                f"{abs(v):g}% {'more' if v > 0 else 'less'} time", va="center",
                ha="left" if v > 0 else "right", color=FG, fontsize=9)
    ax.axvline(0, color=FG2, linewidth=0.9)
    ax.set_xlim(-100, 55)
    ax.set_xlabel("change in time to complete tasks with AI (%)")
    ax.tick_params(axis="y", labelsize=9.2, colors=FG)
    fig.subplots_adjust(left=0.36, right=0.98, bottom=0.16, top=0.96)
    save(fig, "ai-future-of-work-examples", "time-change-by-study")


def main():
    only = os.environ.get("AI_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [industries_adoption_vs_impact, education_guardrails, business_autonomy_levels, value_chain_map,
               time_change_by_study]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
