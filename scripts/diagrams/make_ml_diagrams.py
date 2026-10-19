"""
scripts/diagrams/make_ml_diagrams.py - Diagrams for the machine learning articles

Renders the SVG figures used by five machine learning articles into
public/images/articles/<article-slug>/. Charts are computed from the same
data and settings the articles describe (scikit-learn toy or synthetic data,
fixed random seeds), and the script prints the numbers quoted in alt text and
captions. If you change an example in an article, change it here too and re-run:

    python scripts/diagrams/make_ml_diagrams.py

Figures follow the site theme: dark neutral background, green accent, amber as
the only second accent, solid fills only (no gradients or colormaps), and no blue.
"""

import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from matplotlib.colors import ListedColormap  # noqa: E402
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Rectangle  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "images" / "articles"

BG = "#202020"
BG2 = "#292929"
FG = "#e5e5e5"
FG2 = "#b3b3b3"
GRID = "#383838"
GREEN = "#6ab668"
GREEN_MUTED = "#294329"
AMBER = "#fbbf24"
AMBER_MUTED = "#4a3d1c"
NEUTRAL = "#949494"

plt.rcParams.update(
    {
        "figure.facecolor": BG,
        "axes.facecolor": BG,
        "savefig.facecolor": BG,
        "axes.edgecolor": GRID,
        "axes.labelcolor": FG,
        "axes.titlecolor": FG,
        "axes.titlesize": 11.5,
        "axes.labelsize": 10.5,
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
TWO_TONE = ListedColormap([AMBER_MUTED, GREEN_MUTED])  # two solid region colors, not a gradient


def save(fig, slug, name):
    folder = OUT / slug
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{name}.svg"
    fig.savefig(path, format="svg", dpi=100, bbox_inches=None, metadata={"Date": None})
    if os.environ.get("ML_DIAGRAM_PREVIEW"):  # optional PNG copies for reviewing the figures
        fig.savefig(Path(os.environ["ML_DIAGRAM_PREVIEW"]) / f"{name}.png", dpi=100)
    w, h = fig.get_size_inches() * 100
    plt.close(fig)
    print(f"wrote {path.relative_to(ROOT)} ({w:.0f}x{h:.0f})")


def style(ax, grid=True):
    for spine in ax.spines.values():
        spine.set_color(GRID)
    if grid:
        ax.grid(True)
        ax.set_axisbelow(True)


def blank(ax):
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")


def box(ax, x, y, w, h, title, body="", edge=GRID, face=BG2, title_color=FG, size=9.5):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.4,rounding_size=1.2",
                                facecolor=face, edgecolor=edge, linewidth=1.2))
    if body:
        ax.text(x + w / 2, y + h - 2.6, title, ha="center", va="top", color=title_color, fontsize=size + 0.5,
                fontweight="bold")
        ax.text(x + w / 2, y + h - 8.2, body, ha="center", va="top", color=FG2, fontsize=size - 1, linespacing=1.35)
    else:
        ax.text(x + w / 2, y + h / 2, title, ha="center", va="center", color=title_color, fontsize=size,
                fontweight="bold")


def connect(ax, start, end, color=FG2, style_="-|>", lw=1.3, rad=0.0):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle=style_, mutation_scale=12, color=color, linewidth=lw,
                                 connectionstyle=f"arc3,rad={rad}"))


def scatter2(ax, X, y, s=14):
    ax.scatter(X[y == 0, 0], X[y == 0, 1], s=s, color=AMBER, edgecolor=BG, linewidth=0.4, zorder=3)
    ax.scatter(X[y == 1, 0], X[y == 1, 1], s=s, color=GREEN, edgecolor=BG, linewidth=0.4, zorder=3)


# ---------------------------------------------------------------------------
# 100 machine learning algorithms
# ---------------------------------------------------------------------------
ALG = "machine-learning-algorithms-explained"


def alg_family_map():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.2))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    box(ax, 38, 88, 24, 8, "Machine learning", edge=GREEN, title_color=GREEN, size=10.5)
    groups = [
        (2, "Supervised", [("Linear models", "1–12"), ("Neighbors, Bayes, kernels", "13–22"),
                           ("Trees and ensembles", "23–35"), ("Neural networks", "72–89")]),
        (35, "Unsupervised", [("Clustering", "36–46"), ("Dimensionality reduction", "47–58"),
                              ("Anomaly detection", "35, 59–61"), ("Association, recommenders", "62–64")]),
        (68, "Other settings", [("Time series, sequences", "65–69"), ("Semi-supervised", "70–71"),
                                ("Reinforcement learning", "90–98"), ("Uncertainty, tuning", "99–100")]),
    ]
    for x, name, items in groups:
        box(ax, x, 70, 30, 8, name, edge=GREEN, face=GREEN_MUTED, size=10)
        connect(ax, (50, 88), (x + 15, 78.6), color=GRID)
        for i, (label, nums) in enumerate(items):
            y = 55 - i * 15
            box(ax, x, y, 30, 11, label, f"entries {nums}", size=9.2)
    save(fig, ALG, "algorithm-family-map")


