---
title: 100 Best Python Machine Learning Examples With Real-World Applications
seoTitle: 100 Python Machine Learning Examples With Real Applications
description: 100 runnable scikit-learn examples for classification, regression, text, clustering, anomaly detection, forecasting and recommendations, with real output.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Engineering
tags:
  - python
  - machine learning
  - scikit-learn
  - data science
  - ai
tocDepth: 2
---

The fastest way to learn machine learning in Python is to see the same workflow solve many different problems: split the data, build a pipeline, fit, evaluate with a metric that matches the goal, and inspect what the model learned. This article walks through that workflow in 100 short examples, each tied to a real-world use such as medical screening, churn prediction, spam filtering, customer segmentation, fraud detection, demand forecasting or product recommendations.

Every example runs on its own in a few seconds. They were run with **scikit-learn 1.9.0, NumPy 2.3.5, pandas 3.0.3 and SciPy 1.18.1 on Python 3.13**, and the output under each snippet is what it printed. Small differences in the last digits are normal on other machines.

**About the data.** To keep everything runnable offline, the examples use two kinds of data, and each example says which:

- **Real datasets bundled with scikit-learn**, which need no download: Breast Cancer Wisconsin (diagnostic), Diabetes, Wine, Digits and Iris ([scikit-learn toy datasets](https://scikit-learn.org/stable/datasets/toy_dataset.html)).
- **Synthetic data**, generated with `make_classification`, `make_regression`, `make_blobs` or a few lines of NumPy. Synthetic data shows how a technique works, but the scores it produces say nothing about how the technique performs on your real problem.

None of the scores below are benchmarks. They show what the code does on these datasets.

## Workflow foundations

### 1. Hold out a test set with a stratified split

**Application: any classifier.** `stratify=y` keeps class proportions equal in both parts, which matters when one class is rare. Data: Breast Cancer Wisconsin (real).

```python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)
print(X_train.shape, X_test.shape)
print(np.bincount(y_train) / len(y_train), np.bincount(y_test) / len(y_test))
```

```text
(426, 30) (143, 30)
[0.37323944 0.62676056] [0.37062937 0.62937063]
```

### 2. Always start with a baseline

**Application: deciding whether a model is worth deploying.** `DummyClassifier` predicts the most common class. A model that cannot beat it has learned nothing useful. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print(round(baseline.score(X_test, y_test), 3))
```

```text
0.629
```

### 3. Put preprocessing and the model in one `Pipeline`

**Application: tumor diagnosis from cell measurements.** A pipeline applies scaling inside each training step, so the test data never influences the scaler. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)
print(round(model.score(X_test, y_test), 3))
```

```text
0.958
```

### 4. Estimate performance with cross-validation

**Application: comparing models fairly.** One split can be lucky. Five-fold cross-validation gives five scores; report their mean and spread. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
scores = cross_val_score(model, X, y, cv=5)
print(scores.round(3), round(scores.mean(), 3), round(scores.std(), 3))
```

```text
[0.982 0.982 0.974 0.974 0.991] 0.981 0.007
```

### 5. Mix numeric and categorical columns with `ColumnTransformer`

**Application: tabular business data.** Each column type gets its own preprocessing inside one model object. Data: a small synthetic customer table.

```python
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.DataFrame({
    "age": [25, 40, 33, 52, 29, 61],
    "plan": ["basic", "pro", "pro", "basic", "free", "pro"],
    "monthly_spend": [20, 85, 70, 25, 0, 90],
    "churned": [1, 0, 0, 1, 1, 0],
})
pre = ColumnTransformer([
    ("num", StandardScaler(), ["age", "monthly_spend"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["plan"]),
])
model = Pipeline([("pre", pre), ("clf", LogisticRegression())])
model.fit(df.drop(columns="churned"), df["churned"])
new = pd.DataFrame({"age": [45], "plan": ["enterprise"], "monthly_spend": [80]})
print(model.predict(new), model.named_steps["pre"].get_feature_names_out().tolist())
```

```text
[0] ['num__age', 'num__monthly_spend', 'cat__plan_basic', 'cat__plan_free', 'cat__plan_pro']
```

### 6. Impute missing values inside the pipeline

**Application: sensor or survey data with gaps.** `SimpleImputer` learns the fill values (here, medians) from the training data only. `add_indicator=True` adds a column flagging which values were missing, which is sometimes predictive by itself. Data: synthetic.

```python
import numpy as np
from sklearn.impute import SimpleImputer

X_train = np.array([[1.0, 10.0], [np.nan, 12.0], [3.0, np.nan], [5.0, 14.0]])
imp = SimpleImputer(strategy="median", add_indicator=True).fit(X_train)
print(imp.statistics_)
print(imp.transform(np.array([[np.nan, np.nan]])))
```

```text
[ 3. 12.]
[[ 3. 12.  1.  1.]]
```

### 7. See data leakage in action

**Application: avoiding results that collapse in production.** Selecting features on the full dataset before cross-validation leaks label information. On pure noise, the leaky version looks far better than chance; the correct pipeline does not. Data: random noise (synthetic).

```python
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

rng = np.random.default_rng(0)
X = rng.normal(size=(100, 5_000))
y = rng.integers(0, 2, size=100)

X_leaky = SelectKBest(f_classif, k=20).fit_transform(X, y)
leaky = cross_val_score(LogisticRegression(), X_leaky, y, cv=5).mean()
honest = cross_val_score(make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression()), X, y, cv=5).mean()
print(round(leaky, 2), round(honest, 2))
```

```text
0.85 0.48
```

### 8. Tune hyperparameters with `GridSearchCV`

**Application: choosing model complexity.** Parameter names use `step__param` syntax to reach inside a pipeline. Data: Wine (real).

```python
from sklearn.datasets import load_wine
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_wine(return_X_y=True)
pipe = make_pipeline(StandardScaler(), KNeighborsClassifier())
grid = GridSearchCV(pipe, {"kneighborsclassifier__n_neighbors": [1, 3, 5, 7, 9]}, cv=5)
grid.fit(X, y)
print(grid.best_params_, round(grid.best_score_, 3))
```

```text
{'kneighborsclassifier__n_neighbors': 7} 0.967
```

### 9. Search large spaces with `RandomizedSearchCV`

**Application: tuning tree ensembles cheaply.** Random search samples a fixed number of combinations from distributions. Data: Breast Cancer Wisconsin (real).

```python
from scipy.stats import randint
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV

X, y = load_breast_cancer(return_X_y=True)
search = RandomizedSearchCV(
    RandomForestClassifier(n_estimators=100, random_state=0),
    {"max_depth": randint(2, 12), "min_samples_leaf": randint(1, 10)},
    n_iter=8, cv=3, random_state=0,
)
search.fit(X, y)
print(search.best_params_, round(search.best_score_, 3))
```

```text
{'max_depth': 7, 'min_samples_leaf': 1} 0.961
```

### 10. Use nested cross-validation for an honest tuned score

**Application: reporting performance after tuning.** The best score from a grid search is optimistic because the same folds chose the parameters. Wrapping the search in an outer cross-validation loop fixes that. Data: Wine (real).

```python
from sklearn.datasets import load_wine
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_wine(return_X_y=True)
inner = GridSearchCV(make_pipeline(StandardScaler(), SVC()), {"svc__C": [0.1, 1, 10]}, cv=3)
outer_scores = cross_val_score(inner, X, y, cv=5)
print(round(outer_scores.mean(), 3))
```

```text
0.983
```

### 11. Check for overfitting with a learning curve

**Application: deciding whether more data would help.** If validation scores are still rising as the training set grows, collecting more data is likely to help. Data: Digits (real).

```python
from sklearn.datasets import load_digits
from sklearn.model_selection import learning_curve
from sklearn.svm import SVC

X, y = load_digits(return_X_y=True)
sizes, train_scores, val_scores = learning_curve(SVC(), X, y, train_sizes=[0.1, 0.3, 0.6, 1.0], cv=5)
for n, tr, va in zip(sizes, train_scores.mean(axis=1), val_scores.mean(axis=1)):
    print(n, round(tr, 3), round(va, 3))
```

```text
143 0.992 0.817
431 0.998 0.907
862 0.997 0.949
1437 0.997 0.963
```

### 12. Save a trained model with `joblib`

**Application: handing a model to a web service or batch job.** Load it with the same scikit-learn version you saved it with; pickled models are not guaranteed to work across versions, and you should only load files you trust ([model persistence](https://scikit-learn.org/stable/model_persistence.html)). Data: Iris (real).

```python
import joblib
import sklearn
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
joblib.dump({"model": DecisionTreeClassifier(random_state=0).fit(X, y), "sklearn": sklearn.__version__}, "iris_model.joblib")
bundle = joblib.load("iris_model.joblib")
print(bundle["sklearn"], bundle["model"].predict([[5.1, 3.5, 1.4, 0.2]]))
```

```text
1.9.0 [0]
```

## Classification applications

### 13. Read a full classification report

**Application: medical screening.** Accuracy hides which mistakes a model makes. Precision, recall and F1 per class show them. In this dataset class 0 is malignant and class 1 is benign. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, stratify=data.target, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
print(classification_report(y_test, model.predict(X_test), target_names=data.target_names, digits=3))
```

```text
              precision    recall  f1-score   support

   malignant      0.943     0.943     0.943        53
      benign      0.967     0.967     0.967        90

    accuracy                          0.958       143
   macro avg      0.955     0.955     0.955       143
weighted avg      0.958     0.958     0.958       143

```

### 14. Inspect the confusion matrix

**Application: understanding the cost of errors.** Rows are true classes, columns are predicted classes. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
print(confusion_matrix(y_test, model.predict(X_test)))
```

```text
[[50  3]
 [ 3 87]]
```

### 15. Rank by risk with ROC AUC

**Application: prioritizing patients or leads by risk.** ROC AUC measures how well the predicted probabilities rank positives above negatives, independent of any threshold. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
print(round(roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]), 4))
```

```text
0.9952
```

### 16. Use average precision when positives are rare

**Application: fraud alerts.** With 1% positives, ROC AUC can look excellent while most alerts are false. Average precision (the area under the precision-recall curve) reflects that better. Its baseline is the positive rate, not 0.5. Data: synthetic, 1% positive (`flip_y=0` turns off the random label noise `make_classification` adds by default).

```python
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=20_000, weights=[0.99], flip_y=0, class_sep=0.8, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
p = LogisticRegression(max_iter=1000).fit(X_train, y_train).predict_proba(X_test)[:, 1]
print("positive rate", round(y_test.mean(), 4))
print("ROC AUC", round(roc_auc_score(y_test, p), 3), "AP", round(average_precision_score(y_test, p), 3))
```

```text
positive rate 0.01
ROC AUC 0.844 AP 0.404
```

### 17. Handle class imbalance with `class_weight`

**Application: detecting rare defects.** `class_weight="balanced"` makes errors on the rare class cost more, trading precision for recall. Data: synthetic, 5% positive.

```python
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=5_000, weights=[0.95], flip_y=0, class_sep=0.7, random_state=1)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
for cw in [None, "balanced"]:
    pred = LogisticRegression(class_weight=cw, max_iter=1000).fit(X_train, y_train).predict(X_test)
    print(cw, "recall", round(recall_score(y_test, pred), 3), "precision", round(precision_score(y_test, pred), 3))
```

```text
None recall 0.274 precision 0.708
balanced recall 0.694 precision 0.155
```

### 18. Tune the decision threshold

**Application: credit approval with a minimum recall target.** The default 0.5 threshold is rarely optimal. `TunedThresholdClassifierCV` picks the threshold that maximizes a chosen metric using cross-validation. Data: synthetic, 10% positive.

```python
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score
from sklearn.model_selection import TunedThresholdClassifierCV, train_test_split

X, y = make_classification(n_samples=4_000, weights=[0.9], flip_y=0, class_sep=0.8, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
base = LogisticRegression(max_iter=1000).fit(X_train, y_train)
tuned = TunedThresholdClassifierCV(LogisticRegression(max_iter=1000), scoring="f1").fit(X_train, y_train)
print(round(tuned.best_threshold_, 3))
print(round(f1_score(y_test, base.predict(X_test)), 3), round(f1_score(y_test, tuned.predict(X_test)), 3))
```

```text
0.221
0.319 0.509
```

### 19. Calibrate probabilities

**Application: risk scores that people read as percentages.** Some models rank well but output poorly calibrated probabilities. `CalibratedClassifierCV` fixes that; the Brier score (lower is better) measures it. Data: synthetic.

```python
from sklearn.calibration import CalibratedClassifierCV
from sklearn.datasets import make_classification
from sklearn.metrics import brier_score_loss
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB

X, y = make_classification(n_samples=10_000, n_informative=4, n_redundant=6, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
raw = GaussianNB().fit(X_train, y_train)
cal = CalibratedClassifierCV(GaussianNB(), method="isotonic", cv=5).fit(X_train, y_train)
print(round(brier_score_loss(y_test, raw.predict_proba(X_test)[:, 1]), 4))
print(round(brier_score_loss(y_test, cal.predict_proba(X_test)[:, 1]), 4))
```

```text
0.1817
0.1551
```

### 20. Classify wines with k-nearest neighbors

**Application: product quality grading from lab measurements.** KNN predicts the majority class of the closest training samples. Scaling is essential because it uses distances. Data: Wine (real).

```python
from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_wine(return_X_y=True)
print(round(cross_val_score(KNeighborsClassifier(5), X, y, cv=5).mean(), 3))
print(round(cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(5)), X, y, cv=5).mean(), 3))
```

```text
0.691
0.949
```

### 21. Explain decisions with readable tree rules

**Application: loan or triage rules that must be auditable.** A shallow decision tree can be printed as if/else rules. Data: Iris (real).

```python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text

data = load_iris()
tree = DecisionTreeClassifier(max_depth=2, random_state=0).fit(data.data, data.target)
print(export_text(tree, feature_names=list(data.feature_names)))
```

```text
|--- petal width (cm) <= 0.80
|   |--- class: 0
|--- petal width (cm) >  0.80
|   |--- petal width (cm) <= 1.75
|   |   |--- class: 1
|   |--- petal width (cm) >  1.75
|   |   |--- class: 2

```

### 22. Rank features with a random forest

**Application: finding which measurements matter most.** Impurity-based importances are fast but biased toward high-cardinality features; example 72 shows the more reliable permutation importance. Data: Breast Cancer Wisconsin (real).

```python
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier

data = load_breast_cancer()
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(data.data, data.target)
imp = pd.Series(rf.feature_importances_, index=data.feature_names).sort_values(ascending=False)
print(imp.head(5).round(3))
```

```text
worst concave points    0.137
worst perimeter         0.126
worst radius            0.123
worst area              0.111
mean concave points     0.094
dtype: float64
```

### 23. Use gradient boosting for tabular data

**Application: churn, credit and conversion models.** `HistGradientBoostingClassifier` is fast on large tables and handles missing values natively. Data: synthetic.

```python
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score

X, y = make_classification(n_samples=5_000, n_features=20, n_informative=8, random_state=0)
X[::10, 0] = float("nan")
print(round(cross_val_score(HistGradientBoostingClassifier(random_state=0), X, y, cv=5).mean(), 3))
```

```text
0.958
```

### 24. Stop boosting early on a validation set

**Application: training large models without overfitting.** With `early_stopping=True`, training stops when the validation score stops improving. Data: synthetic.

```python
from sklearn.datasets import make_classification
from sklearn.ensemble import HistGradientBoostingClassifier

X, y = make_classification(n_samples=20_000, random_state=0)
model = HistGradientBoostingClassifier(max_iter=1_000, early_stopping=True, validation_fraction=0.1,
                                       n_iter_no_change=10, random_state=0).fit(X, y)
print(model.n_iter_, "of 1000 iterations used")
```

```text
58 of 1000 iterations used
```

### 25. Use categorical features directly in gradient boosting

**Application: retail data with store, region and product codes.** `categorical_features="from_dtype"` treats pandas `category` columns natively, without one-hot encoding. Data: synthetic, generated by a noise-free rule (an interaction between region and spend), so a perfect score is expected and only shows that the model can learn the interaction.

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(0)
n = 3_000
df = pd.DataFrame({"region": rng.choice(["north", "south", "east", "west"], n),
                   "spend": rng.gamma(2, 50, n)})
y = ((df["region"] == "south") ^ (df["spend"] > 120)).astype(int)
df["region"] = df["region"].astype("category")
model = HistGradientBoostingClassifier(categorical_features="from_dtype", random_state=0)
print(round(cross_val_score(model, df, y, cv=5).mean(), 3))
```

```text
1.0
```

### 26. Recognize handwritten digits with an SVM

**Application: reading handwritten forms.** A support vector machine with an RBF kernel works well on small image datasets. Data: Digits, 8×8 images (real).

```python
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
print(round(SVC(gamma=0.001, C=10).fit(X_train, y_train).score(X_test, y_test), 4))
```

```text
0.9933
```

### 27. Find the confused classes

**Application: knowing where an OCR system fails.** Listing the largest off-diagonal confusion-matrix cells points to the digit pairs that need more data. `8->1` means a true 8 predicted as 1. Data: Digits (real).

```python
import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_predict

X, y = load_digits(return_X_y=True)
pred = cross_val_predict(LogisticRegression(max_iter=5000), X / 16, y, cv=5)
cm = confusion_matrix(y, pred)
np.fill_diagonal(cm, 0)
pairs = sorted(  # (count, true digit, predicted digit)
    ((cm[i, j], i, j) for i in range(10) for j in range(10)), reverse=True)[:3]
print([(f"{i}->{j}", int(c)) for c, i, j in pairs])
```

```text
[('8->1', 12), ('3->8', 12), ('1->9', 9)]
```

### 28. Combine models with soft voting

**Application: squeezing extra accuracy from diverse models.** Soft voting averages predicted probabilities. Data: Wine (real).

```python
from sklearn.datasets import load_wine
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_wine(return_X_y=True)
vote = VotingClassifier([
    ("lr", make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))),
    ("rf", RandomForestClassifier(random_state=0)),
    ("nb", GaussianNB()),
], voting="soft")
print(round(cross_val_score(vote, X, y, cv=5).mean(), 3))
```

```text
0.978
```

### 29. Stack models with a meta-learner

**Application: competitions and high-stakes scoring.** `StackingClassifier` trains a final model on cross-validated predictions of the base models. Data: Breast Cancer Wisconsin (real).

```python
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_breast_cancer(return_X_y=True)
stack = StackingClassifier(
    [("rf", RandomForestClassifier(random_state=0)), ("svc", make_pipeline(StandardScaler(), SVC()))],
    final_estimator=LogisticRegression(),
)
print(round(cross_val_score(stack, X, y, cv=5).mean(), 3))
```

```text
0.974
```

### 30. Predict several labels at once

**Application: tagging support tickets with multiple topics.** `MultiOutputClassifier` fits one classifier per label. Data: synthetic multi-label.

```python
from sklearn.datasets import make_multilabel_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import hamming_loss
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputClassifier

