"""
scripts/diagrams/make_llm_diagrams.py - Figures for the large language model articles

Renders the SVG figures used by five LLM articles (history of language models,
LLM milestones, important LLMs explained, LLM breakthroughs and open-source LLMs)
into public/images/articles/<article-slug>/. The parameter-count chart uses only
sizes published in the papers and model cards cited in the articles; models whose
size was not disclosed are drawn in a separate row, not estimated:

    python scripts/diagrams/make_llm_diagrams.py

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
    GREEN_MUTED,
    GRID,
    NEUTRAL,
    WIDTH_IN,
    blank,
    box,
    connect,
    save,
    style,
)


# ---------------------------------------------------------------------------
# 25 years of language models
# ---------------------------------------------------------------------------
def language_model_eras():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    x0, x1 = 3, 97

    def xpos(year):
        return x0 + (year - 2001) / (2026.9 - 2001) * (x1 - x0)

    eras = [
        (2001, 2010, "Statistical", "steps 1–4", "smoothed n-grams\nneural LM (2003)\n2T-token n-grams (2007)"),
        (2010, 2017, "Neural", "steps 5–10", "recurrent LMs\nword2vec\nseq2seq, attention"),
        (2017, 2022, "Transformers", "steps 11–16", "Transformer\nBERT and GPT\nscaling laws, GPT-3"),
        (2022, 2026.9, "Assistants", "steps 17–25", "RLHF, ChatGPT\nopen weights\nreasoning, agents"),
    ]
    for i, (a, b, title, steps, body) in enumerate(eras):
        edge = GREEN if i == 3 else GRID
        box(ax, xpos(a) + 0.5, 36, xpos(b) - xpos(a) - 1.0, 50, title, f"{steps}\n\n{body}", edge=edge,
            face=BG2, title_color=GREEN, size=9.2)
    ax.plot([x0, x1], [18, 18], color=FG2, lw=1.2)
    for year in [2001, 2005, 2010, 2015, 2017, 2020, 2022, 2026]:
        ax.plot([xpos(year)] * 2, [16.5, 19.5], color=FG2, lw=1.2)
        ax.text(xpos(year), 9, str(year), ha="center", color=FG2, fontsize=8.8)
    save(fig, "history-of-language-models", "language-model-eras")


# ---------------------------------------------------------------------------
# 15 milestones in the evolution of LLMs
# ---------------------------------------------------------------------------
def llm_training_stack():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.8))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    layers = [
        ("Tools, long context and agents", "6, 12, 15"),
        ("Reasoning with reinforcement learning", "13, 14"),
        ("Instruction tuning and RLHF", "7"),
        ("Scaling: compute and data", "4, 8"),
        ("Pretraining on large text", "2, 3"),
        ("Transformer architecture", "1"),
    ]
    top, h, gap = 92, 12.2, 2.0
    for i, (title, ms) in enumerate(layers):
        y = top - (i + 1) * h - i * gap
        edge = GREEN if i == 0 else GRID
        ax.add_patch(plt.Rectangle((3, y), 62, h, facecolor=BG2, edgecolor=edge, linewidth=1.2))
        ax.text(5, y + h / 2, title, va="center", color=FG, fontsize=10, fontweight="bold")
        ax.text(63, y + h / 2, ms, va="center", ha="right", color=GREEN, fontsize=9.5, fontweight="bold")
    ax.text(34, 96, "built bottom to top (green numbers are milestones)", ha="center", color=FG2, fontsize=9)
    box(ax, 72, 54, 25, 30, "Reaching people", "ChatGPT: milestone 9\nGPT-4: milestone 11\nopen weights:\nmilestone 10",
        edge=AMBER, face=BG, title_color=AMBER, size=9.2)
    connect(ax, (66, 69), (71, 69), color=AMBER, lw=1.4)
    ax.text(84.5, 40, "the same stack is\nshipped as an app,\nan API or\ndownloadable weights", ha="center",
            va="top", color=FG2, fontsize=8.6, linespacing=1.35)
    save(fig, "llm-milestones", "llm-training-stack")


# ---------------------------------------------------------------------------
# 20 most important LLMs explained
# ---------------------------------------------------------------------------
# (name, decimal year, total parameters in billions, active parameters or None, label offset)
DENSE = [
    ("GPT-1", 2018.45, 0.117, None, (6, -4)),
    ("BERT-Large", 2018.78, 0.34, None, (6, -4)),
    ("GPT-2", 2019.12, 1.5, None, (6, -4)),
    ("T5", 2019.82, 11, None, (6, -4)),
    ("GPT-3", 2020.41, 175, None, (-10, 6)),
    ("Codex", 2021.53, 12, None, (6, -4)),
    ("Chinchilla", 2022.24, 70, None, (6, -10)),
    ("PaLM", 2022.26, 540, None, (-12, 6)),
    ("BLOOM", 2022.53, 176, None, (6, -4)),
    ("LLaMA", 2023.15, 65, None, (6, -10)),
    ("Mistral 7B", 2023.74, 7.3, None, (6, -4)),
    ("Llama 3.1", 2024.56, 405, None, (-46, -3)),
]
MOE = [
    ("Mixtral 8x7B", 2023.95, 46.7, 12.9, (6, 2)),
    ("DeepSeek-V3", 2024.98, 671, 37, (-30, 8)),
    ("Kimi K3", 2026.45, 2800, 104, (-22, 6)),
]
UNDISCLOSED = ["ChatGPT", "GPT-4", "Claude", "Gemini", "GPT-4o", "o1", "2026 frontier models"]


def parameter_counts():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.0))
    fig.subplots_adjust(left=0.1, right=0.97, top=0.95, bottom=0.17)
    style(ax)
    ax.set_yscale("log")
    ax.set_ylim(0.06, 6000)
    ax.set_xlim(2018, 2027)
    ax.set_yticks([0.1, 1, 10, 100, 1000])
    ax.set_yticklabels(["100M", "1B", "10B", "100B", "1T"])
    ax.set_ylabel("published parameters")
    for name, x, n, _, (dx, dy) in DENSE:
        ax.scatter([x], [n], s=34, color=GREEN, zorder=3)
        ax.annotate(name, (x, n), textcoords="offset points", xytext=(dx, dy), color=FG, fontsize=8)
    for name, x, n, active, (dx, dy) in MOE:
        ax.plot([x, x], [active, n], color=AMBER, lw=1.2, zorder=2)
        ax.scatter([x], [n], s=34, color=AMBER, zorder=3)
        ax.scatter([x], [active], s=34, facecolor=BG, edgecolor=AMBER, linewidth=1.4, zorder=3)
        ax.annotate(name, (x, n), textcoords="offset points", xytext=(dx, dy), color=FG, fontsize=8)
    ax.scatter([], [], s=34, color=GREEN, label="dense model")
    ax.scatter([], [], s=34, color=AMBER, label="MoE: total")
    ax.scatter([], [], s=34, facecolor=BG, edgecolor=AMBER, linewidth=1.4, label="MoE: active per token")
    ax.legend(loc="upper left", frameon=True)
    ax.set_xticks(range(2018, 2027))
    names = ", ".join(UNDISCLOSED)
    fig.text(0.1, 0.045, f"Size not disclosed (not plotted): {names}.", color=FG2, fontsize=8.4)
    save(fig, "important-llms-explained", "parameter-counts")


# ---------------------------------------------------------------------------
# 30 key breakthroughs
# ---------------------------------------------------------------------------
def transformer_block():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.6))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)

    def layer(y, h, text, tag, edge=GRID, face=BG2):
        ax.add_patch(plt.Rectangle((4, y), 54, h, facecolor=face, edgecolor=edge, linewidth=1.2))
        ax.text(6, y + h / 2, text, va="center", color=FG, fontsize=9.2)
        ax.text(56, y + h / 2, tag, va="center", ha="right", color=GREEN, fontsize=8.8, fontweight="bold")

    layer(4, 7, "text → subword tokens", "6")
    layer(14, 7, "token embeddings", "3, 4")
    ax.add_patch(plt.Rectangle((2, 24), 58, 58, facecolor=BG, edgecolor=GREEN, linewidth=1.4,
                               linestyle=(0, (4, 3))))
    ax.text(31, 80, "Transformer block, repeated N times", ha="center", va="top", color=GREEN, fontsize=9)
    layer(27, 7, "normalization + residual connection", "10")
    layer(36, 9, "feed-forward layer or mixture of experts", "12", face=GREEN_MUTED)
    layer(47, 7, "normalization + residual connection", "10")
    layer(56, 16, "masked self-attention, RoPE,\ngrouped-query attention,\nKV cache, FlashAttention",
          "9, 11, 13, 25", face=GREEN_MUTED)
    layer(85, 7, "next-token probabilities, cross-entropy loss", "2")
    for y0, y1 in [(11, 14), (21, 27), (34, 36), (45, 47), (54, 56), (82, 85)]:
        connect(ax, (31, y0), (31, y1), color=FG2, lw=1.1)
    ax.text(31, 96, "a decoder-only LLM, bottom to top", ha="center", color=FG2, fontsize=9)

    stages = [
        ("Pretraining at scale", "14, 16, 17, 18, 19"),
        ("Instruction tuning", "22"),
        ("Preference tuning: RLHF / DPO", "23, 24"),
        ("RL with verifiable rewards", "30"),
    ]
    ax.text(82, 96, "training stages", ha="center", color=FG2, fontsize=9)
    for i, (title, tag) in enumerate(stages):
        y = 72 - i * 19
        box(ax, 66, y, 32, 14, title, tag, edge=AMBER if i == 3 else GRID, face=BG2,
            title_color=AMBER if i == 3 else FG, size=9)
        if i:
            connect(ax, (82, y + 19), (82, y + 14.6), color=FG2, lw=1.1)
    save(fig, "llm-breakthroughs", "transformer-block")


# ---------------------------------------------------------------------------
# 10 open-source LLMs
# ---------------------------------------------------------------------------
def openness_spectrum():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    cols = [
        ("API only", "weights not\ndownloadable", "GPT-6\nClaude\nGemini", GRID, FG),
        ("Open weights,\ncustom license", "attribution or\nrevenue terms", "Muse Spark Open\nKimi K3\nGLM-5.3\n"
         "Qwen3.8 flagship\nMistral Medium 3.5\nNemotron (OpenMDW)", GRID, FG),
        ("Open weights,\nApache 2.0 or MIT", "standard\npermissive license", "Qwen3.8-27B, Qwen3.6\nGemma 4\ngpt-oss\n"
         "Mistral Small 4\nDeepSeek-V4\nGLM-5.3-Flash\nMuse Glimmer", GREEN, GREEN),
        ("Fully open", "weights, data,\ncode, checkpoints", "OLMo", AMBER, AMBER),
    ]
    w, gap = 22.5, 2
    for i, (title, sub, models, edge, tcol) in enumerate(cols):
        x = 2 + i * (w + gap)
        ax.add_patch(plt.Rectangle((x, 8), w, 74, facecolor=BG2, edgecolor=edge, linewidth=1.3))
        ax.text(x + w / 2, 79, title, ha="center", va="top", color=tcol, fontsize=9.6, fontweight="bold",
                linespacing=1.2)
        ax.text(x + w / 2, 63, sub, ha="center", va="top", color=FG2, fontsize=8.4, linespacing=1.25)
        ax.text(x + w / 2, 49, models, ha="center", va="top", color=FG, fontsize=8.4, linespacing=1.4)
    connect(ax, (6, 92), (94, 92), color=FG2, lw=1.2)
    ax.text(6, 86, "less open", color=FG2, fontsize=8.6)
    ax.text(94, 86, "more open", color=FG2, fontsize=8.6, ha="right")
    save(fig, "open-source-llms", "openness-spectrum")


def main():
    only = os.environ.get("LLM_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [language_model_eras, llm_training_stack, parameter_counts, transformer_block, openness_spectrum]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