def alg_decision_boundaries():
    from sklearn.datasets import make_moons
    from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import train_test_split
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.svm import SVC
    from sklearn.tree import DecisionTreeClassifier

    X, y = make_moons(n_samples=300, noise=0.25, random_state=0)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)
    models = [
        ("Logistic regression", LogisticRegression()),
        ("k-nearest neighbors (k=15)", KNeighborsClassifier(15)),
        ("RBF support vector machine", SVC(C=1.0)),
        ("Decision tree (depth 4)", DecisionTreeClassifier(max_depth=4, random_state=0)),
        ("Random forest", RandomForestClassifier(n_estimators=200, random_state=0)),
        ("Gradient boosting", GradientBoostingClassifier(random_state=0)),
    ]
    xx, yy = np.meshgrid(np.linspace(-2.0, 3.0, 300), np.linspace(-1.6, 2.1, 300))
    fig, axes = plt.subplots(2, 3, figsize=(WIDTH_IN, 4.6))
    for ax, (name, model) in zip(axes.ravel(), models):
        model.fit(X_tr, y_tr)
        acc = model.score(X_te, y_te)
        print(f"  {name}: test accuracy {acc:.3f}")
        zz = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
        ax.contourf(xx, yy, zz, levels=[-0.5, 0.5, 1.5], cmap=TWO_TONE)
        ax.contour(xx, yy, zz, levels=[0.5], colors=[FG2], linewidths=0.8)
        scatter2(ax, X_tr, y_tr, s=9)
        ax.set_title(f"{name}\ntest accuracy {acc:.2f}", fontsize=9.5)
        ax.set_xticks([])
        ax.set_yticks([])
        style(ax, grid=False)
    fig.subplots_adjust(left=0.01, right=0.99, bottom=0.01, top=0.9, wspace=0.05, hspace=0.32)
    save(fig, ALG, "classifier-decision-boundaries")


def alg_kmeans_dbscan():
    from sklearn.cluster import DBSCAN, KMeans
    from sklearn.datasets import make_moons

    X, _ = make_moons(n_samples=300, noise=0.06, random_state=0)
    km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)
    db = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
    print(f"  DBSCAN clusters {len(set(db) - {-1})}, noise {int((db == -1).sum())}")
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.0))
    for ax, labels, title in [(axes[0], km, "k-means, k = 2"), (axes[1], db, "DBSCAN, eps = 0.2, min_samples = 5")]:
        style(ax)
        for value, color in [(0, GREEN), (1, AMBER)]:
            m = labels == value
            ax.scatter(X[m, 0], X[m, 1], s=12, color=color, edgecolor=BG, linewidth=0.3)
        noise = labels == -1
        if noise.any():
            ax.scatter(X[noise, 0], X[noise, 1], s=28, marker="x", color=FG, linewidth=1.2, label="noise")
            ax.legend(loc="lower left")
        ax.set_title(title)
        ax.set_xticks([])
        ax.set_yticks([])
    fig.subplots_adjust(left=0.02, right=0.98, bottom=0.04, top=0.9, wspace=0.08)
    save(fig, ALG, "kmeans-vs-dbscan")


def alg_pca():
    rng = np.random.default_rng(0)
    X = rng.multivariate_normal([0, 0], [[3.0, 1.9], [1.9, 1.5]], size=400)
    Xc = X - X.mean(axis=0)
    _, s, vt = np.linalg.svd(Xc, full_matrices=False)
    ratio = s**2 / (s**2).sum()
    std = s / np.sqrt(len(X) - 1)
    print(f"  PCA variance ratio {ratio.round(3)}")
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.6))
    style(ax)
    ax.scatter(X[:, 0], X[:, 1], s=9, color=NEUTRAL, alpha=0.8, edgecolor="none")
    c = X.mean(axis=0)
    for vec, sd, r, color, name in [(vt[0], std[0], ratio[0], GREEN, "PC1"), (vt[1], std[1], ratio[1], AMBER, "PC2")]:
        end = c + 2 * sd * vec
        ax.add_patch(FancyArrowPatch(tuple(c), tuple(end), arrowstyle="-|>", mutation_scale=16, color=color, lw=2.6))
        pos, ha = ((end[0] + 0.3, end[1] + 0.3), "left") if name == "PC1" else ((end[0] - 0.4, end[1] + 0.6), "right")
        ax.text(*pos, f"{name}: {r * 100:.1f}% of variance", color=color, fontsize=10.5, ha=ha,
                bbox={"boxstyle": "round,pad=0.3", "facecolor": BG, "edgecolor": color})
    ax.set_aspect("equal")
    ax.set_xlim(-6.5, 7.5)
    ax.set_ylim(-4.2, 4.2)
    ax.set_title("Principal components of 400 correlated points")
    fig.subplots_adjust(left=0.06, right=0.98, bottom=0.07, top=0.9)
    save(fig, ALG, "pca-principal-axes")