X, Y = make_multilabel_classification(n_samples=2_000, n_classes=4, random_state=0)
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, random_state=0)
model = MultiOutputClassifier(LogisticRegression(max_iter=2000)).fit(X_train, Y_train)
print(Y_test[:2])
print(model.predict(X_test[:2]))
print("hamming loss", round(hamming_loss(Y_test, model.predict(X_test)), 3))
```

```text
[[0 0 1 0]
 [1 0 0 0]]
[[0 0 1 0]
 [1 0 0 0]]
hamming loss 0.205
```

### 31. Predict churn from customer behavior

**Application: subscription retention.** A gradient-boosting model ranks customers by churn risk so a retention team can contact the top of the list. Data: synthetic customers with a churn rule plus noise.

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(42)
n = 5_000
df = pd.DataFrame({
    "tenure_months": rng.integers(1, 60, n),
    "support_tickets": rng.poisson(1.5, n),
    "monthly_fee": rng.normal(50, 15, n).round(2),
})
logit = -1.5 - 0.05 * df["tenure_months"] + 0.6 * df["support_tickets"] + 0.02 * (df["monthly_fee"] - 50)
df["churned"] = rng.random(n) < 1 / (1 + np.exp(-logit))
X_train, X_test, y_train, y_test = train_test_split(df.drop(columns="churned"), df["churned"], random_state=0)
model = HistGradientBoostingClassifier(random_state=0).fit(X_train, y_train)
risk = model.predict_proba(X_test)[:, 1]
top_decile = y_test[risk >= np.quantile(risk, 0.9)].mean()
print("AUC", round(roc_auc_score(y_test, risk), 3), "| churn rate overall", round(y_test.mean(), 3), "| in top 10%", round(top_decile, 3))
```

