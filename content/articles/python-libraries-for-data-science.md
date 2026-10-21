---
title: "100 Best Python Libraries for Data Science: A Complete Guide"
seoTitle: "100 Python Libraries for Data Science: A Complete Guide"
description: A guide to 100 Python data science libraries grouped by task, from pandas and Polars to PyTorch, spaCy and MLflow, with when to use each and how to choose.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Programming and Technology
  - Engineering
tags:
  - python
  - data science
  - machine learning
  - pandas
  - numpy
  - scikit-learn
tocDepth: 2
---

You do not need 100 libraries to do data science in Python. Most projects run on a core of five: **NumPy** for arrays, **pandas** or **Polars** for tables, **Matplotlib** or **seaborn** for charts, **scikit-learn** for classical machine learning, and **Jupyter** for interactive work. Everything else in this guide solves a more specific problem: data too big for memory, messy inputs, statistical modeling, deep learning, text, images, time series, maps, or getting a model into production.

This guide organizes 100 libraries by the job they do, so you can find the right tool when you hit that problem. For each one you get what it does, when to reach for it, and what to use instead when it is the wrong fit.

**How these were chosen.** Every library here is open source, has official documentation, and fills a clear role in a data science workflow. We did not rank them by download counts or GitHub stars, and "best" here means "a strong, widely used choice for its job", not a measured winner. Library ecosystems change quickly: before you adopt one, check its recent release history, its license and whether it supports your Python version. Facts were checked against official documentation and release notes in October 2026.

## How to choose a library

Ask four questions before adding a dependency:

1. **Does the core stack already do this?** pandas, NumPy, SciPy and scikit-learn cover more than most people expect. Every extra library is something to install, update and learn.
2. **Is it maintained?** Look for releases within the last year, answered issues and support for current Python and NumPy versions.
3. **Does it fit your data size?** Up to a few gigabytes, pandas or Polars on one machine is usually enough. Beyond that, look at DuckDB, Dask, Spark or Ray.
4. **What is the license?** Most libraries below use permissive licenses (BSD, MIT, Apache 2.0). Some tools in the wider ecosystem use copyleft or commercial licenses, which can matter in company products.

| If you need to… | Start with | Consider instead |
|---|---|---|
| Work with tables in memory | pandas | Polars for speed on large data |
| Query files with SQL | DuckDB | Spark for multi-machine data |
| Make standard charts | Matplotlib, seaborn | Plotly or Altair for interactivity |
| Train models on tabular data | scikit-learn | XGBoost, LightGBM or CatBoost for gradient boosting |
| Run statistical tests and regressions with p-values | statsmodels | pingouin for quick tests, PyMC for Bayesian models |
| Train neural networks | PyTorch | Keras for a higher-level API, JAX for research |
| Use pretrained language models | Hugging Face Transformers | spaCy for production NLP pipelines |
| Forecast time series | StatsForecast or sktime | Darts for deep-learning forecasters |
| Share results as an app | Streamlit | Gradio for model demos, Dash for dashboards |