def alg_boosting():
    from sklearn.datasets import make_classification
    from sklearn.ensemble import GradientBoostingClassifier
    from sklearn.metrics import log_loss
    from sklearn.model_selection import train_test_split

    X, y = make_classification(n_samples=2000, n_features=20, n_informative=6, flip_y=0.08, random_state=0)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.5, random_state=0)
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax)
    for lr, color, ls in [(1.0, AMBER, "--"), (0.1, GREEN, "-"), (0.01, FG2, ":")]:
        model = GradientBoostingClassifier(n_estimators=500, learning_rate=lr, max_depth=3, random_state=0)
        model.fit(X_tr, y_tr)
        losses = [log_loss(y_te, p) for p in model.staged_predict_proba(X_te)]
        best = int(np.argmin(losses))
        print(f"  lr={lr}: best stage {best + 1}, loss {losses[best]:.3f}, final {losses[-1]:.3f}")
        ax.plot(range(1, 501), losses, color=color, linestyle=ls, label=f"learning rate {lr}")
        ax.plot(best + 1, losses[best], "o", color=color, ms=6)
    ax.set_xlabel("number of boosting stages (trees)")
    ax.set_ylabel("test log loss (lower is better)")
    ax.set_ylim(0.15, 0.75)
    ax.legend()
    ax.set_title("Gradient boosting: learning rate versus number of trees")
    fig.subplots_adjust(left=0.1, right=0.98, bottom=0.15, top=0.9)
    save(fig, ALG, "boosting-learning-rate")


def alg_bandits():
    rng = np.random.default_rng(0)
    p = np.array([0.05, 0.04, 0.03])
    T, runs = 20000, 100
    regret = {"epsilon-greedy (eps = 0.1)": np.zeros(T), "UCB1": np.zeros(T), "Thompson sampling": np.zeros(T)}
    for _ in range(runs):
        for name in regret:
            n = np.zeros(3)
            s = np.zeros(3)
            r = np.zeros(T)
            for t in range(T):
                if name.startswith("epsilon"):
                    arm = rng.integers(3) if rng.random() < 0.1 or n.min() == 0 else int(np.argmax(s / np.maximum(n, 1)))
                elif name == "UCB1":
                    arm = t if t < 3 else int(np.argmax(s / n + np.sqrt(2 * np.log(t) / n)))
                else:
                    arm = int(np.argmax(rng.beta(1 + s, 1 + n - s)))
                reward = rng.random() < p[arm]
                n[arm] += 1
                s[arm] += reward
                r[t] = p.max() - p[arm]
            regret[name] += np.cumsum(r)
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.4))
    style(ax)
    for (name, total), color, ls in zip(regret.items(), [AMBER, FG2, GREEN], ["--", ":", "-"]):
        avg = total / runs
        print(f"  {name}: mean cumulative regret after {T} rounds {avg[-1]:.1f}")
        ax.plot(range(1, T + 1), avg, color=color, linestyle=ls, label=name)
    ax.set_xlabel("round (one ad shown per round)")
    ax.set_ylabel("expected clicks lost")
    ax.set_title("Three ads with click rates 5%, 4% and 3%: cumulative regret (mean of 100 runs)")
    ax.legend(loc="upper left")
    fig.subplots_adjust(left=0.09, right=0.98, bottom=0.15, top=0.9)
    save(fig, ALG, "bandit-regret")


# ---------------------------------------------------------------------------
# 101 machine learning projects
# ---------------------------------------------------------------------------
PROJ = "machine-learning-projects"


def proj_roadmap():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    levels = [
        ("Beginner", "projects 1–30", ["Algorithms from scratch", "scikit-learn pipelines", "Metrics and thresholds", "Calibration, intervals", "A first API and demo"]),
        ("Intermediate", "projects 31–65", ["Boosting, ranking, recsys", "Text, vision, audio", "Time series, sensors", "Graphs, molecules", "Interpretability"]),
        ("Advanced", "projects 66–101", ["Language models, RAG", "Diffusion, GANs, VAEs", "Reinforcement learning", "Serving, MLOps", "Robustness, fairness, privacy"]),
    ]
    for i, (name, nums, skills) in enumerate(levels):
        x = 3 + i * 33
        face = [BG2, GREEN_MUTED, GREEN_MUTED][i]
        box(ax, x, 8, 28, 84, "", edge=GREEN if i else GRID, face=face)
        ax.text(x + 14, 85, name, ha="center", va="top", color=GREEN if i else FG, fontsize=12, fontweight="bold")
        ax.text(x + 14, 75, nums, ha="center", va="top", color=FG2, fontsize=9.5)
        for j, skill in enumerate(skills):
            ax.text(x + 14, 62 - j * 11, skill, ha="center", va="top", color=FG, fontsize=9.5)
        if i < 2:
            connect(ax, (x + 28.6, 50), (x + 32.4, 50), color=GREEN, lw=1.8)
    save(fig, PROJ, "project-roadmap")