```text
AUC 0.744 | churn rate overall 0.153 | in top 10% 0.448
```

### 32. Compare models on business cost, not accuracy

**Application: fraud review where a missed fraud costs far more than a review.** Pick the threshold that minimizes total cost. The costs here (500 per missed fraud, 10 per review) are illustrative. Data: synthetic, 2% positive.

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=20_000, weights=[0.98], flip_y=0, class_sep=1.0, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
p = LogisticRegression(max_iter=1000).fit(X_train, y_train).predict_proba(X_test)[:, 1]

def cost(t):
    flagged = p >= t
    return 500 * np.sum(~flagged & (y_test == 1)) + 10 * flagged.sum()

thresholds = np.linspace(0.01, 0.9, 90)
best = thresholds[np.argmin([cost(t) for t in thresholds])]
print("cost at 0.5:", cost(0.5), "| best threshold:", round(best, 2), "cost:", cost(best))
```

```text
cost at 0.5: 38290 | best threshold: 0.04 cost: 18160
```

## Regression applications

### 33. Predict disease progression with linear regression

**Application: clinical outcome modeling.** The Diabetes dataset's target is a measure of disease progression one year after baseline. Data: Diabetes (real).

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
pred = LinearRegression().fit(X_train, y_train).predict(X_test)
print("R2", round(r2_score(y_test, pred), 3), "MAE", round(mean_absolute_error(y_test, pred), 1))
```

```text
R2 0.359 MAE 45.1
```

### 34. Compare regression metrics

**Application: reporting forecast error to stakeholders.** MAE is in the target's units and easy to explain; RMSE punishes large errors more; R² is relative to predicting the mean. Data: Diabetes (real).

```python
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
for model in [DummyRegressor(), Ridge(alpha=0.1)]:
    pred = model.fit(X_train, y_train).predict(X_test)
    print(type(model).__name__, round(mean_absolute_error(y_test, pred), 1),
          round(root_mean_squared_error(y_test, pred), 1), round(r2_score(y_test, pred), 3))
```

```text
DummyRegressor 58.3 70.5 -0.0
Ridge 44.6 56.0 0.369
```

### 35. Shrink coefficients with ridge regression

**Application: models with many correlated inputs.** `RidgeCV` picks the regularization strength by cross-validation. Data: Diabetes (real).

```python
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import RidgeCV

X, y = load_diabetes(return_X_y=True)
model = RidgeCV(alphas=np.logspace(-3, 3, 13)).fit(X, y)
print(model.alpha_, np.abs(model.coef_).round(1))
```

```text
0.0031622776601683794 [  8.8 237.8 521.  322.8 586.2 313.3  10.4 152.8 672.7  69. ]
```

### 36. Select features automatically with the lasso

**Application: finding the few drivers of an outcome.** L1 regularization sets some coefficients exactly to zero. Data: Diabetes (real).

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LassoCV

data = load_diabetes()
lasso = LassoCV(cv=5, random_state=0).fit(data.data, data.target)
kept = [name for name, c in zip(data.feature_names, lasso.coef_) if c != 0]
print(round(lasso.alpha_, 4), kept)
```

```text
0.0038 ['age', 'sex', 'bmi', 'bp', 's1', 's2', 's4', 's5', 's6']
```

### 37. Model curves with polynomial features

**Application: dose-response or wear curves.** Adding squared terms lets a linear model fit a curve. Data: synthetic quadratic with noise.

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

rng = np.random.default_rng(0)
x = rng.uniform(-3, 3, 200).reshape(-1, 1)
y = 0.5 * x.ravel() ** 2 - x.ravel() + rng.normal(0, 0.5, 200)
line = LinearRegression().fit(x, y)
curve = make_pipeline(PolynomialFeatures(2), LinearRegression()).fit(x, y)
print(round(line.score(x, y), 3), round(curve.score(x, y), 3))
print(curve[-1].coef_.round(2), round(curve[-1].intercept_, 2))
```

```text
0.563 0.949
[ 0.   -1.02  0.49] -0.01
```

### 38. Fit smooth trends with splines

**Application: seasonal or nonlinear sensor curves.** `SplineTransformer` builds piecewise polynomial features that stay well behaved at the edges. Data: synthetic sine wave.

```python
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import SplineTransformer

rng = np.random.default_rng(0)
x = np.sort(rng.uniform(0, 10, 300)).reshape(-1, 1)
y = np.sin(x).ravel() + rng.normal(0, 0.2, 300)
model = make_pipeline(SplineTransformer(n_knots=8, degree=3), Ridge(alpha=1e-3)).fit(x, y)
print(round(model.score(x, y), 3))
```

```text
0.923
```

### 39. Predict nonlinear outcomes with gradient boosting

**Application: pricing and demand.** Tree ensembles capture interactions without manual feature engineering. Data: Friedman #1, a standard synthetic benchmark function.

```python
from sklearn.datasets import make_friedman1
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

X, y = make_friedman1(n_samples=3_000, noise=1.0, random_state=0)
print(round(cross_val_score(LinearRegression(), X, y, cv=5).mean(), 3))
print(round(cross_val_score(HistGradientBoostingRegressor(random_state=0), X, y, cv=5).mean(), 3))
```

```text
0.726
0.935
```

### 40. Produce prediction intervals with quantile loss

**Application: delivery-time promises.** Training two models at the 10th and 90th percentiles gives a nominal 80% interval. Always check the actual coverage on test data: quantile models often produce intervals that are too narrow, as they do here, so calibrate them on held-out data before making promises to customers. Data: synthetic with noise that grows with x.

```python
import numpy as np
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
X = rng.uniform(0, 10, (4_000, 1))
y = 2 * X.ravel() + rng.normal(0, 1 + 0.5 * X.ravel())
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
lo = HistGradientBoostingRegressor(loss="quantile", quantile=0.1, random_state=0).fit(X_train, y_train)
hi = HistGradientBoostingRegressor(loss="quantile", quantile=0.9, random_state=0).fit(X_train, y_train)
inside = (y_test >= lo.predict(X_test)) & (y_test <= hi.predict(X_test))  # target: about 0.8
print("coverage", round(inside.mean(), 3))
print("width at x=1:", round(float(hi.predict([[1]])[0] - lo.predict([[1]])[0]), 2),
      "| at x=9:", round(float(hi.predict([[9]])[0] - lo.predict([[9]])[0]), 2))
```

