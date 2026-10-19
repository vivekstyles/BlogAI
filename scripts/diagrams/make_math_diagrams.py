"""
scripts/diagrams/make_math_diagrams.py - Diagrams for the mathematics articles

Renders the SVG figures used by five math articles into
public/images/articles/<article-slug>/. Every figure is computed from the same
numbers the article text uses, so if you change an example in an article,
change it here too and re-run:

    python scripts/diagrams/make_math_diagrams.py

Figures follow the site theme: dark neutral background, green accent, amber as
the only second accent, solid fills only (no gradients or colormaps), and no blue.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from matplotlib.patches import FancyArrowPatch, Polygon, Rectangle  # noqa: E402
from scipy.integrate import solve_ivp  # noqa: E402
from scipy.stats import norm  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "images" / "articles"

BG = "#202020"
FG = "#e5e5e5"
FG2 = "#b3b3b3"
GRID = "#383838"
GREEN = "#6ab668"
GREEN_MUTED = "#294329"
AMBER = "#fbbf24"
NEUTRAL = "#949494"

plt.rcParams.update(
    {
        "figure.facecolor": BG,
        "axes.facecolor": BG,
        "savefig.facecolor": BG,
        "axes.edgecolor": GRID,
        "axes.labelcolor": FG,
        "axes.titlecolor": FG,
        "axes.titlesize": 12,
        "axes.labelsize": 11,
        "xtick.color": FG2,
        "ytick.color": FG2,
        "text.color": FG,
        "grid.color": GRID,
        "grid.linewidth": 0.6,
        "legend.facecolor": BG,
        "legend.edgecolor": GRID,
        "legend.labelcolor": FG,
        "legend.fontsize": 9.5,
        "font.family": "DejaVu Sans",
        "font.size": 10.5,
        "mathtext.fontset": "dejavusans",
        "svg.fonttype": "path",
        "svg.hashsalt": "blogai",
        "lines.linewidth": 2,
    }
)

WIDTH_IN = 7.2  # 720 px at 100 dpi


def save(fig, slug, name):
    folder = OUT / slug
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{name}.svg"
    fig.savefig(path, format="svg", dpi=100, bbox_inches=None, metadata={"Date": None})
    plt.close(fig)
    print(f"wrote {path.relative_to(ROOT)}")


def style(ax, grid=True):
    for spine in ax.spines.values():
        spine.set_color(GRID)
    if grid:
        ax.grid(True)
        ax.set_axisbelow(True)


def arrow(ax, start, end, color, lw=2.2, label=None):
    ax.add_patch(
        FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=14, color=color, linewidth=lw, label=label)
    )


# ---------------------------------------------------------------------------
# Linear algebra problems
# ---------------------------------------------------------------------------
LA = "linear-algebra-problems-with-solutions"


def la_systems():
    fig, axes = plt.subplots(1, 3, figsize=(WIDTH_IN, 2.9))
    x = np.linspace(-1, 5, 2)
    cases = [
        ("One solution", [(1, 1, 4), (1, -1, 2)], "x + y = 4\nx − y = 2"),
        ("No solution", [(1, 1, 4), (1, 1, 1)], "x + y = 4\nx + y = 1"),
        ("Infinitely many", [(1, 1, 4), (2, 2, 8)], "x + y = 4\n2x + 2y = 8"),
    ]
    for ax, (title, eqs, text) in zip(axes, cases):
        style(ax)
        for i, (a, b, c) in enumerate(eqs):
            y = (c - a * x) / b
            ax.plot(x, y, color=GREEN if i == 0 else AMBER, linestyle="-" if i == 0 else "--", lw=2.4 - i * 0.6)
        if title == "One solution":
            ax.plot(3, 1, "o", color=FG, ms=7, zorder=5)
            ax.annotate("(3, 1)", (3, 1), (3.3, 0.2), color=FG)
        ax.set_xlim(-1, 5)
        ax.set_ylim(-2, 5)
        ax.set_title(title)
        ax.text(0.96, 0.95, text, transform=ax.transAxes, color=FG2, fontsize=9.5, ha="right", va="top",
                bbox={"boxstyle": "round,pad=0.3", "facecolor": BG, "edgecolor": GRID})
        ax.set_aspect("equal")
    fig.subplots_adjust(left=0.05, right=0.99, bottom=0.1, top=0.88, wspace=0.25)
    save(fig, LA, "two-equation-systems")


def la_determinant():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax)
    u, v = np.array([3, 0]), np.array([1, 2])
    ax.add_patch(Polygon([[0, 0], [1, 0], [1, 1], [0, 1]], closed=True, facecolor=GRID, edgecolor=FG2, lw=1))
    ax.add_patch(Polygon([[0, 0], u, u + v, v], closed=True, facecolor=GREEN_MUTED, edgecolor=GREEN, lw=1.5))
    arrow(ax, (0, 0), tuple(u), GREEN)
    arrow(ax, (0, 0), tuple(v), AMBER)
    ax.text(1.6, -0.35, "first column (3, 0)", color=GREEN, ha="center")
    ax.text(-0.1, 2.15, "second column (1, 2)", color=AMBER)
    ax.text(0.5, 0.5, "1", color=FG, ha="center", va="center")
    ax.text(2.5, 1.0, "area = |det A| = 6", color=FG, ha="center", fontsize=11)
    ax.set_xlim(-0.8, 5.2)
    ax.set_ylim(-0.8, 2.8)
    ax.set_aspect("equal")
    ax.set_title("A = [[3, 1], [0, 2]] maps the unit square to a parallelogram of area 6")
    fig.subplots_adjust(left=0.06, right=0.98, bottom=0.08, top=0.88)
    save(fig, LA, "determinant-as-area")


def la_eigen():
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.6))
    A = np.array([[2, 1], [1, 2]])
    theta = np.linspace(0, 2 * np.pi, 200)
    circle = np.vstack([np.cos(theta), np.sin(theta)])
    ellipse = A @ circle
    v1 = np.array([1, 1]) / np.sqrt(2)
    v2 = np.array([1, -1]) / np.sqrt(2)
    for ax, title in zip(axes, ["Before: unit circle", "After: multiply by A"]):
        style(ax)
        ax.set_xlim(-3.4, 3.4)
        ax.set_ylim(-3.4, 3.4)
        ax.set_aspect("equal")
        ax.set_title(title)
    axes[0].plot(*circle, color=FG2, lw=1.5)
    arrow(axes[0], (0, 0), tuple(v1), GREEN)
    arrow(axes[0], (0, 0), tuple(v2), AMBER)
    w = np.array([1, 0])
    arrow(axes[0], (0, 0), tuple(w), NEUTRAL, lw=1.6)
    axes[0].text(1.05, -0.35, "(1, 0)", color=NEUTRAL)
    axes[1].plot(*ellipse, color=FG2, lw=1.5)
    arrow(axes[1], (0, 0), tuple(3 * v1), GREEN)
    arrow(axes[1], (0, 0), tuple(1 * v2), AMBER)
    arrow(axes[1], (0, 0), tuple(A @ w), NEUTRAL, lw=1.6)
    axes[1].text(0.6, -1.7, "A(1, 0) = (2, 1):\nnot an eigenvector,\ndirection changes", color=NEUTRAL, fontsize=8.5)
    axes[1].text(-3.2, 2.7, "eigenvector (1, 1): stretched ×3", color=GREEN, fontsize=9)
    axes[1].text(-3.2, -3.1, "eigenvector (1, −1): ×1", color=AMBER, fontsize=9)
    fig.suptitle("A = [[2, 1], [1, 2]]: eigenvectors keep their direction", color=FG)
    fig.subplots_adjust(left=0.05, right=0.98, bottom=0.07, top=0.84, wspace=0.18)
    save(fig, LA, "eigenvectors-of-a-symmetric-matrix")


def la_projection():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax)
    a, b = np.array([3, 1]), np.array([1, 3])
    p = (a @ b) / (a @ a) * a
    t = np.linspace(-0.2, 1.35, 2)
    ax.plot(t * a[0], t * a[1], color=GRID, lw=1.2, linestyle="--")
    arrow(ax, (0, 0), tuple(a), FG2)
    arrow(ax, (0, 0), tuple(b), AMBER)
    arrow(ax, (0, 0), tuple(p), GREEN, lw=3)
    ax.plot([b[0], p[0]], [b[1], p[1]], color=FG, lw=1.5, linestyle=":")
    # right-angle marker
    d = (b - p) / np.linalg.norm(b - p) * 0.18
    e = a / np.linalg.norm(a) * 0.18
    ax.plot([p[0] + d[0], p[0] + d[0] - e[0], p[0] - e[0]], [p[1] + d[1], p[1] + d[1] - e[1], p[1] - e[1]], color=FG, lw=1)
    ax.text(3.05, 0.85, "a = (3, 1)", color=FG2)
    ax.text(0.5, 3.0, "b = (1, 3)", color=AMBER)
    ax.text(1.0, 0.05, "p = (1.8, 0.6)", color=GREEN, fontsize=9.5)
    ax.text(1.55, 2.05, "e = b − p = (−0.8, 2.4)\nperpendicular to a", color=FG, fontsize=9.5)
    ax.set_xlim(-0.6, 4.2)
    ax.set_ylim(-0.4, 3.4)
    ax.set_aspect("equal")
    ax.set_title("Projecting b onto the line through a")
    fig.subplots_adjust(left=0.05, right=0.98, bottom=0.08, top=0.9)
    save(fig, LA, "projection-onto-a-line")


def la_least_squares():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax)
    xs, ys = np.array([0, 1, 2, 3]), np.array([1, 3, 4, 4])
    c, m = 1.5, 1.0
    xx = np.linspace(-0.3, 3.3, 2)
    ax.plot(xx, c + m * xx, color=GREEN, label="best fit  y = 1.5 + x")
    for x, y in zip(xs, ys):
        ax.plot([x, x], [y, c + m * x], color=AMBER, lw=1.5, linestyle="--")
    ax.plot(xs, ys, "o", color=FG, ms=7, zorder=5, label="data points")
    ax.plot([], [], color=AMBER, linestyle="--", label="residuals (sum of squares = 1)")
    ax.set_xlim(-0.4, 3.4)
    ax.set_ylim(0, 5.2)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.legend(loc="lower right")
    ax.set_title("Least squares minimizes the sum of squared vertical residuals")
    fig.subplots_adjust(left=0.08, right=0.98, bottom=0.14, top=0.9)
    save(fig, LA, "least-squares-line")


# ---------------------------------------------------------------------------
# Calculus
# ---------------------------------------------------------------------------
CALC = "calculus-formulas-theorems-and-examples"


def calc_secants():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax)
    x = np.linspace(-0.2, 2.4, 300)
    ax.plot(x, x**2, color=FG, label=r"$f(x) = x^2$")
    xl = np.linspace(-0.2, 2.4, 2)
    for h, color, ls in [(1, NEUTRAL, ":"), (0.5, AMBER, "--")]:
        slope = ((1 + h) ** 2 - 1) / h
        ax.plot(xl, 1 + slope * (xl - 1), color=color, linestyle=ls, lw=1.6, label=f"secant, h = {h}: slope {slope:g}")
        ax.plot(1 + h, (1 + h) ** 2, "o", color=color, ms=5)
    ax.plot(xl, 1 + 2 * (xl - 1), color=GREEN, lw=2.4, label="tangent: slope f′(1) = 2")
    ax.plot(1, 1, "o", color=GREEN, ms=7, zorder=5)
    ax.set_xlim(-0.2, 2.4)
    ax.set_ylim(-0.5, 5)
    ax.legend(loc="upper left")
    ax.set_title("Secant slopes (2 + h) approach the derivative as h → 0")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.08, top=0.9)
    save(fig, CALC, "secants-approach-the-tangent")


def calc_riemann():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.5))
    style(ax)
    x = np.linspace(0, 2, 300)
    n, dx = 4, 0.5
    for i in range(n):
        mid = i * dx + dx / 2
        ax.add_patch(Rectangle((i * dx, 0), dx, mid**2, facecolor=GREEN_MUTED, edgecolor=GREEN, lw=1.2))
        ax.plot(mid, mid**2, "o", color=AMBER, ms=4)
    ax.plot(x, x**2, color=FG)
    ax.text(0.15, 3.3, "Midpoint sum, n = 4:  2.625\nExact area  ∫₀² x² dx = 8/3 ≈ 2.667", color=FG, fontsize=10)
    ax.set_xlim(-0.05, 2.1)
    ax.set_ylim(0, 4.2)
    ax.set_xlabel("x")
    ax.set_title(r"A Riemann sum approximates the area under $y = x^2$")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.14, top=0.9)
    save(fig, CALC, "midpoint-riemann-sum")


def calc_taylor():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax)
    x = np.linspace(-2 * np.pi, 2 * np.pi, 400)
    ax.plot(x, np.sin(x), color=FG, lw=2.6, label=r"$\sin x$")
    ax.plot(x, x, color=NEUTRAL, linestyle=":", label=r"$P_1 = x$")
    ax.plot(x, x - x**3 / 6, color=AMBER, linestyle="--", label=r"$P_3 = x - x^3/3!$")
    ax.plot(x, x - x**3 / 6 + x**5 / 120, color=GREEN, label=r"$P_5 = P_3 + x^5/5!$")
    ax.set_ylim(-2.2, 2.2)
    ax.set_xlim(-2 * np.pi, 2 * np.pi)
    ax.set_xticks([-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi], ["−2π", "−π", "0", "π", "2π"])
    ax.legend(loc="lower right", ncol=2)
    ax.set_title("Taylor polynomials of sin x around 0: more terms, wider accuracy")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.08, top=0.9)
    save(fig, CALC, "taylor-polynomials-of-sine")


def calc_mvt():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.5))
    style(ax)
    f = lambda t: t**3 - 3 * t  # noqa: E731
    x = np.linspace(-0.3, 2.3, 300)
    ax.plot(x, f(x), color=FG, label=r"$f(x) = x^3 - 3x$")
    ax.plot([0, 2], [f(0), f(2)], color=AMBER, linestyle="--", label="secant from (0, 0) to (2, 2): slope 1")
    c = 2 / np.sqrt(3)
    xl = np.linspace(c - 1, c + 1, 2)
    ax.plot(xl, f(c) + 1 * (xl - c), color=GREEN, label="tangent at c = 2/√3 ≈ 1.155: slope 1")
    ax.plot([0, 2, c], [f(0), f(2), f(c)], "o", color=FG, ms=6, zorder=5)
    ax.set_xlim(-0.3, 2.3)
    ax.set_ylim(-2.8, 3)
    ax.legend(loc="upper left")
    ax.set_title("Mean value theorem: some tangent is parallel to the secant")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.08, top=0.9)
    save(fig, CALC, "mean-value-theorem")


# ---------------------------------------------------------------------------
# Probability and statistics
# ---------------------------------------------------------------------------
PS = "probability-and-statistics-concepts-for-data-science"


def ps_normal():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax, grid=False)
    x = np.linspace(-4, 4, 400)
    for k, color in [(3, GRID), (2, "#3a5c39"), (1, GREEN_MUTED)]:
        xs = np.linspace(-k, k, 200)
        ax.fill_between(xs, norm.pdf(xs), color=color, lw=0)
    ax.plot(x, norm.pdf(x), color=GREEN)
    for k, pct, y in [(1, "68.3%", 0.2), (2, "95.4%", 0.09), (3, "99.7%", 0.025)]:
        ax.annotate("", (-k, y), (k, y), arrowprops={"arrowstyle": "<->", "color": FG2, "lw": 1})
        ax.text(0, y + 0.008, pct, ha="center", color=FG, fontsize=9.5)
    ax.set_xticks(range(-3, 4), ["μ−3σ", "μ−2σ", "μ−σ", "μ", "μ+σ", "μ+2σ", "μ+3σ"])
    ax.set_yticks([])
    ax.set_xlim(-4, 4)
    ax.set_ylim(0, 0.43)
    ax.set_title("Share of a normal distribution within 1, 2 and 3 standard deviations")
    fig.subplots_adjust(left=0.03, right=0.97, bottom=0.12, top=0.9)
    save(fig, PS, "normal-distribution-68-95-99-7")


def ps_clt():
    rng = np.random.default_rng(7)
    fig, axes = plt.subplots(1, 3, figsize=(WIDTH_IN, 2.9), sharey=False)
    for ax, n in zip(axes, [1, 5, 30]):
        style(ax, grid=False)
        means = rng.exponential(1.0, size=(20000, n)).mean(axis=1)
        ax.hist(means, bins=40, range=(0, 4) if n == 1 else (0, 2.6), density=True, color=GREEN_MUTED, edgecolor=GREEN, lw=0.6)
        xs = np.linspace(0.01, 4 if n == 1 else 2.6, 200)
        ax.plot(xs, norm.pdf(xs, 1, 1 / np.sqrt(n)), color=AMBER, lw=1.6, linestyle="--")
        ax.set_title(f"mean of n = {n}")
        ax.set_yticks([])
    axes[0].text(1.7, 0.75, "dashed: normal curve\nwith mean 1, sd 1/√n", color=AMBER, fontsize=8.5)
    fig.suptitle("Central limit theorem: means of skewed exponential samples become normal", color=FG, fontsize=11)
    fig.subplots_adjust(left=0.03, right=0.98, bottom=0.1, top=0.8, wspace=0.12)
    save(fig, PS, "central-limit-theorem")


def ps_roc():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.8))
    style(ax)
    t = np.linspace(-5, 7, 400)
    fpr = 1 - norm.cdf(t, 0, 1)
    tpr = 1 - norm.cdf(t, 1.5, 1)
    ax.fill_between(fpr, tpr, color=GREEN_MUTED, lw=0)
    ax.plot(fpr, tpr, color=GREEN, label="ROC curve (AUC ≈ 0.856)")
    ax.plot([0, 1], [0, 1], color=NEUTRAL, linestyle="--", lw=1.4, label="random guessing (AUC = 0.5)")
    th = 1.0
    ax.plot(1 - norm.cdf(th), 1 - norm.cdf(th, 1.5), "o", color=AMBER, ms=7, zorder=5)
    ax.annotate(
        "threshold 1.0:\nFPR 0.159, TPR 0.691",
        (1 - norm.cdf(th), 1 - norm.cdf(th, 1.5)),
        (0.3, 0.4),
        color=AMBER,
        arrowprops={"arrowstyle": "-", "color": AMBER, "lw": 1},
    )
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.01)
    ax.set_aspect("equal")
    ax.set_xlabel("false positive rate")
    ax.set_ylabel("true positive rate")
    ax.legend(loc="lower right")
    ax.set_title("Scores: negatives ~ N(0, 1), positives ~ N(1.5, 1)")
    fig.subplots_adjust(left=0.05, right=0.97, bottom=0.13, top=0.92)
    save(fig, PS, "roc-curve")


def ps_bayes_tree():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    ax.axis("off")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)

    def node(x, y, text, color=FG, box=GRID):
        ax.text(x, y, text, ha="center", va="center", color=color, fontsize=10,
                bbox={"boxstyle": "round,pad=0.35", "facecolor": BG, "edgecolor": box})

    def edge(x1, y1, x2, y2, label):
        ax.plot([x1, x2], [y1, y2], color=FG2, lw=1.2)
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.22, label, ha="center", color=FG2, fontsize=9)

    node(0.8, 3, "1,000\nemails")
    edge(1.5, 3, 3.5, 4.6, "spam 20%")
    edge(1.5, 3, 3.5, 1.4, "not spam 80%")
    node(4.2, 4.6, "200 spam")
    node(4.2, 1.4, "800 not spam")
    edge(5.0, 4.6, 7.0, 5.4, "has \"free\" 50%")
    edge(5.0, 4.6, 7.0, 3.8, "no 50%")
    edge(5.2, 1.4, 7.0, 2.2, "has \"free\" 5%")
    edge(5.2, 1.4, 7.0, 0.6, "no 95%")
    node(8.4, 5.4, "100 spam with \"free\"", GREEN, GREEN)
    node(8.4, 3.8, "100 spam without", FG2)
    node(8.4, 2.2, "40 not spam with \"free\"", AMBER, AMBER)
    node(8.4, 0.6, "760 not spam without", FG2)
    ax.text(5, -0.15, "P(spam | \"free\") = 100 / (100 + 40) ≈ 0.714", ha="center", color=FG, fontsize=11)
    fig.subplots_adjust(left=0.01, right=0.99, bottom=0.08, top=0.98)
    save(fig, PS, "bayes-theorem-spam-filter")


def ps_overfitting():
    rng = np.random.default_rng(3)
    x = np.sort(rng.uniform(0, 1, 15))
    y = np.sin(2 * np.pi * x) + rng.normal(0, 0.25, x.size)
    xs = np.linspace(0, 1, 300)
    fig, axes = plt.subplots(1, 3, figsize=(WIDTH_IN, 2.9))
    for ax, deg, title in zip(axes, [1, 3, 12], ["degree 1: underfits", "degree 3: about right", "degree 12: overfits"]):
        style(ax)
        coef = np.polyfit(x, y, deg)
        ax.plot(xs, np.sin(2 * np.pi * xs), color=NEUTRAL, linestyle=":", lw=1.4)
        ax.plot(xs, np.polyval(coef, xs), color=GREEN if deg == 3 else AMBER)
        ax.plot(x, y, "o", color=FG, ms=4)
        ax.set_ylim(-2, 2)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_title(title)
    axes[0].text(0.03, -1.85, "dotted: true curve", color=NEUTRAL, fontsize=8.5)
    fig.subplots_adjust(left=0.02, right=0.98, bottom=0.04, top=0.88, wspace=0.08)
    save(fig, PS, "underfitting-and-overfitting")


# ---------------------------------------------------------------------------
# Optimization
# ---------------------------------------------------------------------------
OPT = "mathematical-optimization-techniques"


def opt_gd_paths():
    f = lambda x, y: x**2 + 10 * y**2  # noqa: E731
    grad = lambda p: np.array([2 * p[0], 20 * p[1]])  # noqa: E731

    def run(lr, beta, steps):
        p, v, path = np.array([-4.0, 1.5]), np.zeros(2), []
        for _ in range(steps):
            path.append(p.copy())
            v = beta * v + grad(p)
            p = p - lr * v
        path.append(p.copy())
        return np.array(path)

    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax, grid=False)
    X, Y = np.meshgrid(np.linspace(-4.6, 4.6, 300), np.linspace(-2, 2, 200))
    ax.contour(X, Y, f(X, Y), levels=[0.5, 2, 5, 10, 18, 28, 40], colors=GRID, linewidths=1)
    gd = run(0.05, 0.0, 20)
    mom = run(0.05, 0.5, 20)
    ax.plot(gd[:, 0], gd[:, 1], "-o", color=AMBER, ms=3.5, lw=1.4, label="gradient descent, step 0.05: f = 0.24 after 20 steps")
    ax.plot(mom[:, 0], mom[:, 1], "-o", color=GREEN, ms=3.5, lw=1.4, label="momentum, step 0.05, β = 0.5: f ≈ 0.00002")
    ax.plot(0, 0, "*", color=FG, ms=11, zorder=5)
    ax.set_xlim(-4.6, 4.6)
    ax.set_ylim(-2, 2)
    ax.set_aspect("equal")
    ax.legend(loc="lower right")
    ax.set_title(r"20 steps on $f(x, y) = x^2 + 10y^2$, starting at (−4, 1.5)")
    fig.subplots_adjust(left=0.05, right=0.98, bottom=0.08, top=0.9)
    save(fig, OPT, "gradient-descent-vs-momentum")


def opt_convexity():
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.0))
    x = np.linspace(-2.2, 2.2, 300)
    style(axes[0])
    axes[0].plot(x, x**2 + 0.3, color=GREEN)
    axes[0].plot([-1.6, 1.2], [1.6**2 + 0.3, 1.2**2 + 0.3], color=AMBER, linestyle="--", lw=1.5)
    axes[0].plot(0, 0.3, "o", color=FG, ms=6)
    axes[0].set_title("Convex: every local minimum is global", fontsize=10.5)
    axes[0].text(-1.9, 4.3, "chord stays above the curve", color=AMBER, fontsize=9)
    style(axes[1])
    g = x**4 - 3 * x**2 + x + 3
    axes[1].plot(x, g, color=GREEN)
    roots = np.roots([4, 0, -6, 1])
    for r in np.sort(roots.real):
        if 4 * 3 * r**2 - 6 > 0:
            gr = r**4 - 3 * r**2 + r + 3
            is_global = r < 0
            axes[1].plot(r, gr, "o", color=FG if is_global else AMBER, ms=6)
            axes[1].text(r, gr - 0.7, "global" if is_global else "local", color=FG if is_global else AMBER, ha="center", fontsize=9)
    axes[1].set_title("Non-convex: may stop at a local minimum", fontsize=10.5)
    for ax in axes:
        ax.set_ylim(-1.6, 5)
        ax.set_xticks([])
        ax.set_yticks([])
    fig.subplots_adjust(left=0.02, right=0.98, bottom=0.04, top=0.9, wspace=0.14)
    save(fig, OPT, "convex-vs-non-convex")


def opt_lp():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax)
    ax.add_patch(Polygon([[0, 0], [4, 0], [3, 1], [0, 2]], closed=True, facecolor=GREEN_MUTED, edgecolor=GREEN, lw=1.5))
    x = np.linspace(-0.5, 6.5, 2)
    ax.plot(x, 4 - x, color=FG2, lw=1, linestyle="--")
    ax.plot(x, (6 - x) / 3, color=FG2, lw=1, linestyle="--")
    for z, ls in [(3, ":"), (6, ":"), (9, "-")]:
        ax.plot(x, (z - 2 * x) / 3, color=AMBER, lw=1.6 if z == 9 else 1, linestyle=ls)
    for (px, py), val in [((0, 0), 0), ((4, 0), 8), ((3, 1), 9), ((0, 2), 6)]:
        ax.plot(px, py, "o", color=FG if (px, py) != (3, 1) else AMBER, ms=6, zorder=5)
        ax.text(px + 0.08, py + 0.12, f"({px}, {py}): {val}", color=FG, fontsize=9)
    ax.text(1.55, 2.6, "x + y = 4", color=FG2, fontsize=9)
    ax.text(5.0, 0.55, "x + 3y = 6", color=FG2, fontsize=9)
    ax.text(0.15, 3.25, "objective 2x + 3y = 3, 6, 9", color=AMBER, fontsize=9)
    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(-0.5, 3.6)
    ax.set_aspect("equal")
    ax.set_title("Maximize 2x + 3y: the optimum is at a corner, (3, 1)")
    fig.subplots_adjust(left=0.05, right=0.98, bottom=0.08, top=0.9)
    save(fig, OPT, "linear-programming-feasible-region")


def opt_lagrange():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax, grid=False)
    t = np.linspace(0, 2 * np.pi, 200)
    for r in [0.5, 1.0, np.sqrt(2), 2.0, 2.5]:
        ax.plot(r * np.cos(t), r * np.sin(t), color=GREEN if np.isclose(r, np.sqrt(2)) else GRID, lw=2 if np.isclose(r, np.sqrt(2)) else 1)
    x = np.linspace(-1, 3, 2)
    ax.plot(x, 2 - x, color=AMBER, label="constraint x + y = 2")
    ax.plot(1, 1, "o", color=FG, ms=7, zorder=5)
    arrow(ax, (1, 1), (1.6, 1.6), GREEN, lw=1.6)
    arrow(ax, (1, 1), (1.35, 1.35), AMBER, lw=1.6)
    ax.text(1.9, 0.85, "(1, 1): f = 2", color=FG)
    ax.text(1.65, 1.75, "∇f = λ∇g", color=FG)
    ax.set_xlim(-2.8, 3.2)
    ax.set_ylim(-1.6, 2.8)
    ax.set_aspect("equal")
    ax.legend(loc="lower left")
    ax.set_title(r"Minimize $x^2 + y^2$ on $x + y = 2$: level curve touches the constraint")
    fig.subplots_adjust(left=0.04, right=0.98, bottom=0.07, top=0.9)
    save(fig, OPT, "lagrange-multipliers")


def opt_schedules():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.2))
    style(ax)
    steps = np.arange(0, 1001)
    peak = 1e-3
    step_decay = peak * 0.1 ** (steps // 400)
    warm = 50
    cosine = np.where(steps < warm, peak * steps / warm, peak * 0.5 * (1 + np.cos(np.pi * (steps - warm) / (1000 - warm))))
    ax.plot(steps, np.full_like(steps, peak, dtype=float), color=NEUTRAL, linestyle=":", label="constant")
    ax.plot(steps, step_decay, color=AMBER, linestyle="--", label="step decay (×0.1 every 400 steps)")
    ax.plot(steps, cosine, color=GREEN, label="linear warmup (50 steps) + cosine decay")
    ax.set_xlabel("training step")
    ax.set_ylabel("learning rate")
    ax.ticklabel_format(axis="y", style="sci", scilimits=(-3, -3))
    ax.legend(loc="center right")
    ax.set_title("Common learning-rate schedules")
    fig.subplots_adjust(left=0.09, right=0.98, bottom=0.15, top=0.9)
    save(fig, OPT, "learning-rate-schedules")


# ---------------------------------------------------------------------------
# Advanced mathematics concepts
# ---------------------------------------------------------------------------
ADV = "advanced-mathematics-concepts-with-applications"


def adv_fourier():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    x = np.linspace(-np.pi, np.pi, 1200)
    square = np.sign(np.sin(x))
    ax.plot(x, square, color=NEUTRAL, lw=1.4, linestyle=":", label="square wave")

    def partial(n_terms):
        return sum(4 / (np.pi * k) * np.sin(k * x) for k in range(1, 2 * n_terms, 2))

    ax.plot(x, partial(1), color=FG2, lw=1.2, label="1 term")
    ax.plot(x, partial(3), color=AMBER, lw=1.5, linestyle="--", label="3 terms")
    ax.plot(x, partial(15), color=GREEN, lw=1.8, label="15 terms")
    ax.set_xticks([-np.pi, 0, np.pi], ["−π", "0", "π"])
    ax.set_ylim(-1.95, 1.5)
    ax.legend(loc="lower right", ncol=4)
    ax.set_title(r"Fourier series: $\frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \cdots\right)$")
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.09, top=0.88)
    save(fig, ADV, "fourier-series-square-wave")


def adv_graph():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    ax.axis("off")
    pos = {"A": (0, 1), "B": (2, 2), "C": (2, 0), "D": (4, 2), "E": (4, 0), "F": (6, 1)}
    edges = [("A", "B", 4), ("A", "C", 2), ("B", "C", 1), ("B", "D", 5), ("C", "E", 10), ("C", "D", 8), ("D", "E", 2), ("D", "F", 6), ("E", "F", 3)]
    best = {("A", "C"), ("C", "B"), ("B", "D"), ("D", "E"), ("E", "F")}
    for u, v, w in edges:
        on_path = (u, v) in best or (v, u) in best
        (x1, y1), (x2, y2) = pos[u], pos[v]
        ax.plot([x1, x2], [y1, y2], color=GREEN if on_path else GRID, lw=3 if on_path else 1.5, zorder=1)
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.1, str(w), color=FG, ha="center", fontsize=10,
                bbox={"boxstyle": "round,pad=0.15", "facecolor": BG, "edgecolor": "none"})
    for name, (x, y) in pos.items():
        ax.plot(x, y, "o", ms=24, color=BG, markeredgecolor=GREEN if name in "ACBDEF" else FG2, markeredgewidth=1.8, zorder=2)
        ax.text(x, y, name, ha="center", va="center", color=FG, fontsize=11, zorder=3)
    ax.text(3, -0.55, "Shortest A → F: A–C–B–D–E–F, total 2 + 1 + 5 + 2 + 3 = 13", ha="center", color=FG, fontsize=10.5)
    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(-0.8, 2.4)
    fig.subplots_adjust(left=0.01, right=0.99, bottom=0.02, top=0.98)
    save(fig, ADV, "shortest-path-graph")


def adv_logistic():
    fig, axes = plt.subplots(1, 3, figsize=(WIDTH_IN, 2.8), sharey=True)
    for ax, r, title in zip(axes, [2.8, 3.2, 3.9], ["r = 2.8: settles", "r = 3.2: period 2", "r = 3.9: chaos"]):
        style(ax)
        xs = [0.2]
        for _ in range(40):
            xs.append(r * xs[-1] * (1 - xs[-1]))
        ax.plot(range(41), xs, "-o", color=GREEN if r < 3.5 else AMBER, ms=2.5, lw=1.2)
        ax.set_title(title)
        ax.set_ylim(0, 1)
        ax.set_xlabel("step n")
    axes[0].set_ylabel(r"$x_n$")
    fig.suptitle(r"Logistic map $x_{n+1} = r\,x_n(1 - x_n)$, starting at $x_0 = 0.2$", color=FG, fontsize=11)
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.17, top=0.8, wspace=0.08)
    save(fig, ADV, "logistic-map-chaos")


def adv_sir():
    beta, gamma = 0.3, 0.1

    def rhs(_, y):
        s, i, _r = y
        return [-beta * s * i, beta * s * i - gamma * i, gamma * i]

    sol = solve_ivp(rhs, (0, 160), [0.999, 0.001, 0.0], dense_output=True, rtol=1e-9, atol=1e-12)
    t = np.linspace(0, 160, 400)
    s, i, r = sol.sol(t)
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    ax.plot(t, s, color=FG2, label="susceptible S")
    ax.plot(t, i, color=AMBER, label="infected I")
    ax.plot(t, r, color=GREEN, label="recovered R")
    k = np.argmax(i)
    ax.annotate(f"peak: {i[k]:.0%} infected\nat day {t[k]:.0f}", (t[k], i[k]), (t[k] + 18, i[k] + 0.12), color=AMBER,
                arrowprops={"arrowstyle": "-", "color": AMBER, "lw": 1})
    ax.set_xlabel("days")
    ax.set_ylabel("share of population")
    ax.set_xlim(0, 160)
    ax.set_ylim(0, 1.02)
    ax.legend(loc="center right")
    ax.set_title(r"SIR model, $\beta = 0.3$, $\gamma = 0.1$ ($R_0 = 3$)")
    fig.subplots_adjust(left=0.09, right=0.98, bottom=0.14, top=0.9)
    save(fig, ADV, "sir-epidemic-model")
    return i[k], t[k], r[-1]


def adv_complex():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax)
    pts = [(2, 1, "z = 2 + i", FG), (-1, 2, "iz = −1 + 2i", GREEN), (-2, -1, "i²z = −2 − i", AMBER), (1, -2, "i³z = 1 − 2i", FG2)]
    t = np.linspace(0, 2 * np.pi, 200)
    ax.plot(np.sqrt(5) * np.cos(t), np.sqrt(5) * np.sin(t), color=GRID, lw=1, linestyle="--")
    for x, y, label, color in pts:
        arrow(ax, (0, 0), (x, y), color)
        ax.text(x + (0.12 if x > 0 else -0.12), y + (0.15 if y > 0 else -0.35), label, color=color, ha="left" if x > 0 else "right")
    ax.axhline(0, color=FG2, lw=0.8)
    ax.axvline(0, color=FG2, lw=0.8)
    ax.set_xlabel("real part")
    ax.set_ylabel("imaginary part")
    ax.set_xlim(-4.2, 4.2)
    ax.set_ylim(-2.8, 2.8)
    ax.set_aspect("equal")
    ax.set_title("Multiplying by i rotates a complex number by 90°")
    fig.subplots_adjust(left=0.06, right=0.98, bottom=0.13, top=0.9)
    save(fig, ADV, "complex-multiplication-rotation")


def main():
    la_systems()
    la_determinant()
    la_eigen()
    la_projection()
    la_least_squares()
    calc_secants()
    calc_riemann()
    calc_taylor()
    calc_mvt()
    ps_normal()
    ps_clt()
    ps_roc()
    ps_bayes_tree()
    ps_overfitting()
    opt_gd_paths()
    opt_convexity()
    opt_lp()
    opt_lagrange()
    opt_schedules()
    adv_fourier()
    adv_graph()
    adv_logistic()
    peak, day, final_r = adv_sir()
    print(f"SIR peak {peak:.4f} on day {day:.1f}; final recovered {final_r:.4f}")
    adv_complex()


if __name__ == "__main__":
    main()