def proj_lifecycle():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    steps = ["1. Define problem\nand metric", "2. Get and\nunderstand data", "3. Build a\nbaseline",
             "4. Iterate on\nmodels, features", "5. Evaluate on\nheld-out test", "6. Ship and\nmonitor"]
    xs = [1.5, 18, 34.5, 51, 67.5, 84]
    for i, (x, label) in enumerate(zip(xs, steps)):
        box(ax, x, 62, 14.5, 26, label, edge=GREEN if i in (2, 4) else GRID, size=8.2)
        if i < 5:
            connect(ax, (x + 15.0, 75), (x + 16.6, 75), color=FG2)
    connect(ax, (74.75, 60.5), (58.25, 60.5), color=AMBER, rad=-0.5)
    ax.text(73, 47, "error analysis", color=AMBER, ha="left", fontsize=9)
    connect(ax, (91.25, 60.5), (25.25, 60.5), color=AMBER, rad=-0.35)
    ax.text(58.25, 22, "drift, new data, new questions", color=AMBER, ha="center", fontsize=9)
    save(fig, PROJ, "ml-project-lifecycle")


def proj_learning_curves():
    from sklearn.datasets import load_digits
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import StratifiedKFold, learning_curve
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler

    X, y = load_digits(return_X_y=True)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
    sizes, tr, va = learning_curve(model, X, y, cv=cv, train_sizes=np.linspace(0.1, 1.0, 5))
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.2))
    style(ax)
    for scores, color, ls, label in [(tr, AMBER, "--", "training accuracy"), (va, GREEN, "-", "validation accuracy")]:
        m, sd = scores.mean(1), scores.std(1)
        ax.fill_between(sizes, m - sd, m + sd, color=color, alpha=0.15, linewidth=0)
        ax.plot(sizes, m, ls, color=color, marker="o", label=label)
        print(f"  {label}: " + ", ".join(f"{n}:{v:.3f}" for n, v in zip(sizes, m)))
    ax.set_xlabel("number of training images")
    ax.set_ylabel("accuracy")
    ax.set_ylim(0.75, 1.02)
    ax.legend(loc="lower right")
    ax.set_title("Learning curve: logistic regression on the Digits dataset (5-fold CV)")
    fig.subplots_adjust(left=0.1, right=0.98, bottom=0.16, top=0.9)
    save(fig, PROJ, "learning-curves")


def proj_leakage():
    from sklearn.feature_selection import SelectKBest, f_classif
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import cross_val_score
    from sklearn.pipeline import make_pipeline

    rng = np.random.default_rng(0)
    X = rng.normal(size=(100, 5000))
    y = rng.integers(0, 2, size=100)
    leaky = cross_val_score(LogisticRegression(max_iter=1000), SelectKBest(f_classif, k=20).fit_transform(X, y), y, cv=5).mean()
    honest = cross_val_score(make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000)), X, y, cv=5).mean()
    print(f"  leaky {leaky:.3f}, honest {honest:.3f}")
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.6))
    style(ax)
    labels = ["feature selection on all rows,\nthen cross-validation (leaky)", "feature selection inside each\ntraining fold (honest)"]
    ax.barh(labels, [leaky, honest], color=[AMBER, GREEN], height=0.55)
    ax.axvline(0.5, color=FG2, linestyle="--", linewidth=1.2)
    ax.text(0.51, -0.42, "true accuracy on random labels: 0.50", color=FG2, fontsize=9)
    for i, v in enumerate([leaky, honest]):
        ax.text(v + 0.01, i, f"{v:.2f}", va="center", color=FG, fontsize=10.5)
    ax.set_xlim(0, 1.05)
    ax.set_ylim(1.45, -0.6)
    ax.set_xlabel("cross-validated accuracy")
    fig.subplots_adjust(left=0.36, right=0.97, bottom=0.2, top=0.95)
    save(fig, PROJ, "leakage-demo")


# ---------------------------------------------------------------------------
# 100 machine learning datasets
# ---------------------------------------------------------------------------
DATA = "machine-learning-datasets"


def data_choice_flow():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.8))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    box(ax, 38, 86, 24, 9, "What is your goal?", edge=GREEN, title_color=GREEN, size=10)
    goals = [
        ("Learn a technique", "small, clean,\nwell-documented data"),
        ("Portfolio project", "real, messy data close\nto a problem you care about"),
        ("Compare with research", "the standard benchmark\nand its official splits"),
        ("Ship a product", "commercial-use license and\ndata that matches your users"),
    ]
    for i, (goal, advice) in enumerate(goals):
        x = 1.5 + i * 24.5
        connect(ax, (50, 85.5), (x + 11, 72.5), color=GRID)
        box(ax, x, 50, 22, 22, goal, advice, edge=GRID, size=8.6)
        connect(ax, (x + 11, 49.5), (x + 11, 32.5), color=GRID)
    box(ax, 1.5, 12, 96.5, 20, "Then check every dataset", "license and terms  ·  personal or sensitive data  ·  label quality  ·  "
        "how it was collected and split", edge=GREEN, face=GREEN_MUTED, title_color=GREEN, size=9.5)
    save(fig, DATA, "dataset-choice-flow")