```text
coverage 0.725
width at x=1: 3.63 | at x=9: 14.18
```

### 41. Model counts with Poisson regression

**Application: insurance claims, website visits, defects per batch.** Counts are non-negative and their variance grows with the mean, which Poisson regression assumes. Data: synthetic counts.

```python
import numpy as np
from sklearn.linear_model import PoissonRegressor

rng = np.random.default_rng(0)
X = rng.normal(size=(5_000, 2))
y = rng.poisson(np.exp(0.3 + 0.5 * X[:, 0] - 0.2 * X[:, 1]))
model = PoissonRegressor(alpha=0).fit(X, y)
print(round(model.intercept_, 3), model.coef_.round(3))
print(model.predict([[0, 0]]).round(3))
```

```text
0.313 [ 0.488 -0.206]
[1.367]
```

### 42. Resist outliers with Huber regression

**Application: sensor data with occasional glitches.** Squared error lets a few bad points drag the fit. Huber loss down-weights them. Data: synthetic line with 5% corrupted points.

```python
import numpy as np
from sklearn.linear_model import HuberRegressor, LinearRegression

rng = np.random.default_rng(0)
X = rng.uniform(0, 10, (200, 1))
y = 3 * X.ravel() + 2 + rng.normal(0, 1, 200)
y[:10] += 60
print(round(LinearRegression().fit(X, y).coef_[0], 2), round(HuberRegressor().fit(X, y).coef_[0], 2))
```

```text
3.01 2.97
```

### 43. Predict a skewed target on the log scale

**Application: prices and incomes.** `TransformedTargetRegressor` fits on `log1p(y)` and converts predictions back automatically. Data: synthetic, log-normal target.

```python
import numpy as np
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import median_absolute_error
from sklearn.model_selection import train_test_split

rng = np.random.default_rng(0)
X = rng.normal(size=(3_000, 3))
y = np.exp(10 + X @ np.array([0.4, -0.3, 0.2]) + rng.normal(0, 0.2, 3_000))
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
plain = LinearRegression().fit(X_train, y_train)
logged = TransformedTargetRegressor(LinearRegression(), func=np.log1p, inverse_func=np.expm1).fit(X_train, y_train)
print(round(median_absolute_error(y_test, plain.predict(X_test))), round(median_absolute_error(y_test, logged.predict(X_test))))
```

```text
4263 2728
```

### 44. Enforce a monotonic relationship

**Application: pricing rules where more coverage must never cost less.** Monotonic constraints keep the model consistent with domain knowledge. Data: synthetic.

```python
import numpy as np
from sklearn.ensemble import HistGradientBoostingRegressor

rng = np.random.default_rng(0)
X = rng.uniform(0, 10, (2_000, 1))
y = 5 * X.ravel() + rng.normal(0, 8, 2_000)
grid = np.linspace(0, 10, 50).reshape(-1, 1)
free = HistGradientBoostingRegressor(random_state=0).fit(X, y).predict(grid)
mono = HistGradientBoostingRegressor(monotonic_cst=[1], random_state=0).fit(X, y).predict(grid)
print("decreasing steps without constraint:", int((np.diff(free) < 0).sum()))
print("decreasing steps with constraint:", int((np.diff(mono) < 0).sum()))
```

```text
decreasing steps without constraint: 15
decreasing steps with constraint: 0
```

### 45. Calibrate a monotonic curve with isotonic regression

**Application: mapping a raw score to a probability or price.** Isotonic regression fits the best non-decreasing step function. Data: synthetic.

```python
import numpy as np
from sklearn.isotonic import IsotonicRegression

x = np.arange(10)
y = np.array([1, 2, 1.5, 3, 2.8, 4, 6, 5.5, 7, 8])
print(IsotonicRegression().fit_transform(x, y))
```

```text
[1.   1.75 1.75 2.9  2.9  4.   5.75 5.75 7.   8.  ]
```

### 46. Predict several targets at once

**Application: predicting fitness measurements from exercise data.** Many regressors support multiple outputs natively. Data: Linnerud (real, 20 people; very small).

```python
from sklearn.datasets import load_linnerud
from sklearn.linear_model import Ridge

data = load_linnerud()
model = Ridge(alpha=1.0).fit(data.data, data.target)
print(data.feature_names, "->", data.target_names)
print(model.predict(data.data[:1]).round(1), data.target[:1])
```

```text
['Chins', 'Situps', 'Jumps'] -> ['Weight', 'Waist', 'Pulse']
[[176.2  35.1  57.1]] [[191.  36.  50.]]
```

### 47. Check residuals for patterns

**Application: validating a forecasting model.** If residuals are correlated with the prediction, the model is missing structure. Data: synthetic quadratic fit with a straight line.

```python
import numpy as np
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(0)
x = rng.uniform(0, 10, (500, 1))
y = x.ravel() ** 2 + rng.normal(0, 2, 500)
pred = LinearRegression().fit(x, y).predict(x)
resid = y - pred
middle = (pred > np.quantile(pred, 0.3)) & (pred < np.quantile(pred, 0.7))
print("mean residual at the ends:", round(resid[~middle].mean(), 2), "| in the middle:", round(resid[middle].mean(), 2))
```

```text
mean residual at the ends: 4.69 | in the middle: -7.03
```

### 48. Estimate value from similar items with KNN regression

**Application: valuing a house from comparable sales.** KNN regression averages the targets of the nearest neighbors. Data: synthetic.

```python
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
area = rng.uniform(40, 200, 500)
rooms = np.clip((area / 30 + rng.normal(0, 1, 500)).round(), 1, None)
price = 3_000 * area + 10_000 * rooms + rng.normal(0, 20_000, 500)
X = np.column_stack([area, rooms])
model = make_pipeline(StandardScaler(), KNeighborsRegressor(n_neighbors=10, weights="distance")).fit(X, price)
print(round(model.predict([[120, 4]])[0], -3))
```

```text
409000.0
```

## Text and language applications

### 49. Classify sentiment with TF-IDF and logistic regression

**Application: product review monitoring.** TF-IDF turns text into weighted word counts. Data: a tiny hand-written corpus, so the point is the mechanics, not the accuracy.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

texts = ["great product, works perfectly", "terrible, broke after a day", "love it, excellent quality",
         "awful support and poor quality", "excellent value, would buy again", "poor fit, returned it"]
labels = [1, 0, 1, 0, 1, 0]
model = make_pipeline(TfidfVectorizer(), LogisticRegression()).fit(texts, labels)
print(model.predict(["excellent and works great", "poor quality, broke"]))
```

```text
[1 0]
```

### 50. Filter spam with naive Bayes

**Application: email and comment spam.** Multinomial naive Bayes is a classic, fast baseline for word counts. Data: tiny hand-written corpus.

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

msgs = ["win a free prize now", "claim your free reward", "meeting moved to 3pm", "lunch tomorrow?",
        "free entry win cash", "project update attached"]
spam = [1, 1, 0, 0, 1, 0]
model = make_pipeline(CountVectorizer(), MultinomialNB()).fit(msgs, spam)
print(model.predict(["free cash prize", "see the attached update"]))
print(model.predict_proba(["free cash prize"]).round(3))
```

```text
[1 0]
[[0.079 0.921]]
```

### 51. Capture phrases with n-grams

**Application: sentiment where "not good" matters.** Bigrams keep word pairs that single words lose.

```python
from sklearn.feature_extraction.text import CountVectorizer

vec = CountVectorizer(ngram_range=(1, 2))
vec.fit(["not good at all", "very good"])
print(vec.get_feature_names_out().tolist())
```

```text
['all', 'at', 'at all', 'good', 'good at', 'not', 'not good', 'very', 'very good']
```

### 52. Show the words that drive a text classifier

**Application: explaining a moderation model.** Linear text models are interpretable: the largest coefficients are the most indicative words. Data: tiny hand-written corpus.

```python
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

texts = ["refund my order now", "great service thanks", "order arrived broken refund",
         "thanks for the quick help", "broken item, want refund", "quick and great"]
y = [1, 0, 1, 0, 1, 0]
vec = TfidfVectorizer()
clf = LogisticRegression().fit(vec.fit_transform(texts), y)
words = vec.get_feature_names_out()
order = np.argsort(clf.coef_[0])
print("complaint words:", words[order[-3:]].tolist())
print("praise words:", words[order[:3]].tolist())
```

```text
complaint words: ['broken', 'order', 'refund']
praise words: ['great', 'quick', 'thanks']
```

### 53. Find near-duplicate documents with cosine similarity

**Application: deduplicating support tickets or listings.**

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

docs = ["reset my password please", "please reset my password", "invoice for march is wrong"]
sim = cosine_similarity(TfidfVectorizer().fit_transform(docs))
print(sim.round(2))
```

```text
[[1. 1. 0.]
 [1. 1. 0.]
 [0. 0. 1.]]
```

### 54. Discover topics with NMF

**Application: summarizing what customers write about.** Non-negative matrix factorization splits a TF-IDF matrix into topics. Data: tiny hand-written corpus.

```python
from sklearn.decomposition import NMF
from sklearn.feature_extraction.text import TfidfVectorizer