Install libraries into a virtual environment per project (with `python -m venv`, conda or [uv](https://docs.astral.sh/uv/)) so that version conflicts in one project do not break another.

## Core arrays, dataframes and SQL

### 1. NumPy

[NumPy](https://numpy.org/) provides the n-dimensional array and the fast vectorized math that almost every other library on this list builds on ([Harris et al., 2020](https://doi.org/10.1038/s41586-020-2649-2)). Use it directly for numerical work, simulations and anything shaped like a matrix. Our [101 NumPy examples](/articles/numpy-examples-for-numerical-computing) cover it in depth.

### 2. pandas

[pandas](https://pandas.pydata.org/) is the standard library for labeled, tabular data: loading CSV and Excel files, cleaning, filtering, grouping, joining and time series. pandas 3.0, released in January 2026, made a dedicated string dtype and Copy-on-Write the defaults ([release notes](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html)). See our [100 pandas tips and tricks](/articles/pandas-tips-and-tricks-for-data-analysis).

### 3. Polars

[Polars](https://pola.rs/) is a DataFrame library written in Rust with a lazy query engine that optimizes a whole pipeline before running it and uses all CPU cores. Choose it when pandas is too slow or memory-hungry on large tables. Its expression API is different from pandas, so budget time to learn it.

### 4. PyArrow

[PyArrow](https://arrow.apache.org/docs/python/) is the Python interface to Apache Arrow, a columnar in-memory format shared by pandas, Polars, DuckDB and Spark. You will mostly use it indirectly, to read and write Parquet files and to move data between tools without copying. When it is installed, pandas 3 uses it to store text columns.

### 5. DuckDB

[DuckDB](https://duckdb.org/) is an in-process analytical SQL database: no server, just `pip install duckdb`. It can query CSV and Parquet files, pandas DataFrames and Polars frames directly with SQL, and it handles data larger than memory. It is an excellent choice when you think in SQL or need fast aggregations on local files.

### 6. SciPy

[SciPy](https://scipy.org/) adds scientific algorithms on top of NumPy: optimization, integration, interpolation, signal processing, sparse matrices, linear algebra and statistics (`scipy.stats`, which covers distributions and classical tests). Reach for it before writing a numerical method yourself.

### 7. xarray

[xarray](https://xarray.dev/) brings pandas-style labels to n-dimensional arrays, so you can select by `time`, `lat` and `lon` instead of axis numbers. It is the standard tool in climate, weather and remote-sensing work, and reads formats such as netCDF and Zarr.

### 8. Ibis

[Ibis](https://ibis-project.org/) is a dataframe API that compiles your Python code to SQL and runs it on a backend such as DuckDB, PostgreSQL, BigQuery or Snowflake. Use it to write one analysis that runs locally on a sample and then on the warehouse at full size.

### 9. SQLAlchemy

[SQLAlchemy](https://www.sqlalchemy.org/) is the standard toolkit for talking to relational databases from Python. Data scientists mostly use its engine with `pandas.read_sql` and `DataFrame.to_sql` to pull data from and push results to PostgreSQL, MySQL, SQL Server and others.

## Scaling and speed

### 10. Dask

[Dask](https://www.dask.org/) parallelizes pandas- and NumPy-style code across CPU cores or a cluster by splitting data into partitions. Use it when a familiar pandas workflow no longer fits in memory and you want to keep a similar API.

### 11. PySpark

[PySpark](https://spark.apache.org/docs/latest/api/python/) is the Python API for Apache Spark, the long-standing standard for distributed processing of very large datasets. It includes DataFrames, SQL, streaming and MLlib. It is the default in many company data platforms; for single-machine data, it is usually heavier than you need.

### 12. Ray

[Ray](https://www.ray.io/) is a framework for distributed Python, with libraries for data processing (Ray Data), training (Ray Train), hyperparameter tuning (Ray Tune) and model serving (Ray Serve). Choose it to scale Python and machine learning workloads, especially GPU-heavy ones, across a cluster.

### 13. Numba

[Numba](https://numba.pydata.org/) compiles numerical Python functions to machine code with a decorator such as `@njit`. It is the quickest way to speed up a loop you cannot vectorize, such as a custom simulation or a sequential algorithm.

### 14. CuPy

[CuPy](https://cupy.dev/) implements a large part of the NumPy and SciPy APIs on NVIDIA GPUs (with experimental support for AMD GPUs). If your array code is mostly NumPy and you have a GPU, switching the import can give large speedups on big arrays.

### 15. cuDF

[cuDF](https://docs.rapids.ai/api/cudf/stable/), part of NVIDIA RAPIDS, is a GPU DataFrame library with a pandas-like API. Its `cudf.pandas` mode can accelerate existing pandas code without changes, falling back to the CPU for unsupported operations. It requires an NVIDIA GPU.

### 16. joblib

[joblib](https://joblib.readthedocs.io/) offers simple parallel loops (`Parallel` and `delayed`), caching of expensive function results to disk, and efficient saving of objects with large NumPy arrays. scikit-learn uses it internally, and it is the usual way to save trained scikit-learn models.

## Getting data in

### 17. Requests

[Requests](https://requests.readthedocs.io/) is the most widely used library for calling web APIs and downloading files over HTTP. Pair it with `pandas.json_normalize` to turn JSON responses into tables.

### 18. HTTPX

[HTTPX](https://www.python-httpx.org/) offers a Requests-like API with both synchronous and asynchronous clients and HTTP/2 support. Use it when you need to call many APIs concurrently.

### 19. Beautiful Soup

[Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) parses HTML and XML so you can extract tables, links and text from web pages. It is ideal for small scraping jobs. Always check a site's terms of service and `robots.txt` before scraping.

### 20. Scrapy

[Scrapy](https://scrapy.org/) is a full web-crawling framework with scheduling, throttling, retries and export pipelines. Choose it over Beautiful Soup when you need to crawl many pages reliably.

### 21. openpyxl

[openpyxl](https://openpyxl.readthedocs.io/) reads and writes Excel `.xlsx` files, including formatting and formulas. pandas uses it behind `read_excel` and `to_excel`, and you can use it directly to produce formatted reports.

### 22. h5py

[h5py](https://www.h5py.org/) gives NumPy-style access to HDF5 files, a format common in science and engineering for large, structured numerical datasets. You can read slices of arrays far larger than memory.

## Cleaning, validation and profiling

### 23. pandera

[pandera](https://pandera.readthedocs.io/) validates DataFrames against a schema: column types, allowed ranges, uniqueness and custom checks. Put it at the start of a pipeline so bad data fails loudly instead of silently corrupting results. It supports pandas, Polars and other backends.

### 24. Pydantic

[Pydantic](https://docs.pydantic.dev/) validates and parses records (dictionaries, JSON) using Python type hints. Use it to check API payloads and configuration files, and to define the input schema of a prediction service.

### 25. Great Expectations

[Great Expectations](https://greatexpectations.io/) (its open-source library is called GX Core) defines data-quality tests, called expectations, runs them against batches of data and produces readable reports. It suits teams that need documented data contracts in production pipelines.

### 26. fg-data-profiling (formerly ydata-profiling and pandas-profiling)

This library generates an HTML report for a DataFrame with distributions, correlations, missing values and duplicate rows from one function call, which is useful for a first look at a new dataset. It was renamed from pandas-profiling to ydata-profiling in 2023, and its maintainers have since renamed it again to `fg-data-profiling`; according to the [project README](https://github.com/Data-Centric-AI-Community/fg-data-profiling), the old package name no longer receives updates. Check which name your environment uses.

### 27. missingno

[missingno](https://github.com/ResidentMario/missingno) draws charts of where values are missing in a dataset. Patterns, such as two columns always missing together, often reveal how the data was collected.

### 28. pyjanitor

[pyjanitor](https://pyjanitor-devs.github.io/pyjanitor/) adds cleaning methods to pandas, such as `clean_names()` and `remove_empty()`, so cleaning steps read as a method chain.

### 29. RapidFuzz

[RapidFuzz](https://github.com/rapidfuzz/RapidFuzz) computes fast fuzzy string similarity, such as Levenshtein distance. Use it to match messy names, such as "Acme Corp." and "ACME Corporation", when deduplicating or joining records without a shared ID.

## Visualization

### 30. Matplotlib

[Matplotlib](https://matplotlib.org/) is the foundational plotting library, with full control over every element of a figure. It produces publication-quality static images, and pandas and seaborn plot through it. It can be verbose for quick exploration.

### 31. seaborn

[seaborn](https://seaborn.pydata.org/) builds statistical charts on top of Matplotlib with sensible defaults: distributions, relationships, categorical comparisons and small multiples, often in one line from a DataFrame.

### 32. Plotly

[Plotly](https://plotly.com/python/) creates interactive charts (zoom, hover and filter) that work in notebooks and web pages. Its `plotly.express` module makes common charts as quick as seaborn.

### 33. Altair

[Altair](https://altair-viz.github.io/) is a declarative library based on Vega-Lite. You describe how columns map to position, color and size, and it builds the chart, including linked interactive views. It is concise and consistent, but less suited to very large datasets rendered in the browser.

### 34. Bokeh

[Bokeh](https://bokeh.org/) builds interactive, browser-based plots and dashboards, and can stream data from a Python server. It is the rendering engine behind several higher-level tools, including hvPlot.

### 35. hvPlot

[hvPlot](https://hvplot.holoviz.org/) adds an interactive `.hvplot()` method to pandas, Polars, xarray and Dask objects, rendering with Bokeh (or other backends). It is part of the HoloViz ecosystem along with Panel, HoloViews and Datashader.

### 36. plotnine

[plotnine](https://plotnine.org/) implements the grammar of graphics in Python, closely following R's ggplot2. It is the natural choice if you or your team already think in ggplot2.

### 37. Datashader

[Datashader](https://datashader.org/) renders millions or billions of points by aggregating them into an image, avoiding overplotting and browser slowdowns. Use it for large scatter plots, trajectories and maps.

### 38. Folium

[Folium](https://python-visualization.github.io/folium/) creates interactive Leaflet web maps from Python, with markers, choropleths and heat maps.

### 39. PyVista

[PyVista](https://pyvista.org/) provides a Pythonic interface to VTK for 3D visualization and mesh analysis, used in engineering, geoscience and medical imaging.

## Statistics and probabilistic modeling

### 40. statsmodels

[statsmodels](https://www.statsmodels.org/) estimates statistical models with full inference: linear and generalized linear models, ANOVA, time series models such as ARIMA, and many hypothesis tests, with R-style formulas and detailed summary tables. Use it when you need p-values and confidence intervals rather than just predictions.

### 41. pingouin

[pingouin](https://pingouin-stats.org/) runs common statistical tests, such as t-tests, ANOVA, correlations and nonparametric tests, with one function call each, and returns effect sizes and confidence intervals in a DataFrame.

### 42. linearmodels

[linearmodels](https://bashtage.github.io/linearmodels/) extends statsmodels with econometric models: panel data (fixed and random effects), instrumental variables and systems of equations.

### 43. lifelines

[lifelines](https://lifelines.readthedocs.io/) handles survival analysis: Kaplan–Meier curves and Cox proportional-hazards models for "time until an event" data, such as customer churn or equipment failure.

### 44. PyMC

[PyMC](https://www.pymc.io/) is a probabilistic programming library for Bayesian modeling. You write the model in Python, and it fits it with modern samplers such as NUTS. Use it when you need uncertainty estimates, hierarchical models or prior knowledge built in.

### 45. Bambi

[Bambi](https://bambinos.github.io/bambi/) builds Bayesian regression models in PyMC from formulas such as `"y ~ x + (1|group)"`, making Bayesian mixed models about as easy to specify as in statsmodels.

### 46. ArviZ

[ArviZ](https://www.arviz.org/) diagnoses and visualizes Bayesian models from PyMC, NumPyro and other tools: trace plots, posterior summaries, convergence checks and model comparison.

### 47. NumPyro

[NumPyro](https://num.pyro.ai/) is a probabilistic programming library built on JAX, with fast NUTS sampling on CPUs and GPUs. Choose it for large Bayesian models where speed matters.

## Classical machine learning

### 48. scikit-learn

[scikit-learn](https://scikit-learn.org/) is the standard library for classical machine learning: preprocessing, pipelines, classification, regression, clustering, dimensionality reduction, model selection and metrics, all behind one consistent `fit`/`predict` API ([Pedregosa et al., 2011](https://jmlr.org/papers/v12/pedregosa11a.html)). See it in action in our [100 Python machine learning examples](/articles/python-machine-learning-examples).

### 49. XGBoost

[XGBoost](https://xgboost.readthedocs.io/) is a gradient-boosted decision tree library known for strong results on tabular data ([Chen & Guestrin, 2016](https://doi.org/10.1145/2939672.2939785)). It supports GPUs, distributed training and a scikit-learn-compatible interface.

### 50. LightGBM

[LightGBM](https://lightgbm.readthedocs.io/), from Microsoft, is a gradient-boosting library that uses histogram-based, leaf-wise tree growth and is designed for fast training on large datasets ([Ke et al., 2017](https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree)).

### 51. CatBoost

[CatBoost](https://catboost.ai/), from Yandex, is a gradient-boosting library with built-in handling of categorical features, which reduces the need for manual encoding and helps avoid a form of target leakage ([Prokhorenkova et al., 2018](https://arxiv.org/abs/1706.09516)).

### 52. imbalanced-learn

[imbalanced-learn](https://imbalanced-learn.org/) provides resampling methods, such as SMOTE and random under-sampling, that plug into scikit-learn pipelines. Compare resampling against simpler options such as class weights and threshold tuning before committing to it.

### 53. category_encoders

[category_encoders](https://contrib.scikit-learn.org/category_encoders/) offers many encoders for categorical variables, including target, binary, hashing and leave-one-out encoding, as scikit-learn transformers. scikit-learn itself now includes a `TargetEncoder`, so check whether you need the extra options.

### 54. Feature-engine

[Feature-engine](https://feature-engine.trainindata.com/) provides scikit-learn-compatible transformers for feature engineering: imputation, encoding, discretization, outlier capping, date features and feature selection, with each transformer applied to named DataFrame columns.

### 55. skrub

[skrub](https://skrub-data.org/), developed by members of the scikit-learn community, prepares messy tables for machine learning. Its `TableVectorizer` turns a DataFrame with dates, text and categories into model-ready features, and it includes tools for fuzzy joins.

### 56. mlxtend

[mlxtend](https://rasbt.github.io/mlxtend/) collects useful extras, notably frequent-itemset mining and association rules (Apriori, FP-Growth) for market-basket analysis, plus sequential feature selection and plotting helpers.

### 57. Optuna

[Optuna](https://optuna.org/) is a hyperparameter optimization framework. You define the search space in ordinary Python code, and it searches efficiently and stops unpromising trials early (pruning). It works with any training code, from scikit-learn to PyTorch.

## Interpretability, fairness and uncertainty

### 58. SHAP

[SHAP](https://shap.readthedocs.io/) explains individual predictions by attributing them to features using Shapley values from game theory ([Lundberg & Lee, 2017](https://arxiv.org/abs/1705.07874)). It has fast exact algorithms for tree models and is widely used for model explanations and debugging. Attributions describe the model, not causal effects in the real world.

### 59. InterpretML

[InterpretML](https://interpret.ml/), from Microsoft, includes Explainable Boosting Machines: glass-box models that are often competitive with black-box models on tabular data while remaining directly interpretable.

### 60. Fairlearn

[Fairlearn](https://fairlearn.org/) assesses and mitigates unfair performance differences across groups, with metrics broken down by group and mitigation algorithms. It is a starting point for a fairness review, not a substitute for one.

### 61. MAPIE

[MAPIE](https://mapie.readthedocs.io/) adds conformal prediction to scikit-learn models: prediction intervals for regression and prediction sets for classification, with coverage guarantees under mild assumptions.

## Deep learning

### 62. PyTorch

[PyTorch](https://pytorch.org/) is a deep learning framework with dynamic computation graphs, automatic differentiation and GPU acceleration. It dominates research and is widely used in production. Most modern model libraries, including Hugging Face Transformers, are built primarily for it.

### 63. TensorFlow

[TensorFlow](https://www.tensorflow.org/) is Google's machine learning platform, with tools for production deployment such as TensorFlow Serving and LiteRT (formerly TensorFlow Lite) for mobile and edge devices. It remains common in existing production systems.

### 64. Keras

[Keras](https://keras.io/) is a high-level API for building and training neural networks. Since Keras 3 it runs on JAX, TensorFlow or PyTorch as interchangeable backends, so the same model code can target different frameworks.

### 65. JAX

[JAX](https://docs.jax.dev/) combines a NumPy-like API with automatic differentiation, just-in-time compilation via XLA and easy vectorization and parallelization. It is popular in research and for large-scale training on TPUs and GPUs.

### 66. Flax

[Flax](https://flax.readthedocs.io/) is a neural network library for JAX, providing layers, models and training utilities. Its newer NNX API uses ordinary Python objects to hold model state.

### 67. Lightning (PyTorch Lightning)

[Lightning](https://lightning.ai/docs/pytorch/stable/) organizes PyTorch code into a standard structure and handles the training loop, logging, checkpointing, mixed precision and multi-GPU training, so you write less boilerplate.

### 68. torchvision

[torchvision](https://docs.pytorch.org/vision/stable/) provides datasets, pretrained models and image transforms for computer vision in PyTorch.

### 69. timm

[timm](https://huggingface.co/docs/timm/) (PyTorch Image Models) is a large collection of pretrained image models, such as ResNets, EfficientNets and vision transformers, with consistent training and fine-tuning utilities. It is maintained by Hugging Face.

### 70. ONNX Runtime

[ONNX Runtime](https://onnxruntime.ai/) runs models exported to the ONNX format on CPUs, GPUs and edge devices. Use it to serve models from PyTorch, scikit-learn and other frameworks with fast, framework-independent inference.

### 71. Hugging Face Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/) lets the same PyTorch training script run on one GPU, many GPUs, TPUs or with mixed precision with minimal code changes.

## Natural language processing and large language models

### 72. Hugging Face Transformers

[Transformers](https://huggingface.co/docs/transformers/) gives access to thousands of pretrained models for text, vision and audio tasks, including classification, named-entity recognition, summarization, translation and text generation, through a common API and the Hugging Face Hub ([Wolf et al., 2020](https://aclanthology.org/2020.emnlp-demos.6/)). Check each model's license before commercial use.

### 73. Hugging Face Datasets

[Datasets](https://huggingface.co/docs/datasets/) loads and processes datasets from the Hugging Face Hub and local files, with memory-mapped storage based on Arrow for data larger than RAM.

### 74. Hugging Face Tokenizers

[Tokenizers](https://huggingface.co/docs/tokenizers/) trains and runs fast subword tokenizers, such as BPE and WordPiece, implemented in Rust. Transformers uses it to turn text into model inputs.

### 75. Sentence Transformers

[Sentence Transformers](https://www.sbert.net/) computes embeddings (vectors) for sentences and documents that capture meaning, for semantic search, clustering, deduplication and retrieval-augmented generation ([Reimers & Gurevych, 2019](https://arxiv.org/abs/1908.10084)).

### 76. PEFT

[PEFT](https://huggingface.co/docs/peft/) implements parameter-efficient fine-tuning methods such as LoRA, which adapt a large pretrained model by training a small number of extra parameters. This makes fine-tuning feasible on modest hardware.

### 77. spaCy

[spaCy](https://spacy.io/) is an industrial-strength NLP library for tokenization, part-of-speech tagging, dependency parsing and named-entity recognition, with trained pipelines for many languages. It is designed for fast, production-ready text processing.

### 78. NLTK

[NLTK](https://www.nltk.org/) is a long-established toolkit for teaching and research in NLP, with corpora, lexical resources such as WordNet and classic algorithms. For production pipelines, spaCy or Transformers are usually a better fit.

### 79. Gensim

[Gensim](https://radimrehurek.com/gensim/) implements topic models (LDA) and word-embedding models (Word2Vec, FastText) that stream over large text collections.

### 80. FAISS

[FAISS](https://github.com/facebookresearch/faiss), from Meta, searches large collections of vectors for nearest neighbors quickly, on CPU or GPU. It is a common backend for semantic search and recommendation over embeddings.

## Computer vision and audio

### 81. OpenCV

[OpenCV](https://opencv.org/) (installed as `opencv-python`) is a broad computer vision library: image and video input and output, filtering, feature detection, geometric transforms, camera calibration and classic vision algorithms.

### 82. scikit-image

[scikit-image](https://scikit-image.org/) provides image-processing algorithms, such as segmentation, filters, morphology and feature extraction, that work on NumPy arrays with a scientific, well-documented API.

### 83. Pillow

[Pillow](https://python-pillow.github.io/) opens, converts, resizes and saves images in many formats. It is the usual first step when loading images for a model.

### 84. librosa

[librosa](https://librosa.org/) analyzes audio and music: loading audio, spectrograms, mel-frequency cepstral coefficients (MFCCs), tempo and pitch. It is the standard starting point for audio features.

## Time series and forecasting

### 85. StatsForecast

[StatsForecast](https://nixtlaverse.nixtla.io/statsforecast/), from Nixtla, implements fast statistical forecasting models, such as AutoARIMA, ETS and Theta, designed to fit thousands of series quickly.

### 86. sktime

[sktime](https://www.sktime.net/) provides a unified, scikit-learn-like interface for time series forecasting, classification, regression and transformations, with tools for proper temporal evaluation.

### 87. Darts

[Darts](https://unit8co.github.io/darts/) offers one API for many forecasting models, from classical models such as ARIMA and exponential smoothing to deep-learning models, plus backtesting utilities.

### 88. Prophet

[Prophet](https://facebook.github.io/prophet/), originally from Meta, fits an additive model with trend, seasonality and holiday effects, and is designed for business time series ([Taylor & Letham, 2018](https://doi.org/10.1080/00031305.2017.1380080)). It is easy to use, but compare it against simple baselines such as seasonal naive forecasts before trusting it.

### 89. tsfresh

[tsfresh](https://tsfresh.readthedocs.io/) automatically extracts hundreds of features from time series, such as autocorrelations, entropies and peaks, and filters them by statistical relevance, for use in ordinary classifiers and regressors.

## Geospatial data and graphs

### 90. GeoPandas

[GeoPandas](https://geopandas.org/) extends pandas with a geometry column, so you can read shapefiles and GeoJSON, reproject coordinates, run spatial joins and plot maps.

### 91. Shapely

[Shapely](https://shapely.readthedocs.io/) performs geometric operations on points, lines and polygons: intersections, buffers, distances and containment. GeoPandas uses it under the hood.

### 92. Rasterio

[Rasterio](https://rasterio.readthedocs.io/) reads and writes raster geospatial data, such as satellite imagery and elevation models, as NumPy arrays, using GDAL.

### 93. NetworkX

[NetworkX](https://networkx.org/) creates and analyzes graphs: shortest paths, centrality, communities and connectivity. It is ideal for small and medium networks; for very large graphs, look at faster alternatives such as igraph or GPU-based libraries.

### 94. PyTorch Geometric

[PyTorch Geometric](https://pytorch-geometric.readthedocs.io/) (PyG) implements graph neural networks in PyTorch, for tasks such as node classification, link prediction and molecular property prediction.

## Notebooks, MLOps and apps

### 95. JupyterLab

[JupyterLab](https://jupyter.org/) is the interactive notebook environment where much data science happens: code, output, charts and notes in one document. Move reusable code into Python modules as a project matures, because notebooks are hard to test and review.

### 96. MLflow

[MLflow](https://mlflow.org/) tracks experiments (parameters, metrics and artifacts), packages models and manages them in a model registry. It helps teams answer "which model is in production, and how was it trained?"

### 97. DVC

[DVC](https://dvc.org/) (Data Version Control) versions datasets and models alongside Git, storing the large files in remote storage, and defines reproducible pipelines.

### 98. Streamlit

[Streamlit](https://streamlit.io/) turns a Python script into an interactive web app with widgets, charts and tables, with no front-end code. It is one of the quickest ways to share an analysis or a model with non-programmers.

### 99. Gradio

[Gradio](https://www.gradio.app/) builds web demos for machine learning models, with inputs such as text, images and audio. It is widely used to share models on Hugging Face Spaces.

### 100. Dash

[Dash](https://dash.plotly.com/), from Plotly, builds analytical web applications and dashboards with Plotly charts and callbacks in pure Python. It suits more structured, multi-page dashboards than Streamlit.

## Starter stacks by role

Pick a small stack and learn it well before adding more.

- **Data analyst:** pandas, DuckDB, Matplotlib or seaborn, Plotly, openpyxl, JupyterLab.
- **Data scientist (tabular data):** pandas or Polars, scikit-learn, LightGBM or XGBoost, statsmodels, SHAP, Optuna, MLflow.
- **Machine learning engineer:** PyTorch, Lightning or Accelerate, Hugging Face Transformers, ONNX Runtime, MLflow, Ray.
- **NLP practitioner:** spaCy, Transformers, Sentence Transformers, FAISS, PEFT.
- **Forecasting:** pandas, StatsForecast or sktime, scikit-learn, Matplotlib.
- **Geospatial analyst:** GeoPandas, Shapely, Rasterio, Folium, xarray.

The core stack in action, using only libraries from the first rows of this list:

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

rng = np.random.default_rng(0)
df = pd.DataFrame({"ad_spend": rng.uniform(1, 10, 50)})
df["sales"] = 3 * df["ad_spend"] + rng.normal(0, 2, 50)

model = LinearRegression().fit(df[["ad_spend"]], df["sales"])
print(f"slope={model.coef_[0]:.2f}, R2={model.score(df[['ad_spend']], df['sales']):.3f}")

ax = df.plot.scatter(x="ad_spend", y="sales")
ax.figure.savefig("sales.png")
print("chart saved")
```

```text
slope=3.12, R2=0.944
chart saved
```

This snippet was run with NumPy 2.3.5, pandas 3.0.3, scikit-learn 1.9.0 and Matplotlib 3.11.1; the data are synthetic.

## Common mistakes when choosing libraries

- **Adding a library for something the core stack already does.** For example, scikit-learn already includes target encoding, gradient boosting and threshold tuning.
- **Choosing by popularity alone.** A popular library that is unmaintained or a poor fit for your data size costs more than a less famous, well-suited one.
- **Mixing many tools for the same job.** Pick one plotting library and one DataFrame library per project unless there is a real reason not to.
- **Ignoring licenses and model terms.** Code licenses and pretrained-model licenses can differ; check both.
- **Not pinning versions.** Record exact versions (for example in `requirements.txt` or a lock file) so results are reproducible.

## Where to go next

- New to these tools? Start with the [20 best Python libraries for data science and machine learning](/articles/python-libraries-for-machine-learning), a learning path with a tested example for each.
- Practice with the core stack in [101 Python data science projects for beginners to advanced](/articles/python-data-science-projects).
- Get fluent in pandas with [100 pandas tips and tricks for data analysis](/articles/pandas-tips-and-tricks-for-data-analysis).
- Master arrays with [101 NumPy examples to master numerical computing](/articles/numpy-examples-for-numerical-computing).
- See scikit-learn applied to real problems in [100 Python machine learning examples](/articles/python-machine-learning-examples).
- Learn the math underneath in [101 linear algebra concepts for machine learning and AI](/articles/linear-algebra-concepts-for-machine-learning).

## References

1. Harris, C. R., et al. (2020). "Array programming with NumPy." *Nature*, 585, 357–362. [doi.org/10.1038/s41586-020-2649-2](https://doi.org/10.1038/s41586-020-2649-2)
2. pandas development team. "What's new in 3.0.0 (January 21, 2026)." [pandas.pydata.org](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html)
3. Pedregosa, F., et al. (2011). "Scikit-learn: Machine Learning in Python." *JMLR*, 12, 2825–2830. [jmlr.org](https://jmlr.org/papers/v12/pedregosa11a.html)
4. Chen, T., & Guestrin, C. (2016). "XGBoost: A Scalable Tree Boosting System." *KDD 2016*. [doi.org/10.1145/2939672.2939785](https://doi.org/10.1145/2939672.2939785)
5. Ke, G., et al. (2017). "LightGBM: A Highly Efficient Gradient Boosting Decision Tree." *NeurIPS 2017*. [papers.nips.cc](https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree)
6. Prokhorenkova, L., et al. (2018). "CatBoost: unbiased boosting with categorical features." *NeurIPS 2018*. [arxiv.org/abs/1706.09516](https://arxiv.org/abs/1706.09516)
7. Lundberg, S. M., & Lee, S.-I. (2017). "A Unified Approach to Interpreting Model Predictions." *NeurIPS 2017*. [arxiv.org/abs/1705.07874](https://arxiv.org/abs/1705.07874)
8. Wolf, T., et al. (2020). "Transformers: State-of-the-Art Natural Language Processing." *EMNLP 2020: System Demonstrations*. [aclanthology.org](https://aclanthology.org/2020.emnlp-demos.6/)
9. Reimers, N., & Gurevych, I. (2019). "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks." [arxiv.org/abs/1908.10084](https://arxiv.org/abs/1908.10084)
10. Taylor, S. J., & Letham, B. (2018). "Forecasting at Scale." *The American Statistician*, 72(1), 37–45. [doi.org/10.1080/00031305.2017.1380080](https://doi.org/10.1080/00031305.2017.1380080)
11. Data-Centric AI Community. "fg-data-profiling" README (rename notice). [github.com](https://github.com/Data-Centric-AI-Community/fg-data-profiling)
12. Each library's official documentation, linked in its section above.