def data_splits():
    rng = np.random.default_rng(3)
    n = 24
    groups = np.repeat(np.arange(6), 4)            # 6 patients x 4 visits
    fig, axes = plt.subplots(3, 1, figsize=(WIDTH_IN, 3.0))
    test_random = np.zeros(n, bool)
    test_random[rng.choice(n, 6, replace=False)] = True
    test_group = np.isin(groups, [1, 4])
    test_time = np.arange(n) >= 18
    rows = [("Random split", test_random, "rows from the same patient land on both sides"),
            ("Group split", test_group, "whole patients are held out"),
            ("Time split", test_time, "train on the past, test on the latest period")]
    for ax, (title, test, note) in zip(axes, rows):
        ax.set_xlim(-6.5, n + 0.2)
        ax.set_ylim(-0.6, 1.0)
        ax.axis("off")
        ax.text(-6.4, 0.2, title, va="center", color=FG, fontsize=10, fontweight="bold")
        for i in range(n):
            color = AMBER if test[i] else GREEN_MUTED
            edge = AMBER if test[i] else GREEN
            ax.add_patch(Rectangle((i + 0.05, 0), 0.9, 0.5, facecolor=color, edgecolor=edge, linewidth=0.8))
            if title == "Group split":
                ax.text(i + 0.5, 0.25, "ABCDEF"[groups[i]], ha="center", va="center", fontsize=7.5,
                        color=BG if test[i] else FG)
        ax.text(n / 2, -0.35, note, ha="center", va="center", color=FG2, fontsize=8.8)
    axes[0].text(n - 6, 0.85, "■ training", color=GREEN, fontsize=9)
    axes[0].text(n - 2.5, 0.85, "■ test", color=AMBER, fontsize=9)
    fig.subplots_adjust(left=0.01, right=0.99, bottom=0.02, top=0.97, hspace=0.25)
    save(fig, DATA, "data-splits")


def data_sizes():
    items = [
        ("Iris (flowers)", 150),
        ("Breast Cancer Wisconsin (cases)", 569),
        ("CIFAR-10 (images)", 60_000),
        ("MNIST (images)", 70_000),
        ("Credit Card Fraud (transactions)", 284_807),
        ("COCO (images)", 330_000),
        ("Covertype (rows)", 581_012),
        ("ImageNet-1k training set (images)", 1_281_167),
        ("iNaturalist 2021 training set (images)", 2_700_000),
        ("HIGGS (rows)", 11_000_000),
        ("MovieLens 32M (ratings)", 32_000_000),
        ("Netflix Prize (ratings)", 100_480_507),
        ("Amazon Reviews 2023 (reviews)", 571_540_000),
    ]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.0))
    style(ax)
    names = [n for n, _ in items]
    vals = [v for _, v in items]
    ax.barh(names, vals, color=GREEN, height=0.6)
    ax.set_xscale("log")
    ax.set_xlim(50, 3e10)
    for i, v in enumerate(vals):
        label = f"{v:,}" if v < 1_000_000 else f"{v / 1e6:,.1f} million".replace(".0 million", " million")
        ax.text(v * 1.25, i, label, va="center", color=FG, fontsize=8.8)
    ax.invert_yaxis()
    ax.tick_params(axis="y", labelsize=8.8)
    ax.set_xlabel("number of examples (log scale)")
    ax.grid(axis="y", visible=False)
    fig.subplots_adjust(left=0.37, right=0.98, bottom=0.12, top=0.97)
    save(fig, DATA, "dataset-sizes-log-scale")


def data_imbalance():
    total, fraud = 284_807, 492
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.5))
    ax.axis("off")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 10)
    share = fraud / total * 100
    ax.add_patch(Rectangle((2, 5.4), 96, 2.2, facecolor=GREEN_MUTED, edgecolor=GREEN))
    ax.add_patch(Rectangle((98 - 96 * share / 100 * 20, 5.4), 96 * share / 100 * 20, 2.2, facecolor=AMBER, edgecolor=AMBER))
    ax.text(2, 8.6, f"284,315 legitimate transactions ({100 - share:.2f}%)", color=GREEN, fontsize=10)
    ax.text(98, 8.6, f"492 frauds ({share:.2f}%)", color=AMBER, fontsize=10, ha="right")
    ax.text(98, 4.5, "fraud slice drawn 20x wider than scale so it is visible", color=FG2, fontsize=8, ha="right", va="top")
    ax.text(2, 2.6, f'A model that always predicts "legitimate": accuracy {100 - share:.2f}%, frauds caught 0 of 492 (recall 0%)',
            color=FG, fontsize=10)
    fig.subplots_adjust(0.01, 0.02, 0.99, 0.98)
    print(f"  always-legit accuracy {100 - share:.3f}%")
    save(fig, DATA, "class-imbalance-fraud")


# ---------------------------------------------------------------------------
# 101 feature engineering techniques
# ---------------------------------------------------------------------------
FE = "feature-engineering-techniques"