docs = ["battery life is short", "battery drains fast", "charger and battery issues",
        "screen is bright", "screen cracked easily", "great bright screen display"]
vec = TfidfVectorizer(stop_words="english")
X = vec.fit_transform(docs)
nmf = NMF(n_components=2, random_state=0).fit(X)
words = vec.get_feature_names_out()
for k, comp in enumerate(nmf.components_):
    print(k, [words[i] for i in comp.argsort()[-3:][::-1]])
```

```text
0 ['screen', 'bright', 'great']
1 ['battery', 'life', 'short']
```

### 55. Detect a text's language from character n-grams

**Application: routing messages to the right team.** Character n-grams capture spelling patterns, which identify languages well. Data: tiny hand-written corpus.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

texts = ["the cat is on the table", "where is the station", "le chat est sur la table",
         "où est la gare", "el gato está en la mesa", "dónde está la estación"]
lang = ["en", "en", "fr", "fr", "es", "es"]
model = make_pipeline(TfidfVectorizer(analyzer="char_wb", ngram_range=(1, 3)), LogisticRegression())
model.fit(texts, lang)
print(model.predict(["the table is here", "la mesa está aquí", "la table est ici"]))
```

```text
['en' 'es' 'fr']
```

### 56. Vectorize text streams with `HashingVectorizer`

**Application: high-volume logs where the vocabulary never stops growing.** Hashing needs no fitted vocabulary and uses fixed memory.

```python
from sklearn.feature_extraction.text import HashingVectorizer

vec = HashingVectorizer(n_features=2**10, alternate_sign=False)
X = vec.transform(["error disk full", "error network timeout"])
print(X.shape, X.nnz)
```

```text
(2, 1024) 6
```

### 57. Route support tickets to teams

**Application: help-desk triage.** A linear SVM on TF-IDF is a strong, fast baseline for short-text classification. Data: tiny hand-written corpus.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.svm import LinearSVC

tickets = ["cannot log in to my account", "password reset link expired", "charged twice this month",
           "need a refund for last invoice", "app crashes on startup", "page freezes when uploading"]
team = ["access", "access", "billing", "billing", "bugs", "bugs"]
model = make_pipeline(TfidfVectorizer(), LinearSVC()).fit(tickets, team)
print(model.predict(["refund my double charge", "login fails after password change", "crashes when I upload"]))
```

```text
['billing' 'access' 'bugs']
```

### 58. Compress text features with LSA

**Application: semantic search on a budget.** `TruncatedSVD` on TF-IDF (latent semantic analysis) maps documents into a small dense space where related words share dimensions.

```python
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

docs = ["car engine repair", "automobile engine service", "vehicle repair shop",
        "baking bread recipe", "sourdough bread baking", "cake recipe"]
X = TfidfVectorizer().fit_transform(docs)
Z = TruncatedSVD(n_components=2, random_state=0).fit_transform(X)
print(cosine_similarity(Z[[0]], Z).round(2) + 0.0)
```

```text
[[1. 1. 1. 0. 0. 0.]]
```

## Clustering and segmentation

### 59. Segment customers with k-means

**Application: marketing segments from spend and visit frequency.** Scale features first, then summarize each cluster in the original units. Data: synthetic customers.

```python
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
df = pd.DataFrame({
    "annual_spend": np.concatenate([rng.normal(300, 50, 100), rng.normal(1500, 200, 100), rng.normal(800, 100, 100)]),
    "visits_per_month": np.concatenate([rng.normal(1, 0.3, 100), rng.normal(4, 0.8, 100), rng.normal(8, 1, 100)]),
})
df["segment"] = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(StandardScaler().fit_transform(df))
print(df.groupby("segment").mean().round(1).sort_values("annual_spend"))
```

```text
         annual_spend  visits_per_month
segment                                
1               304.1               1.0
2               786.2               8.0
0              1489.9               4.0
```

### 60. Choose the number of clusters with the silhouette score

**Application: deciding how many segments the data supports.** Higher silhouette means tighter, better-separated clusters. Data: synthetic blobs with four true centers.

```python
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=600, centers=4, cluster_std=1.0, random_state=0)
for k in range(2, 7):
    labels = KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)
    print(k, round(silhouette_score(X, labels), 3))
```

```text
2 0.463
3 0.467
4 0.5
5 0.436
6 0.402
```

### 61. Find dense regions and noise with DBSCAN

**Application: grouping GPS points into places.** DBSCAN finds clusters of any shape and labels sparse points as noise (`-1`). Data: synthetic.

```python
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons

X, _ = make_moons(n_samples=300, noise=0.05, random_state=0)
X = np.vstack([X, [[3, 3], [-2, 2]]])
labels = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
print(sorted(set(labels.tolist())), "noise points:", int((labels == -1).sum()))
```

```text
[-1, 0, 1] noise points: 2
```

### 62. Cluster with varying density using HDBSCAN

**Application: event or location data where clusters differ in density.** HDBSCAN does not need a single `eps` value. Data: synthetic blobs of different spreads.

```python
import numpy as np
from sklearn.cluster import HDBSCAN
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=[200, 200, 200], centers=[[0, 0], [6, 6], [12, 0]],
                  cluster_std=[0.3, 1.0, 2.0], random_state=0)
labels = HDBSCAN(min_cluster_size=20, copy=True).fit_predict(X)
print(np.unique(labels, return_counts=True))
```

```text
(array([-1,  0,  1,  2]), array([ 22, 200, 179, 199]))
```

### 63. Get soft cluster memberships with a Gaussian mixture

**Application: customers who sit between two segments.** A Gaussian mixture gives each point a probability of belonging to each cluster. Data: synthetic.

```python
import numpy as np
from sklearn.mixture import GaussianMixture

rng = np.random.default_rng(0)
X = np.concatenate([rng.normal(0, 1, 300), rng.normal(5, 1, 300)]).reshape(-1, 1)
gm = GaussianMixture(n_components=2, random_state=0).fit(X)
print(np.sort(gm.means_.ravel()).round(2))
print(gm.predict_proba([[2.5]]).round(2))
```

```text
[-0.04  5.01]
[[0.4 0.6]]
```

### 64. Build a hierarchy of clusters

**Application: product taxonomies and organizational charts.** Agglomerative clustering merges the closest groups step by step. Data: Iris measurements without labels (real).

```python
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import load_iris
from sklearn.metrics import adjusted_rand_score

X, y = load_iris(return_X_y=True)
labels = AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(X)
print(round(adjusted_rand_score(y, labels), 3))
```

```text
0.731
```

### 65. Cluster large datasets with mini-batch k-means

**Application: millions of sessions or log lines.** `MiniBatchKMeans` updates centers from small random batches, trading a little quality for speed. Data: synthetic.

```python
from sklearn.cluster import KMeans, MiniBatchKMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=200_000, centers=5, random_state=0)
full = KMeans(n_clusters=5, n_init=3, random_state=0).fit(X)
mini = MiniBatchKMeans(n_clusters=5, batch_size=2_048, n_init=3, random_state=0).fit(X)
print(round(mini.inertia_ / full.inertia_, 4))
```

```text
1.0002
```

### 66. Compress image colors with k-means

**Application: reducing an image palette for printing or storage.** Each pixel is replaced by its nearest of k colors. Data: a synthetic 64×64 RGB image.

```python
import numpy as np
from sklearn.cluster import KMeans

rng = np.random.default_rng(0)
img = np.zeros((64, 64, 3))
img[:32] = [0.9, 0.2, 0.2]
img[32:] = [0.2, 0.3, 0.9]
img += rng.normal(0, 0.05, img.shape)
pixels = img.reshape(-1, 3)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(pixels)
compressed = km.cluster_centers_[km.labels_].reshape(img.shape)
print(len(np.unique(pixels.round(3), axis=0)), "->", len(np.unique(compressed, axis=0)), "colors")
print(km.cluster_centers_[np.argsort(km.cluster_centers_[:, 0])].round(2))
```

```text
4096 -> 2 colors
[[0.2 0.3 0.9]
 [0.9 0.2 0.2]]
```

### 67. Separate non-convex shapes with spectral clustering

**Application: grouping connected structures such as road segments.** k-means assumes round clusters; spectral clustering follows connectivity. Data: synthetic two moons.

```python
from sklearn.cluster import KMeans, SpectralClustering
from sklearn.datasets import make_moons
from sklearn.metrics import adjusted_rand_score

X, y = make_moons(n_samples=400, noise=0.05, random_state=0)
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit_predict(X)
sc = SpectralClustering(n_clusters=2, affinity="nearest_neighbors", n_neighbors=20, random_state=0).fit_predict(X)
print(round(adjusted_rand_score(y, km), 3), round(adjusted_rand_score(y, sc), 3))
```

```text
0.274 1.0
```

### 68. Profile clusters to make them actionable

**Application: turning segments into marketing personas.** Comparing each cluster's feature means with the overall mean explains what makes it different. Data: Wine (real), clustered without labels.

```python
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler

