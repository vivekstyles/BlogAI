"""
scripts/diagrams/make_python_diagrams.py - Diagrams for the Python programming articles

Renders the SVG figures used by five Python articles (beginner projects, automation
scripts, data science and machine learning libraries, interview questions and web
scraping) into public/images/articles/<article-slug>/. Most figures are diagrams of
the structure each article describes. The one chart, list_vs_set_lookup, is measured
with timeit on the machine that runs this script, so its numbers change from machine
to machine; the script prints them so they can be checked against the alt text:

    python scripts/diagrams/make_python_diagrams.py

Styling, colors and helpers come from make_ml_diagrams.py: dark neutral background,
green accent, amber as the only second accent, solid fills only, and no blue.
"""

import os
import sys
import timeit
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
    WIDTH_IN,
    blank,
    box,
    connect,
    save,
    style,
)


# ---------------------------------------------------------------------------
# 25 Python projects for beginners
# ---------------------------------------------------------------------------
def beginner_roadmap():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.8))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    levels = [
        (2, "Level 1: first programs", "projects 1–8",
         "input and output\nif, while, for\nfunctions\nrandom, secrets"),
        (35, "Level 2: data and files", "projects 9–17",
         "lists, dicts, sets\nclasses\nJSON, CSV, SQLite\ndates and text"),
        (68, "Level 3: libraries and apps", "projects 18–25",
         "web APIs\nscraping, pandas\nGUI and games\nweb app, packaging"),
    ]
    for x, title, projects, body in levels:
        box(ax, x, 30, 30, 60, title, f"{projects}\n\n{body}", edge=GREEN, face=BG, title_color=GREEN, size=9.8)
    connect(ax, (32.6, 60), (34.4, 60), color=GREEN, lw=1.6)
    connect(ax, (65.6, 60), (67.4, 60), color=GREEN, lw=1.6)
    ax.text(50, 14, "each level reuses the skills of the one before; finish and extend a project before moving on",
            ha="center", color=FG2, fontsize=9.2)
    save(fig, "python-projects-for-beginners", "project-roadmap")


# ---------------------------------------------------------------------------
# 15 Python automation scripts
# ---------------------------------------------------------------------------
def automation_loop():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    box(ax, 1, 30, 20, 46, "Trigger", "run by hand\nschedule\n(Task Scheduler,\ncron)\nnew file arrives",
        edge=GRID, size=9.4)
    box(ax, 27, 30, 20, 46, "Dry run", "print what\nwould change;\ntouch nothing", edge=AMBER,
        title_color=AMBER, size=9.4)
    box(ax, 53, 30, 20, 46, "Apply and log", "make the change;\nwrite a log;\nnever overwrite\nor delete silently",
        edge=GREEN, title_color=GREEN, size=9.4)
    box(ax, 79, 30, 20, 46, "Report", "exit code,\nsummary file\nor email", edge=GRID, size=9.4)
    for x in (21.6, 47.6, 73.6):
        connect(ax, (x, 53), (x + 4.8, 53), color=FG2, lw=1.4)
    connect(ax, (89, 28), (11, 28), color=FG2, lw=1.2, rad=-0.2)
    ax.text(50, 6, "check the log after the first scheduled runs, then let it repeat", ha="center",
            color=FG2, fontsize=9.2)
    save(fig, "python-automation-scripts", "safe-automation-loop")


# ---------------------------------------------------------------------------
# 20 Python libraries for data science and machine learning
# ---------------------------------------------------------------------------
def library_workflow():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    stages = [
        (1, "Load and shape", "1 NumPy\n2 pandas\n3 Polars\n4 DuckDB"),
        (21, "Explore", "5 SciPy\n6 Matplotlib\n7 seaborn\n8 Plotly\n9 statsmodels"),
        (41, "Classical ML", "10 scikit-learn\n11 XGBoost\n12 LightGBM\n13 Optuna\n14 SHAP"),
        (61, "Deep learning", "15 PyTorch\n16 Keras\n17 JAX\n18 Transformers"),
        (81, "Track and share", "19 MLflow\n20 JupyterLab"),
    ]
    for x, title, body in stages:
        box(ax, x, 36, 18, 58, title, body, edge=GREEN, face=BG, title_color=GREEN, size=9.6)
    for x in (19.6, 39.6, 59.6, 79.6):
        connect(ax, (x, 65), (x + 1.8, 65), color=GREEN, lw=1.4)
    ax.text(50, 16, "most projects use the first three columns; add deep learning for text, images and audio",
            ha="center", color=FG2, fontsize=9.2)
    save(fig, "python-libraries-for-machine-learning", "library-workflow")