def fe_scaling():
    from sklearn.preprocessing import MinMaxScaler, RobustScaler, StandardScaler

    rng = np.random.default_rng(0)
    x = np.r_[rng.normal(50, 5, 49), [300.0]].reshape(-1, 1)
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    style(ax)
    rows = [("standard scaling", StandardScaler()), ("min-max scaling", MinMaxScaler()), ("robust scaling", RobustScaler())]
    for i, (name, scaler) in enumerate(rows):
        z = scaler.fit_transform(x).ravel()
        jitter = rng.uniform(-0.12, 0.12, len(z))
        ax.scatter(z[:-1], i + jitter[:-1], s=14, color=GREEN, edgecolor=BG, linewidth=0.3)
        ax.scatter(z[-1:], [i], s=60, marker="D", color=AMBER, edgecolor=BG, linewidth=0.5)
        ax.text(z[-1], i + 0.3, f"outlier at {z[-1]:.1f}", color=AMBER, ha="center", fontsize=8.5)
        print(f"  {name}: normal values span {np.ptp(z[:-1]):.2f}, outlier at {z[-1]:.2f}")
    ax.set_yticks(range(3))
    ax.set_yticklabels([r[0] for r in rows])
    ax.set_ylim(-0.5, 2.7)
    ax.set_xlabel("scaled value (symmetric log axis)")
    ax.set_xscale("symlog", linthresh=1)
    ax.set_xlim(-3, 150)
    fig.subplots_adjust(left=0.2, right=0.98, bottom=0.17, top=0.96)
    save(fig, FE, "scaling-with-outliers")


def fe_log():
    from scipy.stats import skew

    rng = np.random.default_rng(0)
    income = rng.lognormal(mean=10.5, sigma=0.8, size=5000)
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 2.8))
    for ax, data, title, xlabel in [(axes[0], income / 1000, "raw income", "thousands"),
                                    (axes[1], np.log1p(income), "log(1 + income)", "log scale")]:
        style(ax)
        ax.hist(data, bins=50, color=GREEN, edgecolor=BG, linewidth=0.3)
        ax.set_title(title)
        ax.set_xlabel(xlabel)
        ax.set_yticks([])
    print(f"  skew raw {skew(income):.2f}, log {skew(np.log1p(income)):.2f}")
    fig.subplots_adjust(left=0.03, right=0.98, bottom=0.18, top=0.88, wspace=0.12)
    save(fig, FE, "log-transform-skew")


def fe_cyclical():
    hours = np.arange(24)
    angle = 2 * np.pi * hours / 24
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.2))
    ax = axes[0]
    style(ax)
    ax.scatter(hours, np.zeros(24), s=30, color=GREEN)
    for h in (0, 23):
        ax.scatter([h], [0], s=70, color=AMBER, zorder=4)
        ax.text(h, 0.25, f"{h}h", color=AMBER, ha="center")
    ax.annotate("", xy=(23, -0.3), xytext=(0, -0.3), arrowprops={"arrowstyle": "<->", "color": FG2})
    ax.text(11.5, -0.55, "23 units apart", color=FG2, ha="center")
    ax.set_ylim(-1, 1)
    ax.set_yticks([])
    ax.set_xlabel("hour")
    ax.set_title("hour as a number")
    ax = axes[1]
    style(ax)
    ax.scatter(np.sin(angle), np.cos(angle), s=30, color=GREEN)
    for h in (0, 6, 12, 18, 23):
        ax.text(1.2 * np.sin(2 * np.pi * h / 24), 1.2 * np.cos(2 * np.pi * h / 24), f"{h}h",
                color=AMBER if h in (0, 23) else FG2, ha="center", va="center", fontsize=9)
    ax.scatter(np.sin(angle[[0, 23]]), np.cos(angle[[0, 23]]), s=70, color=AMBER, zorder=4)
    ax.set_aspect("equal")
    ax.set_xlim(-1.45, 1.45)
    ax.set_ylim(-1.45, 1.45)
    ax.set_xlabel("sin(2π · hour / 24)")
    ax.set_ylabel("cos(2π · hour / 24)")
    ax.set_title("hour as (sin, cos)")
    fig.subplots_adjust(left=0.03, right=0.98, bottom=0.17, top=0.9, wspace=0.25)
    save(fig, FE, "cyclical-hour-encoding")


def fe_poly():
    from sklearn.datasets import make_circles
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import cross_val_score
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import PolynomialFeatures

    X, y = make_circles(n_samples=400, factor=0.4, noise=0.1, random_state=0)
    xx, yy = np.meshgrid(np.linspace(-1.5, 1.5, 300), np.linspace(-1.5, 1.5, 300))
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH_IN, 3.1))
    models = [("raw features x, y", LogisticRegression()),
              ("plus x², xy, y²", make_pipeline(PolynomialFeatures(2), LogisticRegression()))]
    for ax, (name, model) in zip(axes, models):
        acc = cross_val_score(model, X, y, cv=5).mean()
        model.fit(X, y)
        zz = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
        ax.contourf(xx, yy, zz, levels=[-0.5, 0.5, 1.5], cmap=TWO_TONE)
        scatter2(ax, X, y, s=10)
        ax.set_title(f"logistic regression, {name}\nCV accuracy {acc:.2f}", fontsize=9.5)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_aspect("equal")
        style(ax, grid=False)
        print(f"  {name}: {acc:.3f}")
    fig.subplots_adjust(left=0.02, right=0.98, bottom=0.02, top=0.86, wspace=0.08)
    save(fig, FE, "polynomial-features-circles")