data = load_wine(as_frame=True)
X = data.data[["alcohol", "malic_acid", "color_intensity", "proline"]]
Z = pd.DataFrame(StandardScaler().fit_transform(X), columns=X.columns)
Z["cluster"] = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Z)
print(Z.groupby("cluster").mean().round(2))
```

```text
         alcohol  malic_acid  color_intensity  proline
cluster                                               
0          -0.88       -0.42            -0.78    -0.70
1           0.33        1.12             0.89    -0.29
2           0.95       -0.49             0.25     1.30
```

## Dimensionality reduction and model inspection

### 69. Keep 95% of the variance with PCA

**Application: compressing sensor or image features.** Passing a fraction as `n_components` keeps enough components to explain that share of variance. Data: Digits (real, 64 features).

```python
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

X, _ = load_digits(return_X_y=True)
pca = PCA(n_components=0.95).fit(X)
print(X.shape[1], "->", pca.n_components_)
```

```text
64 -> 29
```

### 70. Measure how much PCA compression loses

**Application: deciding a compression level.** Reconstruct the data from fewer components and compute the error. Data: Digits (real).

```python
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

X, _ = load_digits(return_X_y=True)
for k in [5, 20, 40]:
    pca = PCA(n_components=k).fit(X)
    err = np.mean((X - pca.inverse_transform(pca.transform(X))) ** 2)
    print(k, round(pca.explained_variance_ratio_.sum(), 3), round(err, 2))
```

```text
5 0.545 8.54
20 0.894 1.98
40 0.988 0.22
```

### 71. Visualize high-dimensional data with t-SNE

**Application: exploring embeddings.** t-SNE preserves local neighborhoods, so similar items land close together. Distances between far-apart clusters are not meaningful. Data: Digits (real).

```python
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score

X, y = load_digits(return_X_y=True)
emb = TSNE(n_components=2, random_state=0).fit_transform(X)
print(emb.shape)
print("kNN accuracy in 2-D:", round(cross_val_score(KNeighborsClassifier(), emb, y, cv=5).mean(), 3))
```

```text
(1797, 2)
kNN accuracy in 2-D: 0.976
```

### 72. Rank features with permutation importance

**Application: explaining which inputs a deployed model relies on.** Shuffle one feature at a time on held-out data and measure how much the score drops. Data: Diabetes (real).

```python
import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split

data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, random_state=0)
rf = RandomForestRegressor(random_state=0).fit(X_train, y_train)
r = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=0)
print(pd.Series(r.importances_mean, index=data.feature_names).sort_values(ascending=False).head(4).round(3))
```

```text
bmi    0.114
s5     0.094
bp     0.043
age    0.018
dtype: float64
```

### 73. Show a feature's effect with partial dependence

**Application: explaining how a risk factor moves predictions.** Partial dependence averages the model's prediction while varying one feature. Data: Diabetes (real); `bmi` is standardized in this dataset.

```python
from sklearn.datasets import load_diabetes
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.inspection import partial_dependence

data = load_diabetes()
model = HistGradientBoostingRegressor(random_state=0).fit(data.data, data.target)
pd_result = partial_dependence(model, data.data, features=[2], grid_resolution=5)
print(pd_result["grid_values"][0].round(3))
print(pd_result["average"][0].round(1))
```

```text
[-0.067 -0.029  0.01   0.048  0.087]
[-30.4 -20.6  20.5  25.2  62.9]
```

### 74. Select the best features with univariate tests

**Application: screening hundreds of candidate signals.** `SelectKBest` keeps the features with the strongest individual relationship to the target. Data: synthetic with 5 informative out of 50.

```python
from sklearn.datasets import make_classification
from sklearn.feature_selection import SelectKBest, mutual_info_classif

X, y = make_classification(n_samples=1_000, n_features=50, n_informative=5, n_redundant=0,
                           shuffle=False, random_state=0)
selector = SelectKBest(mutual_info_classif, k=5).fit(X, y)
print(sorted(selector.get_support(indices=True).tolist()))
```

```text
[0, 1, 2, 3, 4]
```

### 75. Eliminate features recursively

**Application: building a cheaper model with fewer inputs.** Recursive feature elimination (RFE) drops the weakest feature repeatedly until the requested number remain. `RFECV` can choose the number by cross-validation, but when extra features barely change the score it tends to keep some of them. Data: synthetic, where only the first 4 of 15 features matter.

```python
from sklearn.datasets import make_regression
from sklearn.feature_selection import RFE
from sklearn.linear_model import LinearRegression

X, y = make_regression(n_samples=500, n_features=15, n_informative=4, noise=10, shuffle=False, random_state=0)
rfe = RFE(LinearRegression(), n_features_to_select=4).fit(X, y)
print(rfe.get_support(indices=True).tolist())
print(rfe.ranking_.tolist())
```

```text
[0, 1, 2, 3]
[1, 1, 1, 1, 4, 2, 9, 8, 5, 3, 10, 11, 7, 12, 6]
```

## Anomaly detection

### 76. Flag unusual transactions with Isolation Forest

**Application: fraud and abuse detection without labels.** Isolation Forest isolates points with random splits; outliers isolate quickly. Data: synthetic transactions with injected anomalies.

```python
import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(0)
normal = rng.normal([50, 2], [15, 1], size=(1_000, 2))
fraud = rng.normal([400, 20], [50, 3], size=(10, 2))
X = np.vstack([normal, fraud])
flags = IsolationForest(contamination=0.01, random_state=0).fit_predict(X)
print("flagged:", int((flags == -1).sum()), "| injected anomalies caught:", int((flags[-10:] == -1).sum()))
```

```text
flagged: 11 | injected anomalies caught: 10
```

### 77. Detect local outliers with LOF

**Application: points that are normal globally but odd in their neighborhood.** Local Outlier Factor compares each point's density to its neighbors'. Data: synthetic.

```python
import numpy as np
from sklearn.neighbors import LocalOutlierFactor

rng = np.random.default_rng(0)
X = np.vstack([rng.normal(0, 0.3, (100, 2)), rng.normal(5, 2, (100, 2)), [[1.2, 1.2]]])
labels = LocalOutlierFactor(n_neighbors=20).fit_predict(X)
print("last point flagged:", labels[-1] == -1, "| total flagged:", int((labels == -1).sum()))
```

```text
last point flagged: True | total flagged: 14
```

### 78. Learn "normal" with a one-class SVM

**Application: machine monitoring when only healthy data is available.** Train on normal readings, then flag anything outside the learned region. Data: synthetic.

```python
import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import OneClassSVM

rng = np.random.default_rng(0)
healthy = rng.normal([70, 1.0], [2, 0.1], size=(500, 2))
model = make_pipeline(StandardScaler(), OneClassSVM(nu=0.02, gamma="scale")).fit(healthy)
print(model.predict([[70.5, 1.02], [85, 1.6]]))
```

```text
[ 1 -1]
```

### 79. Use a robust covariance for multivariate outliers

**Application: catching sensor combinations that are unusual together.** A temperature and pressure can each be normal, but not together. Data: synthetic correlated readings.

```python
import numpy as np
from sklearn.covariance import EllipticEnvelope

rng = np.random.default_rng(0)
t = rng.normal(20, 3, 500)
p = 2 * t + rng.normal(0, 1, 500)
X = np.column_stack([t, p])
env = EllipticEnvelope(contamination=0.01, random_state=0).fit(X)
print(env.predict([[20, 40], [20, 52]]))
```

```text
[ 1 -1]
```

### 80. Start with a robust z-score baseline

**Application: simple alerting on a single metric.** The median and median absolute deviation are not dragged by the outliers you want to find. Data: synthetic.

```python
import numpy as np

rng = np.random.default_rng(0)
latency = rng.normal(120, 10, 1_000)
latency[[100, 500]] = [400, 380]
median = np.median(latency)
mad = np.median(np.abs(latency - median))
robust_z = 0.6745 * (latency - median) / mad
print(np.where(np.abs(robust_z) > 6)[0])
```

```text
[100 500]
```

## Time series and forecasting

### 81. Build lag features for supervised forecasting

**Application: next-day demand.** Previous values become input columns, turning forecasting into regression. Data: synthetic daily series.

```python
import numpy as np
import pandas as pd

idx = pd.date_range("2026-01-01", periods=8, freq="D")
s = pd.Series(np.arange(10, 18), index=idx, name="demand")
frame = pd.DataFrame({"demand": s, "lag_1": s.shift(1), "lag_7": s.shift(7)}).dropna()
print(frame)
```

```text
            demand  lag_1  lag_7
2026-01-08      17   16.0   10.0
```

### 82. Validate forecasts with `TimeSeriesSplit`

**Application: any model that predicts the future.** Each fold trains on the past and tests on the period right after it. Shuffled cross-validation would leak the future.

```python
import numpy as np
from sklearn.model_selection import TimeSeriesSplit

for train, test in TimeSeriesSplit(n_splits=3, test_size=2).split(np.arange(10)):
    print(train.tolist(), test.tolist())