# ---------------------------------------------------------------------------
# 30 Python interview questions
# ---------------------------------------------------------------------------
def concurrency_chooser():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    box(ax, 34, 80, 32, 13, "What is the program waiting on?", edge=GRID, size=9.8)
    box(ax, 3, 30, 42, 38, "I/O: network, disk, database",
        "many connections: asyncio\nblocking libraries: threads\n(ThreadPoolExecutor)\nthe GIL is released while waiting",
        edge=GREEN, title_color=GREEN, size=9.4)
    box(ax, 55, 30, 42, 38, "CPU: pure-Python computation",
        "processes (ProcessPoolExecutor)\nor NumPy and other C code\nfree-threaded build (3.14+):\nthreads run in parallel",
        edge=AMBER, title_color=AMBER, size=9.4)
    connect(ax, (42, 79), (26, 69), color=GREEN, lw=1.4)
    connect(ax, (58, 79), (74, 69), color=AMBER, lw=1.4)
    ax.text(50, 14, "measure first: if the program is neither, concurrency will not make it faster",
            ha="center", color=FG2, fontsize=9.2)
    save(fig, "python-interview-questions", "concurrency-chooser")


def list_vs_set_lookup():
    sizes = [10, 100, 1_000, 10_000, 100_000]
    list_us, set_us = [], []
    for n in sizes:
        setup = f"data = list(range({n})); s = set(data); target = {n - 1}"
        reps = 2_000 if n <= 10_000 else 200
        list_us.append(min(timeit.repeat("target in data", setup=setup, number=reps, repeat=5)) / reps * 1e6)
        set_us.append(min(timeit.repeat("target in s", setup=setup, number=reps, repeat=5)) / reps * 1e6)
    for n, a, b in zip(sizes, list_us, set_us):
        print(f"  n={n:>7}: list {a:10.3f} us   set {b:7.3f} us")
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    ax.plot(sizes, list_us, color=AMBER, marker="o", label="x in list (checks items one by one)")
    ax.plot(sizes, set_us, color=GREEN, marker="o", label="x in set (hash lookup)")
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("number of items (last item searched)")
    ax.set_ylabel("time per lookup (µs)")
    ax.legend(loc="upper left")
    fig.subplots_adjust(left=0.12, right=0.97, bottom=0.17, top=0.95)
    save(fig, "python-interview-questions", "list-vs-set-lookup")


# ---------------------------------------------------------------------------
# 10 Python web scraping techniques
# ---------------------------------------------------------------------------
def scraping_decision():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    steps = [
        (84, "Official API, feed, sitemap or download?", "use it (technique 1)"),
        (64, "JSON request in the Network tab?", "call the JSON endpoint (6)"),
        (44, "Data in the page source (JSON-LD, script)?", "parse the embedded JSON (7)"),
        (24, "Data in the HTML from the server?", "Requests + parser (2–5, 8, 9)"),
    ]
    for y, question, answer in steps:
        box(ax, 3, y, 52, 11, question, edge=GRID, size=9.2)
        box(ax, 66, y, 31, 11, answer, edge=GREEN, title_color=GREEN, size=9.0)
        connect(ax, (55.6, y + 5.5), (65.4, y + 5.5), color=GREEN, lw=1.3)
        ax.text(60.5, y + 7.2, "yes", ha="center", color=GREEN, fontsize=8.5)
        if y > 24:
            connect(ax, (29, y - 0.6), (29, y - 8.4), color=FG2, lw=1.2)
            ax.text(31, y - 5, "no", color=FG2, fontsize=8.5)
    box(ax, 3, 4, 52, 11, "Only rendered by JavaScript in a browser", edge=GRID, size=9.2)
    box(ax, 66, 4, 31, 11, "headless browser (10)", edge=AMBER, title_color=AMBER, size=9.0)
    connect(ax, (29, 23.4), (29, 15.6), color=FG2, lw=1.2)
    ax.text(31, 19, "no", color=FG2, fontsize=8.5)
    connect(ax, (55.6, 9.5), (65.4, 9.5), color=AMBER, lw=1.3)
    save(fig, "python-web-scraping-techniques", "technique-decision")


def main():
    only = os.environ.get("PY_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [beginner_roadmap, automation_loop, library_workflow, concurrency_chooser, list_vs_set_lookup,
               scraping_decision]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