def fe_target_encoding():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    ax.text(18, 92, "training rows, split into 5 folds", color=FG, fontsize=9.5)
    for row in range(5):
        y = 74 - row * 14
        ax.text(2, y + 4, f"encode fold {row + 1}", color=FG2, fontsize=8.5, va="center")
        for k in range(5):
            x = 18 + k * 12
            held = k == row
            ax.add_patch(Rectangle((x, y), 11, 9, facecolor=AMBER_MUTED if held else GREEN_MUTED,
                                   edgecolor=AMBER if held else GREEN, linewidth=1))
            ax.text(x + 5.5, y + 4.5, "encoded" if held else "averages", color=FG, fontsize=7.5,
                    ha="center", va="center")
    ax.add_patch(Rectangle((82, 18), 15, 65, facecolor=BG2, edgecolor=FG2, linewidth=1))
    ax.text(89.5, 50.5, "test set\n\nencoded with\naverages from\nall training\nrows", color=FG, fontsize=8.5,
            ha="center", va="center")
    ax.text(18, 5, "green: folds used to compute category averages    amber: fold being encoded",
            color=FG2, fontsize=8.5)
    save(fig, FE, "target-encoding-cross-fitting")


def fe_time_ablation():
    from sklearn.linear_model import Ridge
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import FunctionTransformer, OneHotEncoder, SplineTransformer

    rng = np.random.default_rng(0)
    hours = np.tile(np.arange(24), 120)                        # 120 days of hourly data
    pattern = 20 + 15 * np.exp(-((hours - 8) ** 2) / 4) + 25 * np.exp(-((hours - 18) ** 2) / 6)
    demand = pattern + rng.normal(0, 3, len(hours))
    X = hours.reshape(-1, 1).astype(float)
    split = 24 * 90                                            # first 90 days train, last 30 test
    encoders = [
        ("hour as a number", FunctionTransformer()),
        ("sin and cos of hour", FunctionTransformer(lambda h: np.c_[np.sin(2 * np.pi * h / 24), np.cos(2 * np.pi * h / 24)])),
        ("one-hot hour", OneHotEncoder(handle_unknown="ignore")),
        ("periodic splines", SplineTransformer(degree=3, extrapolation="periodic",
                                               knots=np.linspace(0, 24, 13).reshape(-1, 1))),
    ]
    scores = []
    for name, enc in encoders:
        model = make_pipeline(enc, Ridge(alpha=1e-3)).fit(X[:split], demand[:split])
        r2 = model.score(X[split:], demand[split:])
        scores.append(r2)
        print(f"  {name}: test R^2 {r2:.3f}")
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 2.9))
    style(ax)
    names = [n for n, _ in encoders]
    ax.barh(names, [max(v, 0) for v in scores], color=[NEUTRAL, AMBER, GREEN, GREEN], height=0.55)
    for i, v in enumerate(scores):
        ax.text(max(v, 0) + 0.01, i, f"{v:.2f}", va="center", color=FG)
    ax.set_xlim(0, 1.08)
    ax.invert_yaxis()
    ax.set_xlabel("test R² of a ridge regression on the hour alone (last 30 of 120 days)")
    ax.grid(axis="y", visible=False)
    fig.subplots_adjust(left=0.24, right=0.97, bottom=0.18, top=0.96)
    save(fig, FE, "time-feature-ablation")


# ---------------------------------------------------------------------------
# 100 machine learning applications
# ---------------------------------------------------------------------------
APP = "machine-learning-applications"


def app_industry_map():
    industries = [
        ("Healthcare, life sciences", "1–14", "imaging, risk, molecules"),
        ("Finance, insurance", "15–23", "fraud, credit, pricing"),
        ("Retail, e-commerce", "24–33", "recommend, forecast, search"),
        ("Media, entertainment", "34–41", "recommend, generate, moderate"),
        ("Transport, logistics", "42–51", "perception, ETA, routing"),
        ("Manufacturing, industry", "52–59", "inspection, maintenance"),
        ("Energy, utilities", "60–66", "forecasting, control"),
        ("Agriculture, food", "67–72", "vision, satellites, sensors"),
        ("Climate, environment", "73–79", "weather, floods, monitoring"),
        ("Science, research", "80–85", "discovery, search"),
        ("Public sector, legal, security", "86–92", "risk scores, review, threats"),
        ("Education, work", "93–96", "adaptive learning, hiring"),
        ("Technology, communication", "97–100", "code, access, search"),
    ]
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 4.3))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    cols = 3
    w, h = 31.5, 16.5
    for i, (name, nums, tasks) in enumerate(industries):
        r, c = divmod(i, cols)
        x = 1.5 + c * (w + 1.5)
        y = 81.5 - r * (h + 2.0)
        if i == 12:
            x = 1.5 + 1 * (w + 1.5)
        box(ax, x, y, w, h, name, f"entries {nums}\n{tasks}", edge=GREEN if i % 2 == 0 else GRID, size=8.8)
    save(fig, APP, "applications-by-industry")