```

```text
[0, 1, 2, 3] [4, 5]
[0, 1, 2, 3, 4, 5] [6, 7]
[0, 1, 2, 3, 4, 5, 6, 7] [8, 9]
```

### 83. Forecast demand: trees versus a trend model

**Application: staffing and inventory planning.** Tree models such as gradient boosting cannot predict values outside the range they saw in training, so they struggle with a series that keeps trending upward. A linear model with a time index and a weekend flag extrapolates the trend. Always compare against the seasonal naive forecast (same day last week). Data: synthetic two-year daily series with a trend, a weekend effect and noise.

```python
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error

rng = np.random.default_rng(0)
idx = pd.date_range("2024-01-01", "2025-12-31", freq="D")
y = pd.Series(200 + 0.1 * np.arange(len(idx)) + np.where(idx.dayofweek >= 5, 40, 0)
              + rng.normal(0, 8, len(idx)), index=idx)
df = pd.DataFrame({"y": y, "t": np.arange(len(idx)), "dow": idx.dayofweek,
                   "weekend": (idx.dayofweek >= 5).astype(int)})
for k in [7, 14, 21, 28]:
    df[f"lag_{k}"] = y.shift(k)
df = df.dropna()
train, test = df[df.index < "2025-10-01"], df[df.index >= "2025-10-01"]

tree_cols = ["dow", "lag_7", "lag_14", "lag_21", "lag_28"]
tree = HistGradientBoostingRegressor(random_state=0).fit(train[tree_cols], train["y"])
trend = Ridge().fit(train[["t", "weekend"]], train["y"])
print("seasonal naive MAE:", round(mean_absolute_error(test["y"], test["lag_7"]), 2))
print("boosting on lags MAE:", round(mean_absolute_error(test["y"], tree.predict(test[tree_cols])), 2))
print("trend + weekend MAE:", round(mean_absolute_error(test["y"], trend.predict(test[["t", "weekend"]])), 2))
```

```text
seasonal naive MAE: 8.23
boosting on lags MAE: 7.73
trend + weekend MAE: 6.12
```

The noise in this series has a standard deviation of 8, so no model can get an MAE much below about 6.4. On real data the trend is rarely this clean, which is why checking several model families against a naive baseline matters.

### 84. Encode cyclical time with sine and cosine

**Application: hour-of-day or month effects.** Encoding hour 23 and hour 0 as numbers 23 and 0 puts them far apart; sine/cosine puts them next to each other.

```python
import numpy as np

hours = np.array([0, 6, 12, 23])
enc = np.column_stack([np.sin(2 * np.pi * hours / 24), np.cos(2 * np.pi * hours / 24)])
print(enc.round(3))
print("distance 23h->0h:", round(np.linalg.norm(enc[3] - enc[0]), 3), "| 0h->12h:", round(np.linalg.norm(enc[2] - enc[0]), 3))
```

```text
[[ 0.     1.   ]
 [ 1.     0.   ]
 [ 0.    -1.   ]
 [-0.259  0.966]]
distance 23h->0h: 0.261 | 0h->12h: 2.0
```

### 85. Add rolling statistics without leaking the future

**Application: features such as "average sales over the last week".** Shift before rolling so each row only sees the past.

```python
import pandas as pd

s = pd.Series([10, 12, 14, 13, 15, 18])
print(pd.DataFrame({
    "y": s,
    "leaky_mean_3": s.rolling(3).mean(),
    "safe_mean_3": s.shift(1).rolling(3).mean(),
}))
```

```text
    y  leaky_mean_3  safe_mean_3
0  10           NaN          NaN
1  12           NaN          NaN
2  14     12.000000          NaN
3  13     13.000000         12.0
4  15     14.000000         13.0
5  18     15.333333         14.0
```

### 86. Beat the naive forecast before celebrating

**Application: model governance.** A seasonal naive forecast (same day last week) is a strong baseline for weekly patterns. Report your model's error relative to it. Data: synthetic.

```python
import numpy as np

rng = np.random.default_rng(1)
t = np.arange(140)
y = 100 + 20 * (t % 7 >= 5) + rng.normal(0, 5, t.size)
test = slice(126, 140)
naive = y[119:133]
mean_forecast = np.full(14, y[:126].mean())
mae = lambda a, b: np.mean(np.abs(a - b))
print("seasonal naive:", round(mae(y[test], naive), 2), "| overall mean:", round(mae(y[test], mean_forecast), 2))
```

```text
seasonal naive: 4.79 | overall mean: 9.26
```

### 87. Detect change points with a rolling z-score

**Application: spotting when a KPI shifts level.** Compare each value with the trailing mean and standard deviation. Data: synthetic series with a level shift at index 60.

```python
import numpy as np
import pandas as pd

rng = np.random.default_rng(0)
s = pd.Series(np.concatenate([rng.normal(100, 3, 60), rng.normal(120, 3, 40)]))
mean = s.shift(1).rolling(20).mean()
std = s.shift(1).rolling(20).std()
z = (s - mean) / std
print(z[z.abs() > 4].index[:3].tolist())
```

```text
[60]
```

## Recommendations and similarity search

### 88. Recommend popular items as a baseline

**Application: home pages for new users with no history.** Data: a synthetic interaction log.

```python
import pandas as pd

log = pd.DataFrame({"user": [1, 1, 2, 2, 3, 3, 3, 4], "item": ["a", "b", "a", "c", "a", "b", "d", "b"]})
print(log["item"].value_counts().head(3))
```

```text
item
a    3
b    3
c    1
Name: count, dtype: int64
```

### 89. Recommend similar items with item-item cosine similarity

**Application: "customers who bought this also bought".** Data: a synthetic user-item matrix.

```python
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.DataFrame(
    [[5, 4, 0, 0], [4, 5, 0, 1], [0, 0, 5, 4], [1, 0, 4, 5]],
    index=["u1", "u2", "u3", "u4"], columns=["laptop", "mouse", "tent", "stove"],
)
sim = pd.DataFrame(cosine_similarity(ratings.T), index=ratings.columns, columns=ratings.columns)
print(sim.round(2))
print(sim["laptop"].drop("laptop").idxmax())
```

```text
        laptop  mouse  tent  stove
laptop    1.00   0.96  0.10   0.21
mouse     0.96   1.00  0.00   0.12
tent      0.10   0.00  1.00   0.96
stove     0.21   0.12  0.96   1.00
mouse
```

### 90. Find similar products with `NearestNeighbors`

**Application: "more like this" from product attributes.** Data: synthetic product features.

```python
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

names = ["budget phone", "flagship phone", "mid phone", "tablet", "e-reader"]
features = np.array([[150, 6.1, 64], [1100, 6.7, 512], [450, 6.4, 128], [600, 11.0, 256], [130, 6.8, 16]])
Z = StandardScaler().fit_transform(features)
nn = NearestNeighbors(n_neighbors=2).fit(Z)
_, idx = nn.kneighbors(Z[[2]])
print(names[2], "->", names[idx[0][1]])
```

```text
mid phone -> budget phone
```

### 91. Fill in missing ratings with matrix factorization

**Application: predicting how a user would rate an unseen item.** A low-rank factorization captures shared taste. This toy version treats unknown ratings as zeros, which a production system would not do. Data: synthetic ratings.

```python
import numpy as np
from sklearn.decomposition import TruncatedSVD

R = np.array([[5, 4, 0, 1], [4, 5, 1, 0], [1, 0, 5, 4], [0, 1, 4, 5], [5, 5, 0, 0]], dtype=float)
svd = TruncatedSVD(n_components=2, random_state=0)
approx = svd.inverse_transform(svd.fit_transform(R))
print(approx.round(1))
```

```text
[[4.5 4.5 0.5 0.5]
 [4.5 4.5 0.5 0.5]
 [0.5 0.5 4.5 4.5]
 [0.5 0.5 4.5 4.5]
 [5.  5.  0.  0. ]]
```

### 92. Recommend articles by content

**Application: "related reading" for a blog or knowledge base.** TF-IDF similarity between texts needs no user history. Data: short hand-written titles.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

titles = ["intro to pandas dataframes", "pandas groupby explained", "numpy broadcasting rules",
          "training a random forest", "random forest feature importance"]
sim = cosine_similarity(TfidfVectorizer().fit_transform(titles))
for i in [1, 3]:
    best = sim[i].argsort()[-2]
    print(titles[i], "->", titles[best])
```

```text
pandas groupby explained -> intro to pandas dataframes
training a random forest -> random forest feature importance
```

## Neural networks, streaming and production

### 93. Train a small neural network

**Application: nonlinear patterns in moderately sized tabular or image data.** `MLPClassifier` is a fully connected network; scale inputs first. Data: Digits (real).

```python
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
mlp = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(64,), max_iter=500, random_state=0))
print(round(mlp.fit(X_train, y_train).score(X_test, y_test), 4))
```

```text
0.9733
```

### 94. Regress with a neural network and early stopping

**Application: smooth nonlinear functions such as energy use versus temperature.** Data: synthetic.

