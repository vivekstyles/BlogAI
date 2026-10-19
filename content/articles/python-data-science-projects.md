---
title: 101 Best Python Data Science Projects for Beginners to Advanced
seoTitle: 101 Python Data Science Projects, Beginner to Advanced
description: 101 Python data science project ideas from beginner to advanced, each with a public dataset, the skills it builds and a stretch goal for your portfolio.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Engineering
tags:
  - python
  - data science
  - projects
  - machine learning
  - portfolio
  - pandas
tocDepth: 2
---

The best data science project is one that answers a real question with real data and ends with a clear write-up, not one that copies a tutorial. This list gives you 101 project ideas in three levels. Each project names a **public dataset** you can download today, the **skills** it builds, the **steps** to get started and a **stretch goal** that turns a practice exercise into something worth showing.

**How to use this list.** Beginners should start with projects 1–35, which focus on loading, cleaning, exploring and visualizing data, plus simple models. Projects 36–70 add proper machine learning workflows, text, time series and APIs. Projects 71–101 involve deep learning, large or messy data, causal questions and deployment. You do not need to do them in order; pick a topic you care about, because curiosity is what carries a project through the messy middle. Classic teaching datasets such as Titanic, Iris and Digits appear in a few beginner projects because they are good for learning the mechanics; for a portfolio, lead with projects on messier, less familiar data.

**About the datasets.** Every dataset linked below was publicly listed by its provider at the time of writing (October 2026). Some require a free account (Kaggle) or agreeing to terms of use, and a few contain personal or sensitive data that you must handle responsibly. Always read the license before publishing results or derived data.

## What makes a project portfolio-ready