def app_production_loop():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    steps = [("Data", "features at\nprediction time"), ("Model", "score or\nprediction"),
             ("Decision policy", "threshold, ranking\nor human review"), ("Action", "block, treat,\nrecommend"),
             ("Outcome", "what actually\nhappened")]
    xs = [1.5, 21.5, 41.5, 61.5, 81.5]
    for i, ((title, body), x) in enumerate(zip(steps, xs)):
        box(ax, x, 52, 17, 30, title, body, edge=GREEN if title == "Decision policy" else GRID, size=9)
        if i < 4:
            connect(ax, (x + 17.5, 67), (x + 19.5, 67), color=FG2)
    connect(ax, (90, 51), (10, 51), color=AMBER, rad=-0.28)
    ax.text(50, 38, "outcomes become new training data", color=AMBER, ha="center", fontsize=9)
    box(ax, 20, 3, 60, 12, "Monitoring: drift, errors, fairness, retraining triggers", edge=GREEN, face=GREEN_MUTED,
        title_color=GREEN, size=8.6)
    save(fig, APP, "ml-in-production-loop")


def app_triage():
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.0))
    fig.subplots_adjust(0, 0, 1, 1)
    blank(ax)
    box(ax, 1.5, 38, 18, 26, "Screening exam", "mammogram\nimages", size=9)
    box(ax, 25, 38, 20, 26, "AI risk score", "1 (lowest) to\n10 (highest)", edge=GREEN, title_color=GREEN, size=9)
    box(ax, 52, 62, 22, 26, "Scores 1–9", "read by one\nradiologist", size=9)
    box(ax, 52, 12, 22, 26, "Score 10", "read by two\nradiologists", edge=AMBER, title_color=AMBER, size=9)
    box(ax, 80, 38, 18.5, 26, "Recall decision", "made by the\nradiologists", size=9)
    connect(ax, (20, 51), (24.5, 51))
    connect(ax, (45.5, 55), (51.5, 72))
    connect(ax, (45.5, 47), (51.5, 28))
    connect(ax, (74.5, 75), (79.5, 57))
    connect(ax, (74.5, 25), (79.5, 45))
    ax.text(35, 24, "AI marks on suspicious\nareas shown to readers", color=FG2, ha="center", fontsize=8.2)
    save(fig, APP, "ai-triage-workflow")


def app_threshold():
    from sklearn.datasets import make_classification
    from sklearn.ensemble import HistGradientBoostingClassifier
    from sklearn.model_selection import train_test_split

    X, y = make_classification(n_samples=200_000, n_features=20, n_informative=8, weights=[0.995], flip_y=0.001,
                               class_sep=1.0, random_state=0)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.5, stratify=y, random_state=0)
    model = HistGradientBoostingClassifier(random_state=0).fit(X_tr, y_tr)
    p = model.predict_proba(X_te)[:, 1]
    thresholds = np.linspace(0.01, 0.9, 90)
    precision, recall, alerts = [], [], []
    for t in thresholds:
        flag = p >= t
        tp = (flag & (y_te == 1)).sum()
        precision.append(tp / max(flag.sum(), 1))
        recall.append(tp / (y_te == 1).sum())
        alerts.append(flag.sum() / len(y_te) * 10_000)
    precision, recall, alerts = map(np.array, (precision, recall, alerts))
    print(f"  fraud share in test set {y_te.mean() * 100:.2f}%")
    for t in (0.05, 0.2, 0.5):
        i = int(np.argmin(np.abs(thresholds - t)))
        print(f"  threshold {t}: precision {precision[i]:.2f}, recall {recall[i]:.2f}, alerts per 10k {alerts[i]:.0f}")
    fig, ax = plt.subplots(figsize=(WIDTH_IN, 3.3))
    style(ax)
    ax.plot(thresholds, recall, color=GREEN, label="recall: share of fraud caught")
    ax.plot(thresholds, precision, "--", color=AMBER, label="precision: share of alerts that are fraud")
    ax.set_xlabel("alert threshold on the model's fraud score")
    ax.set_ylabel("share")
    ax.set_ylim(0, 1.02)
    ax2 = ax.twinx()
    ax2.plot(thresholds, alerts, ":", color=FG2, label="alerts per 10,000 transactions")
    ax2.set_ylabel("alerts per 10,000 transactions", color=FG2)
    ax2.tick_params(axis="y", colors=FG2)
    for spine in ax2.spines.values():
        spine.set_color(GRID)
    lines = ax.get_lines() + ax2.get_lines()
    ax.legend(lines, [l.get_label() for l in lines], loc="lower center", bbox_to_anchor=(0.5, 1.0), ncol=3,
              fontsize=8.2, frameon=False)
    fig.subplots_adjust(left=0.08, right=0.9, bottom=0.15, top=0.88)
    save(fig, APP, "fraud-threshold-tradeoff")


def main():
    only = os.environ.get("ML_DIAGRAM_ONLY")  # optional comma-separated function names
    for fn in [alg_family_map, alg_decision_boundaries, alg_kmeans_dbscan, alg_pca, alg_boosting, alg_bandits,
               proj_roadmap, proj_lifecycle, proj_learning_curves, proj_leakage,
               data_choice_flow, data_splits, data_sizes, data_imbalance,
               fe_scaling, fe_log, fe_cyclical, fe_poly, fe_target_encoding, fe_time_ablation,
               app_industry_map, app_production_loop, app_triage, app_threshold]:
        if only and fn.__name__ not in only.split(","):
            continue
        print(fn.__name__)
        fn()


if __name__ == "__main__":
    main()