```python
import numpy as np
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(0)
temp = rng.uniform(-10, 35, (2_000, 1))
energy = 0.08 * (temp.ravel() - 18) ** 2 + rng.normal(0, 1, 2_000)
model = make_pipeline(StandardScaler(), MLPRegressor(hidden_layer_sizes=(32, 32), early_stopping=True,
                                                     max_iter=2_000, random_state=0)).fit(temp, energy)
print(round(model.score(temp, energy), 3), model.predict([[-5], [18], [30]]).round(1))
```

```text
0.994 [43.1  0.  12. ]
```

### 95. Learn from streaming data with `partial_fit`

**Application: models updated hourly from new events.** `SGDClassifier.partial_fit` updates the model batch by batch without storing all data. Data: synthetic stream.

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import SGDClassifier

X, y = make_classification(n_samples=50_000, random_state=0)
X_test, y_test = X[-5_000:], y[-5_000:]
clf = SGDClassifier(loss="log_loss", random_state=0)
for i, start in enumerate(range(0, 45_000, 15_000)):
    clf.partial_fit(X[start:start + 15_000], y[start:start + 15_000], classes=np.array([0, 1]))
    print("after batch", i + 1, round(clf.score(X_test, y_test), 3))
```

```text
after batch 1 0.786
after batch 2 0.82
after batch 3 0.84
```

### 96. Keep DataFrame column names through a pipeline

**Application: debugging and explaining production pipelines.** `set_output(transform="pandas")` makes transformers return DataFrames with readable column names.

```python
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.DataFrame({"size": [1.0, 2.0, 3.0], "color": ["red", "blue", "red"]})
ct = ColumnTransformer([("num", StandardScaler(), ["size"]),
                        ("cat", OneHotEncoder(sparse_output=False), ["color"])])
ct.set_output(transform="pandas")
print(ct.fit_transform(df).round(3))
```

```text
   num__size  cat__color_blue  cat__color_red
0     -1.225              0.0             1.0
1      0.000              1.0             0.0
2      1.225              0.0             1.0
```

### 97. Check model performance across groups

**Application: fairness and reliability reviews.** An overall score can hide much worse performance for one group. Data: synthetic, with a group whose labels are noisier.

```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import recall_score

rng = np.random.default_rng(0)
n = 4_000
group = rng.choice(["A", "B"], n, p=[0.8, 0.2])
x = rng.normal(size=(n, 3))
y = (x[:, 0] + x[:, 1] + rng.normal(0, np.where(group == "B", 2.0, 0.5)) > 0).astype(int)
pred = LogisticRegression().fit(x, y).predict(x)
print("overall recall", round(recall_score(y, pred), 3))
print(pd.Series({g: round(recall_score(y[group == g], pred[group == g]), 3) for g in ["A", "B"]}))
```

```text
overall recall 0.86
A    0.897
B    0.697
dtype: float64
```

### 98. Detect data drift with a two-sample test

**Application: knowing when to retrain.** The Kolmogorov–Smirnov test compares a feature's training distribution with recent production data. With large samples even tiny shifts become "significant", so look at the size of the shift too. Data: synthetic.

```python
import numpy as np
from scipy.stats import ks_2samp

rng = np.random.default_rng(0)
train = rng.normal(50, 10, 5_000)
same = rng.normal(50, 10, 5_000)
shifted = rng.normal(55, 10, 5_000)
for name, prod in [("same", same), ("shifted", shifted)]:
    res = ks_2samp(train, prod)
    print(name, round(res.statistic, 3), f"{res.pvalue:.2g}")
```

```text
same 0.026 0.075
shifted 0.205 5.8e-92
```

### 99. Score new data in batches

**Application: nightly batch scoring of millions of rows.** Predicting chunk by chunk keeps memory flat, and the results match predicting all at once. Data: Breast Cancer Wisconsin (real).

```python
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X, y)
batches = [model.predict_proba(chunk)[:, 1] for chunk in np.array_split(X, 5)]
print(np.allclose(np.concatenate(batches), model.predict_proba(X)[:, 1]))
```

```text
True
```

### 100. Wrap a model in a prediction function with input checks

**Application: a small prediction service.** Validate the columns before predicting, return probabilities with the model version, and fail loudly on bad input. Data: Iris (real).

```python
import pandas as pd
import sklearn
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

data = load_iris(as_frame=True)
model = LogisticRegression(max_iter=1000).fit(data.data, data.target)
FEATURES = list(data.feature_names)

def predict(records):
    df = pd.DataFrame(records)
    missing = set(FEATURES) - set(df.columns)
    if missing:
        raise ValueError(f"missing features: {sorted(missing)}")
    proba = model.predict_proba(df[FEATURES])
    return [{"species": str(data.target_names[p.argmax()]), "confidence": round(float(p.max()), 3),
             "sklearn": sklearn.__version__} for p in proba]

print(predict([dict(zip(FEATURES, [5.1, 3.5, 1.4, 0.2]))]))
try:
    predict([{"sepal length (cm)": 5.1}])
except ValueError as err:
    print("ValueError:", err)
```

```text
[{'species': 'setosa', 'confidence': 0.982, 'sklearn': '1.9.0'}]
ValueError: missing features: ['petal length (cm)', 'petal width (cm)', 'sepal width (cm)']
```

## Common mistakes to avoid

- **Fitting preprocessing on all the data before splitting.** Put scalers, imputers and feature selection inside a `Pipeline` (examples 3 and 7).
- **Reporting accuracy on imbalanced data.** Use recall, precision, average precision or a cost-based metric (examples 16, 17 and 32).
- **Skipping the baseline.** Compare with `DummyClassifier`, `DummyRegressor` or a seasonal naive forecast (examples 2, 34 and 86).
- **Shuffling time series.** Use `TimeSeriesSplit` and lag features computed from the past only (examples 82 and 85).
- **Treating the best grid-search score as the final estimate.** Use nested cross-validation or a held-out test set (example 10).
- **Trusting impurity-based feature importance alone.** Check permutation importance on held-out data (example 72).
- **Loading pickled models from untrusted sources** or across library versions (example 12).

## Where to go next

- Practice the full workflow on bigger problems with [101 Python data science projects for beginners to advanced](/articles/python-data-science-projects).
- Prepare data faster with [100 pandas tips and tricks for data analysis](/articles/pandas-tips-and-tricks-for-data-analysis).
- Understand the arrays underneath with [101 NumPy examples to master numerical computing](/articles/numpy-examples-for-numerical-computing).
- Learn the math behind PCA, SVD and gradients in [101 linear algebra concepts for machine learning and AI](/articles/linear-algebra-concepts-for-machine-learning).
- Choose the right tools with [100 Python libraries for data science](/articles/python-libraries-for-data-science).
- Understand how each model works, and when to choose it, in [100 machine learning algorithms explained](/articles/machine-learning-algorithms-explained).
- Build better inputs with [101 feature engineering techniques](/articles/feature-engineering-techniques).

## References

1. Pedregosa, F., Varoquaux, G., Gramfort, A., et al. (2011). "Scikit-learn: Machine Learning in Python." *Journal of Machine Learning Research*, 12, 2825–2830. [jmlr.org](https://jmlr.org/papers/v12/pedregosa11a.html)
2. scikit-learn developers. "Release Highlights for scikit-learn 1.9." [scikit-learn.org](https://scikit-learn.org/stable/auto_examples/release_highlights/plot_release_highlights_1_9_0.html)
3. scikit-learn developers. "Common pitfalls and recommended practices." [scikit-learn.org](https://scikit-learn.org/stable/common_pitfalls.html)
4. scikit-learn developers. "Toy datasets." [scikit-learn.org](https://scikit-learn.org/stable/datasets/toy_dataset.html)
5. scikit-learn developers. "Model persistence." [scikit-learn.org](https://scikit-learn.org/stable/model_persistence.html)
6. scikit-learn developers. "Tuning the decision threshold for class prediction." [scikit-learn.org](https://scikit-learn.org/stable/modules/classification_threshold.html)
7. scikit-learn developers. "Permutation feature importance." [scikit-learn.org](https://scikit-learn.org/stable/modules/permutation_importance.html)
8. Wolberg, W., Mangasarian, O., Street, N., & Street, W. (1993). "Breast Cancer Wisconsin (Diagnostic)." UCI Machine Learning Repository. [doi.org/10.24432/C5DW2B](https://doi.org/10.24432/C5DW2B)
9. Efron, B., Hastie, T., Johnstone, I., & Tibshirani, R. (2004). "Least Angle Regression." *Annals of Statistics*, 32(2), 407–499 (source of the Diabetes dataset). [doi.org/10.1214/009053604000000067](https://doi.org/10.1214/009053604000000067)
10. Hyndman, R. J., & Athanasopoulos, G. (2021). *Forecasting: Principles and Practice*, 3rd edition. OTexts. [otexts.com/fpp3](https://otexts.com/fpp3/)
11. Liu, F. T., Ting, K. M., & Zhou, Z.-H. (2008). "Isolation Forest." *2008 Eighth IEEE International Conference on Data Mining*, 413–422. [doi.org/10.1109/ICDM.2008.17](https://doi.org/10.1109/ICDM.2008.17)