Portfolio advice from hiring managers and career writers repeats a few themes: finish fewer projects well rather than starting many, go beyond the classic tutorial datasets, show the data cleaning and not only the modeling, and explain the result in plain language ([KDnuggets](https://www.kdnuggets.com/2021/10/data-science-portfolio-project-ideas.html); [Careery](https://careery.pro/blog/data-science-careers/data-science-portfolio-projects)). Treat these as experienced advice rather than measured facts. A practical checklist:

- **A question, not a technique.** "Which neighborhoods lose the most bike-share trips to rain?" beats "a random forest on bike data".
- **A baseline.** Show what a simple rule or average achieves before your model.
- **Honest evaluation.** Use a held-out test set, a metric that matches the goal, and time-based splits for time data.
- **A clean repository.** A README with the question, data source, approach, results and how to run it; a `requirements.txt`; notebooks that run top to bottom.
- **A short write-up or demo.** A blog post, a Streamlit app or a five-slide summary. Most reviewers read that, not your code.
- **Limitations.** Say what the data cannot tell you.

A minimal project skeleton you can adapt to most tabular projects below (it uses a dataset bundled with scikit-learn, so it runs offline):

```python
from sklearn.datasets import load_breast_cancer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_breast_cancer(return_X_y=True, as_frame=True)
print(X.shape, "| positive share:", round(y.mean(), 3))

candidates = {
    "baseline": DummyClassifier(strategy="most_frequent"),
    "logistic": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    "forest": RandomForestClassifier(random_state=0),
}
for name, model in candidates.items():
    scores = cross_val_score(model, X, y, cv=5, scoring="roc_auc")
    print(f"{name:9s} ROC AUC {scores.mean():.3f} ± {scores.std():.3f}")
```

```text
(569, 30) | positive share: 0.627
baseline  ROC AUC 0.500 ± 0.000
logistic  ROC AUC 0.995 ± 0.004
forest    ROC AUC 0.991 ± 0.008
```

That was run with scikit-learn 1.9.0. The baseline's ROC AUC of 0.5 is what random ranking gives, which is the point of including it.

## Beginner projects (1–35)

These projects need Python, pandas, Matplotlib or seaborn, and a little scikit-learn. Helpful references: [100 pandas tips and tricks](/articles/pandas-tips-and-tricks-for-data-analysis) and [100 probability and statistics examples](/articles/probability-statistics-real-world-examples).

### 1. Titanic survival analysis

- **Goal:** explain which passenger groups were more likely to survive, then predict survival.
- **Data:** [Kaggle Titanic competition](https://www.kaggle.com/c/titanic).
- **Skills:** missing values, group comparisons, logistic regression.
- **Steps:** compare survival by sex, class and age group with `groupby`; impute age; fit a logistic regression.
- **Stretch:** it is a famous tutorial dataset, so make it yours: write up how much "women and children first" held across classes, with confidence intervals.

### 2. Palmer penguins species explorer

- **Goal:** show how three penguin species differ in body measurements.
- **Data:** [palmerpenguins](https://allisonhorst.github.io/palmerpenguins/) (also loadable with `seaborn.load_dataset("penguins")`).
- **Skills:** pair plots, summary tables, simple classification.
- **Stretch:** build a k-nearest neighbors classifier and show which two measurements separate species best.

### 3. Wine quality drivers

- **Goal:** find which chemical properties are associated with higher quality ratings.
- **Data:** [UCI Wine Quality](https://archive.ics.uci.edu/dataset/186/wine+quality).
- **Skills:** correlation, distributions, regression versus classification framing.
- **Stretch:** compare treating quality as a number (regression) versus "good or not" (classification) and discuss which is more useful to a winemaker.

### 4. Student performance factors

- **Goal:** explore how study time, absences and family background relate to final grades.
- **Data:** [UCI Student Performance](https://archive.ics.uci.edu/dataset/320/student+performance).
- **Skills:** categorical encoding, box plots, linear regression.
- **Stretch:** predict final grades with and without earlier-term grades and explain why that choice changes the story.

### 5. Global life expectancy trends

- **Goal:** chart how life expectancy changed by country and region since 1960.
- **Data:** [World Bank Open Data](https://data.worldbank.org/indicator/SP.DYN.LE00.IN).
- **Skills:** reshaping wide data with `melt`, line charts, joining country metadata.
- **Stretch:** recreate a Gapminder-style bubble chart of income versus life expectancy with Plotly.

### 6. CO2 emissions dashboard

- **Goal:** compare emissions totals, per-capita values and trends across countries.
- **Data:** [Our World in Data CO2 dataset](https://github.com/owid/co2-data).
- **Skills:** filtering, per-capita normalization, interactive charts.
- **Stretch:** a Streamlit app where users pick countries and metrics.

### 7. Personal spending analyzer

- **Goal:** categorize and summarize your own bank or card transactions.
- **Data:** a CSV export of your own transactions (keep it private and out of public repositories).
- **Skills:** string cleaning, rule-based categorization, monthly resampling.
- **Stretch:** flag unusual months with a simple z-score and visualize spending by category.

### 8. Weather of your city

- **Goal:** describe temperature and rainfall patterns for your city over several decades.
- **Data:** [Open-Meteo historical weather API](https://open-meteo.com/en/docs/historical-weather-api) or [NOAA Climate Data Online](https://www.ncei.noaa.gov/cdo-web/).
- **Skills:** API requests, date handling, rolling averages.
- **Stretch:** test whether the last decade's average temperature differs from an earlier one, and state the limits of that comparison.

### 9. Bike-sharing demand patterns

- **Goal:** show how bike rentals vary by hour, weekday, season and weather.
- **Data:** [UCI Bike Sharing](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset).
- **Skills:** time features, heatmaps, regression.
- **Stretch:** predict hourly demand and compare with a "same hour last week" baseline.

### 10. Netflix-style catalog exploration

- **Goal:** describe what kinds of films are in a large movie catalog and how ratings vary.
- **Data:** [MovieLens](https://grouplens.org/datasets/movielens/) (start with the small "latest-small" version).
- **Skills:** joins, exploding genre lists, rating distributions.
- **Stretch:** show how the most-rated movies differ from the highest-rated ones and why minimum rating counts matter.

### 11. Restaurant tipping analysis

- **Goal:** test how tips relate to bill size, party size and day.
- **Data:** the `tips` dataset (`seaborn.load_dataset("tips")`).
- **Skills:** scatter plots, regression lines, grouped statistics.
- **Stretch:** compute tip percentage and check whether conclusions change compared with raw tip amounts.

### 12. Stack Overflow developer survey

- **Goal:** explore which languages, tools and work patterns developers report.
- **Data:** [Stack Overflow Developer Survey](https://survey.stackoverflow.co/).
- **Skills:** multi-select answers (`str.split` and `explode`), weighting, survey bias.
- **Stretch:** compare two survey years and discuss how changes in who responds could explain part of the difference.

### 13. Air quality explorer

- **Goal:** compare pollution levels across cities and times of day.
- **Data:** [OpenAQ](https://openaq.org/) or [UCI Air Quality](https://archive.ics.uci.edu/dataset/360/air+quality).
- **Skills:** handling sensor gaps, resampling, daily cycles.
- **Stretch:** map stations and highlight days above the World Health Organization guideline values.

### 14. Heart disease risk factors

- **Goal:** explore how clinical measurements relate to a heart disease diagnosis.
- **Data:** [UCI Heart Disease](https://archive.ics.uci.edu/dataset/45/heart+disease).
- **Skills:** classification metrics, recall versus precision, logistic regression.
- **Stretch:** discuss why a model on a few hundred patients from four hospitals should not be used for real diagnosis.

### 15. Earthquake activity map

- **Goal:** map recent earthquakes and summarize them by magnitude and region.
- **Data:** [USGS earthquake feeds](https://earthquake.usgs.gov/earthquakes/feed/).
- **Skills:** JSON parsing, maps with Folium, histograms of magnitudes.
- **Stretch:** check whether magnitudes follow the Gutenberg–Richter pattern by plotting log counts against magnitude.

### 16. Diabetes progression regression

- **Goal:** predict disease progression from patient measurements.
- **Data:** the Diabetes dataset bundled with scikit-learn (`load_diabetes`).
- **Skills:** linear regression, ridge and lasso, coefficients.
- **Stretch:** compare coefficients across regularization strengths and explain which features stay important.

### 17. Handwritten digit classifier

- **Goal:** classify 8×8 images of digits.
- **Data:** scikit-learn's `load_digits`.
- **Skills:** image arrays, k-nearest neighbors, confusion matrices.
- **Stretch:** show the most-confused digit pairs with example images.

### 18. Customer survey sentiment summary

- **Goal:** summarize free-text answers into themes and sentiment.
- **Data:** reviews from the [Amazon Reviews 2023 dataset](https://amazon-reviews-2023.github.io/) (pick one small category).
- **Skills:** text cleaning, word counts, simple sentiment classification.
- **Stretch:** compare star ratings with the sentiment your model predicts and read the disagreements.

### 19. Olympic-style medal table analysis

- **Goal:** compare countries' sporting results relative to population and GDP.
- **Data:** combine a medals table of your choice with [World Bank population and GDP data](https://data.worldbank.org/).
- **Skills:** joining on country names (watch for mismatches), per-capita metrics.
- **Stretch:** build a regression of medals on population and GDP and list the biggest over- and under-performers.

### 20. Spam SMS detector

- **Goal:** classify text messages as spam or not.
- **Data:** [UCI SMS Spam Collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection).
- **Skills:** bag of words, naive Bayes, precision on the spam class.
- **Stretch:** inspect false positives and decide which error is worse for users.

### 21. Housing prices exploratory analysis

- **Goal:** find what drives house prices in one city.
- **Data:** [Kaggle House Prices](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) (the Ames, Iowa data described by [De Cock, 2011](https://doi.org/10.1080/10691898.2011.11889627)).
- **Skills:** skewed targets (log prices), outliers, feature engineering.
- **Stretch:** compare a linear model on log prices with a gradient-boosting model and explain the trade-off.

### 22. Census income patterns

- **Goal:** explore how education, occupation and hours worked relate to income above \$50K.
- **Data:** [UCI Adult (Census Income)](https://archive.ics.uci.edu/dataset/2/adult), from the 1994 US Census.
- **Skills:** categorical data, cross-tabulations, classification.
- **Stretch:** check model performance separately by sex and race, and discuss why a model trained on 1994 data would be inappropriate for decisions today.

### 23. Electricity use at home

- **Goal:** describe daily and seasonal electricity patterns in one household.
- **Data:** [UCI Individual Household Electric Power Consumption](https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption).
- **Skills:** large CSVs, parsing timestamps, resampling to hours and days.
- **Stretch:** detect unusual days and estimate what share of use happens at night.

### 24. Food nutrition comparison

- **Goal:** compare sugar, salt and fat across product categories.
- **Data:** [Open Food Facts](https://world.openfoodfacts.org/data).
- **Skills:** messy crowd-sourced data, outlier filtering, categorical summaries.
- **Stretch:** cluster products by nutrition profile and name each cluster.

### 25. Economic indicators over time

- **Goal:** chart unemployment, inflation and interest rates together.
- **Data:** [FRED](https://fred.stlouisfed.org/).
- **Skills:** aligning series with different frequencies, dual-axis charts, recessions shading.
- **Stretch:** compute correlations at different lags and explain why correlation is not a forecast.

### 26. Iris classifier with a decision boundary

- **Goal:** classify iris species and visualize how the model splits the feature space.
- **Data:** scikit-learn's `load_iris`.
- **Skills:** decision trees, train/test split, plotting decision regions.
- **Stretch:** compare decision boundaries of a tree, logistic regression and k-nearest neighbors.

### 27. Wikipedia page-view trends

- **Goal:** track interest in a set of topics over time.
- **Data:** the [Wikimedia pageviews API](https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html).
- **Skills:** API pagination, time series charts, spike detection.
- **Stretch:** relate spikes to dated news events and annotate the chart.

### 28. Bank marketing response

- **Goal:** find which customers responded to a phone marketing campaign.
- **Data:** [UCI Bank Marketing](https://archive.ics.uci.edu/dataset/222/bank+marketing).
- **Skills:** imbalanced classes, leakage (the `duration` column is only known after the call), lift charts.
- **Stretch:** show results with and without `duration` and explain why it must be excluded.

### 29. Credit card default exploration

- **Goal:** find patterns in customers who default on payments.
- **Data:** [UCI Default of Credit Card Clients](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients).
- **Skills:** payment-history features, class imbalance, ROC curves.
- **Stretch:** set a decision threshold based on an explicit cost assumption.

### 30. Mushroom edibility rules

- **Goal:** derive simple rules separating edible and poisonous mushrooms.
- **Data:** [UCI Mushroom](https://archive.ics.uci.edu/dataset/73/mushroom).
- **Skills:** categorical data, decision trees, rule extraction.
- **Stretch:** find the smallest tree that classifies the data perfectly, and add a clear warning that it is no guide for foraging.

### 31. Hacker News topic trends

- **Goal:** see which technologies are discussed most over time.
- **Data:** the [Hacker News API](https://github.com/HackerNews/API).
- **Skills:** API calls, text keyword matching, rolling counts.
- **Stretch:** compare story scores for posts mentioning different languages and discuss selection bias.

### 32. A/B test analysis

- **Goal:** decide whether a new page design changed the conversion rate.
- **Data:** simulate the experiment yourself with NumPy, or use any public A/B test dataset with clear documentation.
- **Skills:** two-proportion tests, confidence intervals, sample size.
- **Stretch:** show how peeking at results daily inflates false positives with a simulation.

### 33. Public transit reliability

- **Goal:** measure how often buses or trains run on time in your city.
- **Data:** your transit agency's GTFS and GTFS-Realtime feeds ([GTFS reference](https://gtfs.org/)).
- **Skills:** joining schedules with real-time data, time arithmetic.
- **Stretch:** map the least reliable routes and times of day.

### 34. Citi Bike station imbalance

- **Goal:** find stations that systematically empty or fill up.
- **Data:** [Citi Bike system data](https://citibikenyc.com/system-data).
- **Skills:** large monthly files, net-flow calculations, maps.
- **Stretch:** show how imbalance changes between weekday mornings and evenings.

### 35. Exploratory analysis report template

- **Goal:** build a reusable report that profiles any CSV: types, missing values, distributions and correlations.
- **Data:** any three datasets above.
- **Skills:** writing functions, plotting loops, Markdown or HTML output.
- **Stretch:** package it as a command-line tool with tests.

## Intermediate projects (36–70)

These projects use full scikit-learn pipelines, cross-validation, text processing, time series and APIs. See [100 Python machine learning examples](/articles/python-machine-learning-examples) for the techniques.

### 36. Customer churn prediction

- **Goal:** predict which telecom customers will leave and why.
- **Data:** [IBM Telco Customer Churn on Kaggle](https://www.kaggle.com/datasets/blastchar/telco-customer-churn).
- **Skills:** pipelines with `ColumnTransformer`, gradient boosting, SHAP explanations.
- **Stretch:** estimate the value of a retention campaign that targets the top 10% of predicted risk, with explicit assumptions.

### 37. Customer segmentation for an online store

- **Goal:** group customers by recency, frequency and monetary value (RFM).
- **Data:** [UCI Online Retail II](https://archive.ics.uci.edu/dataset/502/online+retail+ii).
- **Skills:** RFM features, k-means, cluster profiling.
- **Stretch:** describe each segment as a persona with a recommended marketing action.

### 38. Market basket analysis

- **Goal:** find products that are frequently bought together.
- **Data:** [UCI Online Retail](https://archive.ics.uci.edu/dataset/352/online+retail).
- **Skills:** transaction matrices, association rules (support, confidence, lift) with mlxtend.
- **Stretch:** filter rules to ones with meaningful lift and enough support, and suggest product placements.

### 39. Movie recommender

- **Goal:** recommend movies a user is likely to enjoy.
- **Data:** [MovieLens](https://grouplens.org/datasets/movielens/).
- **Skills:** item-item similarity, matrix factorization, ranking metrics such as precision@k.
- **Stretch:** compare with a popularity baseline using a time-based split.

### 40. Sentiment classifier for movie reviews

- **Goal:** classify reviews as positive or negative.
- **Data:** [Large Movie Review Dataset (IMDb)](https://ai.stanford.edu/~amaas/data/sentiment/) ([Maas et al., 2011](https://aclanthology.org/P11-1015/)).
- **Skills:** TF-IDF, linear models, error analysis.
- **Stretch:** find reviews the model gets wrong and categorize the reasons (sarcasm, mixed opinions, negation).

### 41. News topic classifier

- **Goal:** assign news posts to topics.
- **Data:** 20 Newsgroups (`sklearn.datasets.fetch_20newsgroups`).
- **Skills:** multiclass text classification, removing headers and footers to avoid leakage.
- **Stretch:** compare accuracy with and without headers to see how much the model "cheats".

### 42. Bike demand forecasting

- **Goal:** forecast hourly bike rentals for the next day.
- **Data:** [UCI Bike Sharing](https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset).
- **Skills:** lag features, `TimeSeriesSplit`, gradient boosting.
- **Stretch:** report error by hour of day and weather condition.

### 43. Store sales forecasting

- **Goal:** forecast daily sales for many stores.
- **Data:** [Kaggle Rossmann Store Sales](https://www.kaggle.com/c/rossmann-store-sales).
- **Skills:** promotions and holidays as features, many series, validation by time.
- **Stretch:** compare a global model across stores with one model per store.

### 44. Credit card fraud detection

- **Goal:** detect fraudulent transactions with very few positive examples.
- **Data:** [Kaggle Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) (anonymized PCA features).
- **Skills:** average precision, threshold tuning, cost-based evaluation.
- **Stretch:** compare a supervised model with an unsupervised Isolation Forest.

### 45. Loan default with interpretable models

- **Goal:** predict default with a model a credit officer can understand.
- **Data:** [UCI Default of Credit Card Clients](https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients).
- **Skills:** monotonic constraints, Explainable Boosting Machines (InterpretML), calibration.
- **Stretch:** check whether accuracy is similar across demographic groups.

### 46. Hospital readmission risk

- **Goal:** predict which diabetic patients are readmitted within 30 days.
- **Data:** [UCI Diabetes 130-US Hospitals](https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008).
- **Skills:** messy clinical codes, high-cardinality categories, leakage checks.
- **Stretch:** group diagnosis codes into clinical categories and test whether it helps.

### 47. Web scraping a price tracker

- **Goal:** track prices of a few products over time.
- **Data:** pages you are allowed to scrape (check terms of service and `robots.txt`), or an official API where one exists.
- **Skills:** Requests, Beautiful Soup, scheduling, storing history in SQLite or DuckDB.
- **Stretch:** alert when a price drops below its 30-day median.

### 48. GitHub repository analytics

- **Goal:** analyze how issues and pull requests flow in an open-source project.
- **Data:** the [GitHub REST API](https://docs.github.com/en/rest).
- **Skills:** authenticated API calls, rate limits, time-to-close analysis.
- **Stretch:** survival analysis of issue resolution time with lifelines.

### 49. arXiv paper topic map

- **Goal:** map research topics in a field over time.
- **Data:** the [arXiv API](https://info.arxiv.org/help/api/index.html).
- **Skills:** text embeddings or TF-IDF, topic modeling, 2-D visualization.
- **Stretch:** show how the share of each topic changed year by year.

### 50. Crime pattern analysis

- **Goal:** study where and when reported crimes occur in a city.
- **Data:** [Chicago Data Portal: Crimes](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2).
- **Skills:** geospatial aggregation, time patterns, mapping.
- **Stretch:** discuss how reporting and policing practices shape this data, and why "hot spot" models can reinforce bias.

### 51. Real-estate price model with geographic features

- **Goal:** predict house prices using location.
- **Data:** California Housing (`sklearn.datasets.fetch_california_housing`).
- **Skills:** latitude and longitude features, spatial cross-validation, gradient boosting.
- **Stretch:** compare random and spatially grouped cross-validation and explain the difference.

### 52. Energy consumption forecasting

- **Goal:** forecast next-day household electricity use.
- **Data:** [UCI Individual Household Electric Power Consumption](https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption).
- **Skills:** resampling, calendar features, prediction intervals.
- **Stretch:** report interval coverage on a held-out period.

### 53. Survey analysis with weights

- **Goal:** estimate population statistics correctly from a weighted survey.
- **Data:** the [US Census American Community Survey](https://www.census.gov/programs-surveys/acs/microdata.html) public-use microdata.
- **Skills:** survey weights, weighted means and proportions, uncertainty.
- **Stretch:** compare weighted and unweighted estimates and explain the gap.

### 54. Named-entity extraction from news

- **Goal:** extract people, organizations and places from articles.
- **Data:** news articles from a source whose terms allow it, or the CoNLL-2003 dataset ([Tjong Kim Sang & De Meulder, 2003](https://aclanthology.org/W03-0419/)).
- **Skills:** spaCy pipelines, entity counts, co-occurrence networks.
- **Stretch:** build a NetworkX graph of entities that appear together.

### 55. Support ticket router

- **Goal:** route customer messages to the right team automatically.
- **Data:** a labeled public customer-support dataset from the [Hugging Face Hub](https://huggingface.co/datasets), or your own anonymized tickets.
- **Skills:** text classification, confusion analysis, confidence thresholds.
- **Stretch:** send low-confidence tickets to a human queue and measure the trade-off.

### 56. Duplicate question detection

- **Goal:** detect when two questions ask the same thing.
- **Data:** a question-pair dataset from the [Hugging Face Hub](https://huggingface.co/datasets) (search for "paraphrase" or "duplicate questions").
- **Skills:** sentence embeddings, cosine similarity, threshold selection.
- **Stretch:** compare TF-IDF similarity with Sentence Transformers embeddings.

### 57. Anomaly detection in server metrics

- **Goal:** flag unusual behavior in time series of metrics.
- **Data:** [Numenta Anomaly Benchmark (NAB)](https://github.com/numenta/NAB).
- **Skills:** rolling statistics, Isolation Forest, evaluation with labeled anomalies.
- **Stretch:** compare a robust z-score baseline with a model-based detector.

### 58. Customer lifetime value

- **Goal:** predict how much each customer will spend in the next six months.
- **Data:** [UCI Online Retail II](https://archive.ics.uci.edu/dataset/502/online+retail+ii).
- **Skills:** time-based feature windows, regression with skewed targets.
- **Stretch:** compare a regression model with a probabilistic model (for example BG/NBD and Gamma-Gamma models).

### 59. E-commerce delivery delays

- **Goal:** predict late deliveries and find their causes.
- **Data:** [Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce).
- **Skills:** multi-table joins, geographic distance, classification.
- **Stretch:** relate delays to review scores.

### 60. Online news popularity

- **Goal:** predict how often an article will be shared.
- **Data:** [UCI Online News Popularity](https://archive.ics.uci.edu/dataset/332/online+news+popularity).
- **Skills:** heavy-tailed targets, log transforms, feature importance.
- **Stretch:** honestly report how little of the variation is predictable, and what that means.

### 61. Taxi trip duration and fare analysis

- **Goal:** model trip duration and tip behavior in New York City.
- **Data:** [NYC TLC Trip Record Data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) (Parquet files).
- **Skills:** millions of rows with Polars or DuckDB, outlier cleaning, geographic zones.
- **Stretch:** compare trip durations before and after a policy change, accounting for seasonality.

### 62. Feature store for a churn model

- **Goal:** compute reusable customer features from raw event logs with SQL.
- **Data:** any event-level dataset above, such as Online Retail II.
- **Skills:** DuckDB SQL, window functions, point-in-time correctness.
- **Stretch:** prove that no feature uses information from after the prediction date.

### 63. Statistical modeling of insurance-style claims

- **Goal:** model claim counts and amounts separately.
- **Data:** simulate a portfolio, or use a public motor-insurance dataset with documented fields.
- **Skills:** Poisson and Gamma regression, exposure offsets, statsmodels.
- **Stretch:** combine frequency and severity into an expected cost per policy.

### 64. Job posting skills extractor

- **Goal:** find the skills most requested in data job postings.
- **Data:** job postings from an API or site whose terms permit collection.
- **Skills:** keyword dictionaries, spaCy matchers, trend charts.
- **Stretch:** cluster postings into role types and compare skill profiles.

### 65. Football or basketball analytics

- **Goal:** evaluate players or teams with an expected-value metric.
- **Data:** a public event dataset such as [StatsBomb Open Data](https://github.com/hudl/open-data) (StatsBomb is now part of Hudl).
- **Skills:** nested JSON, event aggregation, logistic regression (for example, an expected-goals model).
- **Stretch:** calibrate your expected-goals model and compare players' goals with expected goals.

### 66. Wine classification pipeline with model comparison

- **Goal:** build a clean comparison of five classifiers with proper validation.
- **Data:** [UCI Wine Quality](https://archive.ics.uci.edu/dataset/186/wine+quality).
- **Skills:** nested cross-validation, statistical comparison of models.
- **Stretch:** report score distributions instead of single numbers.

### 67. Air pollution forecasting

- **Goal:** forecast tomorrow's pollution level from today's readings and weather.
- **Data:** [UCI Air Quality](https://archive.ics.uci.edu/dataset/360/air+quality) plus weather from [Open-Meteo](https://open-meteo.com/).
- **Skills:** joining sources, missing sensor data, forecasting baselines.
- **Stretch:** forecast the probability of exceeding a threshold rather than the level itself.

### 68. Text summarization comparison

- **Goal:** compare extractive and model-based summaries of news articles.
- **Data:** [CNN/DailyMail](https://huggingface.co/datasets/abisee/cnn_dailymail).
- **Skills:** pretrained Transformers models, ROUGE metrics, qualitative review.
- **Stretch:** read 30 summaries and categorize their errors, including invented facts.

### 69. Interactive data app

- **Goal:** turn one of your earlier analyses into an app non-programmers can use.
- **Data:** any project above.
- **Skills:** Streamlit or Dash, caching, deployment.
- **Stretch:** add input validation and explain the model's prediction for each input.

### 70. Reproducible analysis pipeline

- **Goal:** rebuild an earlier project so one command reproduces every number and chart.
- **Data:** any project above.
- **Skills:** project structure, `requirements.txt` or a lock file, DVC or Make, tests for data transformations.
- **Stretch:** add continuous integration that runs the pipeline on a sample.

## Advanced projects (71–101)

These involve deep learning, large data, causal inference, production systems or research-style evaluation. Useful background: [101 NumPy examples](/articles/numpy-examples-for-numerical-computing) and [101 linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning).

### 71. Image classifier with transfer learning

- **Goal:** classify images into a few categories with a pretrained network.
- **Data:** [Oxford-IIIT Pet](https://www.robots.ox.ac.uk/~vgg/data/pets/).
- **Skills:** PyTorch, torchvision or timm, data augmentation, fine-tuning.
- **Stretch:** use Grad-CAM to show which image regions drive predictions.

### 72. Fashion image classification

- **Goal:** classify clothing images and compare model types.
- **Data:** [Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist).
- **Skills:** convolutional networks versus classical models on pixels.
- **Stretch:** measure accuracy against model size and inference time.

### 73. CIFAR-10 training study

- **Goal:** study how augmentation and learning-rate schedules affect accuracy.
- **Data:** [CIFAR-10](https://www.cs.toronto.edu/~kriz/cifar.html).
- **Skills:** training loops, experiment tracking with MLflow, ablation studies.
- **Stretch:** run each configuration with several random seeds and report variation.

### 74. Object detection on your own photos

- **Goal:** detect and count objects (for example, cars in a parking lot).
- **Data:** your own labeled images, using [COCO](https://cocodataset.org/) pretrained models as a starting point.
- **Skills:** bounding-box annotation, fine-tuning a detector, mean average precision.
- **Stretch:** check the license of the detection framework and pretrained weights before sharing or deploying.

### 75. Food image recognition

- **Goal:** recognize dishes from photos.
- **Data:** [Food-101](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/).
- **Skills:** large image datasets, efficient data loading, fine-tuning.
- **Stretch:** analyze which dishes get confused and whether it is a data or a model problem.

### 76. Medical image classification with caution

- **Goal:** classify chest X-rays and study the model's failure modes.
- **Data:** a public chest X-ray dataset, such as [Chest X-Ray Images (Pneumonia) on Kaggle](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia).
- **Skills:** class imbalance, patient-level splits, calibration.
- **Stretch:** investigate shortcut learning (for example, whether the model uses image markers rather than anatomy) and state clearly that the model is not for clinical use.

### 77. Speech command recognition

- **Goal:** recognize short spoken commands.
- **Data:** [Speech Commands](https://arxiv.org/abs/1804.03209) (available through torchaudio).
- **Skills:** spectrograms, audio augmentation, small convolutional networks.
- **Stretch:** measure robustness to background noise.

### 78. Environmental sound classification

- **Goal:** classify sounds such as rain, dogs and engines.
- **Data:** [ESC-50](https://github.com/karolpiczak/ESC-50).
- **Skills:** librosa features, pretrained audio models, the dataset's predefined folds.
- **Stretch:** compare MFCC features with a classical model against a pretrained audio network.

### 79. Fine-tune a language model for classification

- **Goal:** fine-tune a pretrained Transformers model on a text classification task.
- **Data:** the [IMDb reviews](https://ai.stanford.edu/~amaas/data/sentiment/) or a domain dataset from the Hugging Face Hub.
- **Skills:** tokenization, Hugging Face Trainer or Accelerate, evaluation.
- **Stretch:** compare with the TF-IDF baseline from project 40, including training cost.

### 80. Parameter-efficient fine-tuning with LoRA

- **Goal:** adapt a pretrained language model using LoRA.
- **Data:** an instruction or classification dataset from the Hugging Face Hub whose license allows your use.
- **Skills:** PEFT, memory-efficient training, evaluation on held-out tasks.
- **Stretch:** compare LoRA ranks and report quality against training memory.

### 81. Semantic search engine

- **Goal:** search a document collection by meaning rather than keywords.
- **Data:** your own documents, or a retrieval benchmark from [BEIR](https://github.com/beir-cellar/beir).
- **Skills:** Sentence Transformers, FAISS, retrieval metrics such as recall@k and nDCG.
- **Stretch:** combine keyword (BM25) and embedding scores, and measure whether the hybrid helps.

### 82. Retrieval-augmented question answering

- **Goal:** answer questions from a document set with cited sources.
- **Data:** a document collection you are allowed to use, plus a hand-written set of test questions.
- **Skills:** chunking, embeddings, retrieval evaluation, prompt design, measuring faithfulness.
- **Stretch:** build a test set of 50 questions with reference answers and track accuracy and citation correctness as you change components.

### 83. Question answering on SQuAD

- **Goal:** extract answer spans from passages.
- **Data:** [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/) ([Rajpurkar et al., 2016](https://arxiv.org/abs/1606.05250)).
- **Skills:** span prediction, exact match and F1 metrics.
- **Stretch:** analyze errors by question type (who, when, why).

### 84. Large-scale taxi analytics with DuckDB or Spark

- **Goal:** analyze a full year of NYC taxi trips.
- **Data:** [NYC TLC Trip Record Data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page).
- **Skills:** out-of-core queries over Parquet, partitioning, query performance.
- **Stretch:** benchmark the same queries in pandas, Polars, DuckDB and Spark on your machine and report the conditions honestly.

### 85. Demand forecasting at scale

- **Goal:** forecast thousands of product-store series.
- **Data:** [M5 Forecasting (Walmart) on Kaggle](https://www.kaggle.com/competitions/m5-forecasting-accuracy) ([Makridakis et al., 2022](https://doi.org/10.1016/j.ijforecast.2021.11.013)).
- **Skills:** hierarchical series, StatsForecast or LightGBM global models, backtesting.
- **Stretch:** reconcile forecasts across product hierarchy levels.

### 86. Predictive maintenance

- **Goal:** predict the remaining useful life of jet engines.
- **Data:** NASA's C-MAPSS turbofan degradation data from the [NASA Prognostics Center of Excellence data repository](https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/).
- **Skills:** sensor time series, window features, regression with censoring in mind.
- **Stretch:** frame it as "will this engine fail within 30 cycles?" and compare with the regression approach.

### 87. Causal effect of a job training program

- **Goal:** estimate the effect of a training program on earnings.
- **Data:** the LaLonde / NSW data ([Dehejia & Wahba's data page](https://users.nber.org/~rdehejia/nswdata.html)).
- **Skills:** propensity scores, matching, comparing with the experimental benchmark.
- **Stretch:** show how naive comparisons give misleading answers and how adjustment changes them.

### 88. Uplift modeling for marketing

- **Goal:** find customers whose behavior changes because of a campaign, not just those likely to buy.
- **Data:** Kevin Hillstrom's [MineThatData email experiment](https://blog.minethatdata.com/2008/03/minethatdata-e-mail-analytics-and-data.html).
- **Skills:** randomized experiments, two-model and class-transformation uplift methods, Qini curves.
- **Stretch:** compare targeting by uplift against targeting by purchase probability.

### 89. Off-policy evaluation for recommendations

- **Goal:** estimate how a new recommendation policy would perform using logged data.
- **Data:** the [Open Bandit Dataset](https://github.com/st-tech/zr-obp) ([Saito et al., 2020](https://arxiv.org/abs/2008.07146)).
- **Skills:** inverse propensity scoring, bandit feedback, variance of estimators.
- **Stretch:** compare estimators and discuss when they disagree.

### 90. Bayesian A/B testing

- **Goal:** analyze an experiment with Bayesian methods and report decision-relevant quantities.
- **Data:** a simulated or public experiment.
- **Skills:** PyMC or conjugate Beta-Binomial models, posterior probability of improvement, expected loss.
- **Stretch:** compare conclusions with a frequentist analysis and explain the differences.

### 91. Hierarchical model for many small groups

- **Goal:** estimate rates for many groups (for example, schools or stores) where some have little data.
- **Data:** any grouped dataset above, such as Student Performance by school.
- **Skills:** partial pooling with PyMC or Bambi, shrinkage, posterior checks.
- **Stretch:** show how estimates for small groups move toward the overall average and why that is useful.

### 92. Graph-based fraud or community detection

- **Goal:** find suspicious clusters in a network of accounts or transactions.
- **Data:** a public graph dataset, such as those in [PyTorch Geometric's dataset collection](https://pytorch-geometric.readthedocs.io/en/latest/modules/datasets.html).
- **Skills:** NetworkX features, community detection, graph neural networks.
- **Stretch:** compare a graph neural network with a model on hand-made graph features.

### 93. Satellite imagery change detection

- **Goal:** detect land-use change, such as new construction or deforestation.
- **Data:** free satellite imagery from the [Copernicus Sentinel program](https://dataspace.copernicus.eu/).
- **Skills:** Rasterio, vegetation indices such as NDVI, image differencing.
- **Stretch:** validate detected changes against a few manually checked locations.

### 94. Street network analysis

- **Goal:** compare how walkable or connected different neighborhoods are.
- **Data:** [OpenStreetMap](https://www.openstreetmap.org/) via the OSMnx library ([Boeing, 2017](https://doi.org/10.1016/j.compenvurbsys.2017.05.004)).
- **Skills:** graph metrics, GeoPandas, isochrones.
- **Stretch:** relate network metrics to another dataset, such as bike-share usage.

### 95. Model monitoring and drift dashboard

- **Goal:** detect when production data drifts away from training data.
- **Data:** split a time-stamped dataset, such as NYC taxi trips, into "training" and later "production" months.
- **Skills:** distribution tests, population stability index, alert thresholds.
- **Stretch:** show how model error changes as drift grows.

### 96. End-to-end ML service

- **Goal:** deploy a trained model as an HTTP API.
- **Data:** any model from an earlier project.
- **Skills:** FastAPI or a similar framework, input validation with Pydantic, Docker, tests.
- **Stretch:** add request logging and a monitoring endpoint, and document the model version served.

### 97. Experiment tracking and model registry

- **Goal:** manage dozens of experiments and promote the best model safely.
- **Data:** any modeling project above.
- **Skills:** MLflow tracking and registry, reproducible environments.
- **Stretch:** write a promotion rule (for example, beat the current model on a fixed test set by a margin) and automate it.

### 98. Fairness audit of a classifier

- **Goal:** assess a model's behavior across demographic groups.
- **Data:** [UCI Adult](https://archive.ics.uci.edu/dataset/2/adult) or the credit default dataset.
- **Skills:** Fairlearn metrics, thresholds per group, trade-off analysis.
- **Stretch:** write a short model card describing intended use, limitations and group-level results ([Mitchell et al., 2019](https://arxiv.org/abs/1810.03993)).

### 99. Conformal prediction for reliable intervals

- **Goal:** add prediction intervals with coverage guarantees to a regression model.
- **Data:** California Housing or a forecasting project above.
- **Skills:** MAPIE, split conformal prediction, coverage checks.
- **Stretch:** check coverage separately for cheap and expensive houses.

### 100. Reproduce a published result

- **Goal:** reproduce a figure or table from a paper with open data.
- **Data:** the paper's released data and code, if any.
- **Skills:** careful reading, environment setup, comparison of results.
- **Stretch:** write up what reproduced, what did not, and why, which is valuable to readers and to the authors.

### 101. Your own question, end to end

- **Goal:** pick a question you care about, find or collect the data, and answer it.
- **Data:** public sources such as [data.gov](https://data.gov/), [Eurostat](https://ec.europa.eu/eurostat/web/main/data/database), [World Bank](https://data.worldbank.org/) or your city's open-data portal.
- **Skills:** everything above, plus scoping, data collection and communication.
- **Stretch:** publish the analysis, share it with people who care about the question, and update it with their feedback.

## Common mistakes in data science projects

- **Starting with a model instead of a question.** Write the question and the decision it informs first.
- **Leaking information from the future or the test set.** Build features from data available at prediction time and fit preprocessing inside a pipeline.
- **Skipping the baseline.** A model is only impressive relative to a simple alternative.
- **Reporting one number.** Show the spread across folds or seeds, and errors broken down by meaningful groups.
- **Overclaiming causation.** Correlational data rarely supports "X causes Y"; use the causal projects (87–89) to learn how to make those claims carefully.
- **Leaving it unfinished.** A finished, clearly written beginner project is worth more than an abandoned advanced one.

## Where to go next

- Learn the tools you will use most in [100 Python libraries for data science](/articles/python-libraries-for-data-science).
- Speed up your data cleaning with [100 pandas tips and tricks](/articles/pandas-tips-and-tricks-for-data-analysis).
- Borrow techniques from [100 Python machine learning examples](/articles/python-machine-learning-examples).
- For projects focused on building, evaluating and deploying models, see [101 machine learning projects](/articles/machine-learning-projects), and find data in [100 machine learning datasets](/articles/machine-learning-datasets).
- Strengthen your statistics with [100 probability and statistics examples](/articles/probability-statistics-real-world-examples).
- Find practitioners writing about their own projects in the [community blog directory](/directory).

## References

1. Dua, D., & Graff, C. UCI Machine Learning Repository. University of California, Irvine. [archive.ics.uci.edu](https://archive.ics.uci.edu/)
2. Harper, F. M., & Konstan, J. A. (2015). "The MovieLens Datasets: History and Context." *ACM Transactions on Interactive Intelligent Systems*, 5(4). [doi.org/10.1145/2827872](https://doi.org/10.1145/2827872)
3. Maas, A. L., et al. (2011). "Learning Word Vectors for Sentiment Analysis." *ACL 2011*. [aclanthology.org/P11-1015](https://aclanthology.org/P11-1015/)
4. De Cock, D. (2011). "Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester Regression Project." *Journal of Statistics Education*, 19(3). [doi.org/10.1080/10691898.2011.11889627](https://doi.org/10.1080/10691898.2011.11889627)
5. Rajpurkar, P., et al. (2016). "SQuAD: 100,000+ Questions for Machine Comprehension of Text." [arxiv.org/abs/1606.05250](https://arxiv.org/abs/1606.05250)
6. Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2022). "M5 accuracy competition: Results, findings, and conclusions." *International Journal of Forecasting*, 38(4). [doi.org/10.1016/j.ijforecast.2021.11.013](https://doi.org/10.1016/j.ijforecast.2021.11.013)
7. Dehejia, R., & Wahba, S. (1999). "Causal Effects in Nonexperimental Studies: Reevaluating the Evaluation of Training Programs." *JASA*, 94(448). [doi.org/10.1080/01621459.1999.10473858](https://doi.org/10.1080/01621459.1999.10473858)
8. Saito, Y., et al. (2020). "Open Bandit Dataset and Pipeline." [arxiv.org/abs/2008.07146](https://arxiv.org/abs/2008.07146)
9. Mitchell, M., et al. (2019). "Model Cards for Model Reporting." *Proceedings of the Conference on Fairness, Accountability, and Transparency* (FAT* 2019). [arxiv.org/abs/1810.03993](https://arxiv.org/abs/1810.03993)
10. Boeing, G. (2017). "OSMnx: New methods for acquiring, constructing, analyzing, and visualizing complex street networks." *Computers, Environment and Urban Systems*, 65. [doi.org/10.1016/j.compenvurbsys.2017.05.004](https://doi.org/10.1016/j.compenvurbsys.2017.05.004)
11. Warden, P. (2018). "Speech Commands: A Dataset for Limited-Vocabulary Speech Recognition." [arxiv.org/abs/1804.03209](https://arxiv.org/abs/1804.03209)
